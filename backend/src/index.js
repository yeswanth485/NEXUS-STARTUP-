const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const pino = require('pino');
require('dotenv').config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  redact: ['req.headers.authorization', 'req.headers.cookie', 'body.password'],
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
  pingTimeout: 60000
});

// Trust proxy for correct IP detection behind Render/Vercel
app.set('trust proxy', 1);

// Global rate limit: 200 req/min per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' },
}));

// Stricter limiter for auth endpoints: 10 req/min per IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts. Try again later.' },
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Structured request logging
app.use((req, _, next) => {
  const start = Date.now();
  req.log = logger.child({ reqId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` });
  res.on('finish', () => {
    const ms = Date.now() - start;
    if (res.statusCode >= 400) {
      req.log.warn({ method: req.method, url: req.originalUrl, status: res.statusCode, ms }, 'request');
    } else {
      req.log.info({ method: req.method, url: req.originalUrl, status: res.statusCode, ms }, 'request');
    }
  });
  next();
});

// Attach logger and io to every request
app.use((req, _, next) => { req.io = io; next(); });

// Apply auth limiter to all /api/auth routes
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/kanban', require('./routes/kanban'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/team', require('./routes/team'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Global error handler — never leaks stack traces
app.use((err, req, res, _next) => {
  req.log.error({ err }, 'unhandled error');
  res.status(500).json({ error: 'Internal server error' });
});

const onlineUsers = new Map();
require('./socket/chat')(io, onlineUsers);

server.listen(process.env.PORT || 5000, () => {
  logger.info({ port: process.env.PORT || 5000 }, 'Nexus backend');
});
