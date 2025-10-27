const WebSocketServer = require('../utils/websocket');

let webSocketServer = null;

const initializeWebSocket = (server) => {
  try {
    webSocketServer = new WebSocketServer(server);
    console.log('✅ WebSocket server initialized');
    return webSocketServer;
  } catch (error) {
    console.error('❌ WebSocket initialization failed:', error);
    return null;
  }
};

const getWebSocketServer = () => {
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