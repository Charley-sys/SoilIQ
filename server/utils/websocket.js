const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const SoilReading = require('../models/soilReading');
const User = require('../models/user');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ 
      server,
      clientTracking: true
    });
    this.clients = new Map(); // userId -> WebSocket connection
    this.setupConnectionHandling();
  }

  setupConnectionHandling() {
    this.wss.on('connection', async (ws, request) => {
      console.log('New WebSocket connection attempt');

      try {
        // Authenticate connection using JWT from query string or headers
        const token = this.extractToken(request);
        if (!token) {
          ws.close(1008, 'Authentication required');
          return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
          ws.close(1008, 'User not found');
          return;
        }

        // Store connection with user context
        this.clients.set(user._id.toString(), ws);
        console.log(`User ${user.email} connected via WebSocket`);

        // Send welcome message with current data
        this.sendToUser(user._id.toString(), {
          type: 'connection_established',
          message: 'WebSocket connection established',
          userId: user._id.toString(),
          timestamp: new Date().toISOString()
        });

        // Handle messages from client
        ws.on('message', (data) => {
          this.handleMessage(user, data);
        });

        // Handle connection close
        ws.on('close', (code, reason) => {
          console.log(`User ${user.email} disconnected: ${code} - ${reason}`);
          this.clients.delete(user._id.toString());
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error(`WebSocket error for user ${user.email}:`, error);
          this.clients.delete(user._id.toString());
        });

      } catch (error) {
        console.error('WebSocket connection error:', error);
        ws.close(1008, 'Authentication failed');
      }
    });
  }

  extractToken(request) {
    // Try to get token from query string first
    const url = new URL(request.url, `http://${request.headers.host}`);
    const tokenFromQuery = url.searchParams.get('token');
    
    if (tokenFromQuery) {
      return tokenFromQuery;
    }

    // Try to get token from Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return null;
  }

  handleMessage(user, data) {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'ping':
          this.sendToUser(user._id.toString(), {
            type: 'pong',
            timestamp: new Date().toISOString()
          });
          break;

        case 'subscribe_soil_updates':
          this.handleSoilSubscription(user, message);
          break;

        case 'unsubscribe_soil_updates':
          this.handleSoilUnsubscription(user, message);
          break;

        case 'request_current_data':
          this.sendCurrentData(user, message);
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      this.sendToUser(user._id.toString(), {
        type: 'error',
        message: 'Invalid message format'
      });
    }
  }

  async handleSoilSubscription(user, message) {
    const { farmId } = message;
    
    // In a production app, you might want to validate farm ownership
    this.sendToUser(user._id.toString(), {
      type: 'subscription_confirmed',
      resource: 'soil_updates',
      farmId,
      timestamp: new Date().toISOString()
    });

    console.log(`User ${user.email} subscribed to soil updates for farm ${farmId}`);
  }

  handleSoilUnsubscription(user, message) {
    const { farmId } = message;
    
    this.sendToUser(user._id.toString(), {
      type: 'unsubscription_confirmed',
      resource: 'soil_updates',
      farmId,
      timestamp: new Date().toISOString()
    });

    console.log(`User ${user.email} unsubscribed from soil updates for farm ${farmId}`);
  }

  async sendCurrentData(user, message) {
    try {
      const { farmId, resource } = message;
      
      if (resource === 'soil_readings') {
        const readings = await SoilReading.find({ 
          user: user._id,
          farm: farmId 
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('farm', 'name location');

        this.sendToUser(user._id.toString(), {
          type: 'current_soil_readings',
          farmId,
          data: readings,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error sending current data:', error);
      this.sendToUser(user._id.toString(), {
        type: 'error',
        message: 'Failed to fetch current data'
      });
    }
  }

  // Broadcast soil reading to all users (for admin/demo purposes)
  broadcastSoilReading(soilReading) {
    const message = {
      type: 'soil_reading_added',
      data: soilReading,
      timestamp: new Date().toISOString()
    };

    this.broadcast(message);
  }

  // Send soil reading to specific user
  notifySoilReadingAdded(userId, soilReading) {
    this.sendToUser(userId, {
      type: 'soil_reading_added',
      data: soilReading,
      timestamp: new Date().toISOString()
    });
  }

  // Send soil reading update to specific user
  notifySoilReadingUpdated(userId, soilReading) {
    this.sendToUser(userId, {
      type: 'soil_reading_updated',
      data: soilReading,
      timestamp: new Date().toISOString()
    });
  }

  // Send soil reading deletion to specific user
  notifySoilReadingDeleted(userId, soilReadingId) {
    this.sendToUser(userId, {
      type: 'soil_reading_deleted',
      data: { _id: soilReadingId },
      timestamp: new Date().toISOString()
    });
  }

  // Send health score update
  notifyHealthScoreUpdate(userId, farmId, healthScore) {
    this.sendToUser(userId, {
      type: 'health_score_updated',
      farmId,
      healthScore,
      timestamp: new Date().toISOString()
    });
  }

  // Send alert to user
  sendAlert(userId, alert) {
    this.sendToUser(userId, {
      type: 'alert',
      data: alert,
      timestamp: new Date().toISOString()
    });
  }

  // Send notification to user
  sendNotification(userId, notification) {
    this.sendToUser(userId, {
      type: 'notification',
      data: notification,
      timestamp: new Date().toISOString()
    });
  }

  // Send message to specific user
  sendToUser(userId, message) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
        this.clients.delete(userId);
      }
    }
  }

  // Broadcast message to all connected clients
  broadcast(message) {
    const messageString = JSON.stringify(message);
    
    this.clients.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(messageString);
        } catch (error) {
          console.error(`Error broadcasting to user ${userId}:`, error);
          this.clients.delete(userId);
        }
      }
    });
  }

  // Get connected clients count
  getConnectedClientsCount() {
    return this.clients.size;
  }

  // Get list of connected users
  getConnectedUsers() {
    return Array.from(this.clients.keys());
  }

  // Health check
  healthCheck() {
    return {
      connectedClients: this.getConnectedClientsCount(),
      connectedUsers: this.getConnectedUsers(),
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = WebSocketServer;