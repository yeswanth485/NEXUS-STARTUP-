const supabase = require('../config/supabase');
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
});

module.exports = (io, onlineUsers) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Auth required'));
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return next(new Error('Invalid token'));
    socket.userId = user.id;
    next();
  });

  io.on('connection', (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    socket.join(`user_${socket.userId}`);
    socket.broadcast.emit('user_online', { userId: socket.userId });
    logger.info({ userId: socket.userId }, 'socket connected');

    socket.on('join_room', ({ conversationId }) => socket.join(`conv_${conversationId}`));
    socket.on('leave_room', ({ conversationId }) => socket.leave(`conv_${conversationId}`));

    socket.on('send_message', async ({ conversationId, content, attachmentUrl, attachmentName, attachmentType }) => {
      try {
        const { data: msg, error } = await supabase.from('messages').insert({
          conversation_id: conversationId,
          sender_id: socket.userId,
          content: content?.trim() || '',
          attachment_url: attachmentUrl || '',
          attachment_name: attachmentName || '',
          attachment_type: attachmentType || '',
          read_by: [socket.userId]
        }).select('*, sender:profiles!sender_id(id,full_name,avatar_url)').single();

        if (error) {
          logger.error({ error: error.message, conversationId, userId: socket.userId }, 'send_message insert error');
          return socket.emit('error', { message: error.message });
        }

        await supabase.from('conversations').update({
          last_message: content?.trim() || `Attachments`,
          last_message_at: new Date().toISOString()
        }).eq('id', conversationId);

        io.to(`conv_${conversationId}`).emit('new_message', msg);

        const { data: conv } = await supabase.from('conversations').select('participant_ids').eq('id', conversationId).single();
        const others = (conv?.participant_ids || []).filter(id => id !== socket.userId);
        for (const pid of others) {
          const { data: pf } = await supabase.from('profiles').select('full_name').eq('id', socket.userId).single();
          await supabase.from('notifications').insert({
            user_id: pid, type: 'new_message',
            title: `New message from ${pf?.full_name || 'Someone'}`,
            body: content?.trim()?.slice(0, 80) || 'Sent an attachment',
            link: `/chat?conv=${conversationId}`
          });
          io.to(`user_${pid}`).emit('notification', { type: 'new_message', conversationId, senderId: socket.userId });
        }
      } catch (err) {
        logger.error({ err: err.message, conversationId, userId: socket.userId }, 'send_message unhandled');
      }
    });

    socket.on('typing', ({ conversationId, isTyping }) =>
      socket.to(`conv_${conversationId}`).emit('user_typing', { userId: socket.userId, isTyping })
    );

    socket.on('mark_read', async ({ conversationId }) => {
      try {
        await supabase.rpc('mark_messages_read', { p_conversation_id: conversationId, p_user_id: socket.userId });
        io.to(`conv_${conversationId}`).emit('messages_read', { userId: socket.userId, conversationId });
      } catch (err) {
        logger.error({ err: err.message, conversationId, userId: socket.userId }, 'mark_read error');
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      socket.broadcast.emit('user_offline', { userId: socket.userId });
      logger.info({ userId: socket.userId }, 'socket disconnected');
    });
  });
};
