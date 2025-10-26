const WebSocketServer = require('../utils/websocket');

let webSocketServer = null;

const initializeWebSocket = (server) => {
  webSocketServer = new WebSocketServer(server);
  console.log('WebSocket server initialized');
  return webSocketServer;
};

const getWebSocketServer = () => {
  if (!webSocketServer) {
    throw new Error('WebSocket server not initialized');
  }
  return webSocketServer;
};

// Middleware to attach WebSocket server to request
const attachWebSocket = (req, res, next) => {
  if (webSocketServer) {
    req.webSocketServer = webSocketServer;
  }
  next();
};

// Helper to notify soil reading changes
const notifySoilReadingChange = (type, userId, data) => {
  if (!webSocketServer) return;

  try {
    switch (type) {
      case 'created':
        webSocketServer.notifySoilReadingAdded(userId, data);
        break;
      case 'updated':
        webSocketServer.notifySoilReadingUpdated(userId, data);
        break;
      case 'deleted':
        webSocketServer.notifySoilReadingDeleted(userId, data._id);
        break;
    }
  } catch (error) {
    console.error('Error notifying soil reading change:', error);
  }
};

module.exports = {
  initializeWebSocket,
  getWebSocketServer,
  attachWebSocket,
  notifySoilReadingChange
};