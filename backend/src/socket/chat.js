const supabase = require('../config/supabase');

module.exports = (io, onlineUsers) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('user:online', (userId) => {
      if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;
        io.emit('users:online', Array.from(onlineUsers.keys()));
      }
    });

    socket.on('conversation:join', (conversationId) => {
      socket.join(`conv:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conv:${conversationId}`);
    });

    socket.on('message:send', async (data) => {
      try {
        const { conversation_id, sender_id, content, attachment_url, attachment_name } = data;

        if (!conversation_id || !sender_id || !content) return;

        const { data: message, error } = await supabase
          .from('messages')
          .insert({
            conversation_id,
            sender_id,
            content,
            attachment_url: attachment_url || '',
            attachment_name: attachment_name || ''
          })
          .select()
          .single();

        if (error) {
          socket.emit('error', { message: error.message });
          return;
        }

        const { data: conv } = await supabase
          .from('conversations')
          .select('participant_ids, unread_counts')
          .eq('id', conversation_id)
          .single();

        if (conv) {
          const unread = conv.unread_counts || {};
          conv.participant_ids.forEach(id => {
            if (id !== sender_id) {
              unread[id] = (unread[id] || 0) + 1;
            }
          });

          await supabase
            .from('conversations')
            .update({
              last_message: content,
              last_message_at: new Date().toISOString(),
              unread_counts: unread
            })
            .eq('id', conversation_id);
        }

        io.to(`conv:${conversation_id}`).emit('message:new', message);
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('typing:start', (data) => {
      const { conversation_id, user_id } = data;
      socket.to(`conv:${conversation_id}`).emit('typing:update', {
        conversation_id,
        user_id,
        is_typing: true
      });
    });

    socket.on('typing:stop', (data) => {
      const { conversation_id, user_id } = data;
      socket.to(`conv:${conversation_id}`).emit('typing:update', {
        conversation_id,
        user_id,
        is_typing: false
      });
    });

    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('users:online', Array.from(onlineUsers.keys()));
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
