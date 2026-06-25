const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/contracts', require('./routes/contracts'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/payments', require('./routes/payments'));

app.use((req, _res, next) => { req.io = io; next(); });

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const onlineUsers = new Map();

require('./socket/chat')(io, onlineUsers);

server.listen(process.env.PORT || 5000, () =>
  console.log(`Nexus backend running on port ${process.env.PORT || 5000}`)
);
