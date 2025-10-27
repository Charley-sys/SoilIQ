import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';

const useWebSocket = (url = null) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const reconnectTimeoutRef = useRef(null);

  const maxReconnectAttempts = 5;
  const baseUrl = url || process.env.REACT_APP_WS_URL || `ws://localhost:5000`;

  const connect = useCallback(() => {
    if (!isAuthenticated || !user) {
      console.log('WebSocket: Not authenticated, skipping connection');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('WebSocket: No token found');
        return;
      }

      const wsUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;
      console.log('WebSocket: Connecting to', wsUrl);
      
      const newSocket = new WebSocket(wsUrl);
      setConnectionStatus('connecting');

      newSocket.onopen = () => {
        console.log('WebSocket: Connected successfully');
        setIsConnected(true);
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        setSocket(newSocket);
      };

      newSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket: Message received', message);
          setLastMessage(message);
          
          // Handle different message types
          handleIncomingMessage(message);
        } catch (error) {
          console.error('WebSocket: Error parsing message:', error);
        }
      };

      newSocket.onclose = (event) => {
        console.log(`WebSocket: Disconnected (code: ${event.code}, reason: ${event.reason})`);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setSocket(null);
        
        // Attempt reconnection if not closed normally
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          attemptReconnection();
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket: Error occurred:', error);
        setConnectionStatus('error');
      };

    } catch (error) {
      console.error('WebSocket: Connection error:', error);
      setConnectionStatus('error');
    }
  }, [isAuthenticated, user, baseUrl, reconnectAttempts]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close(1000, 'Manual disconnect');
      setSocket(null);
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, [socket]);

  const attemptReconnection = useCallback(() => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log('WebSocket: Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff
    console.log(`WebSocket: Attempting reconnection in ${delay}ms (attempt ${reconnectAttempts + 1})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      connect();
    }, delay);
  }, [reconnectAttempts, connect]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        const messageString = JSON.stringify(message);
        socket.send(messageString);
        console.log('WebSocket: Message sent', message);
        return true;
      } catch (error) {
        console.error('WebSocket: Error sending message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket: Cannot send message, socket not connected');
      return false;
    }
  }, [socket]);

  const subscribeToSoilUpdates = useCallback((farmId) => {
    return sendMessage({
      type: 'subscribe_soil_updates',
      farmId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const unsubscribeFromSoilUpdates = useCallback((farmId) => {
    return sendMessage({
      type: 'unsubscribe_soil_updates',
      farmId,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const requestCurrentData = useCallback((farmId, resource = 'soil_readings') => {
    return sendMessage({
      type: 'request_current_data',
      farmId,
      resource,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const sendPing = useCallback(() => {
    return sendMessage({
      type: 'ping',
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const handleIncomingMessage = (message) => {
    // This function can be extended to handle specific message types
    // The actual handling is done by components using this hook
  };

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated && !socket && connectionStatus === 'disconnected') {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, socket, connectionStatus, connect, disconnect]);

  // Auto-reconnect when connection is lost
  useEffect(() => {
    if (!isConnected && isAuthenticated && reconnectAttempts === 0) {
      attemptReconnection();
    }
  }, [isConnected, isAuthenticated, reconnectAttempts, attemptReconnection]);

  return {
    socket,
    isConnected,
    lastMessage,
    connectionStatus,
    reconnectAttempts,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    subscribeToSoilUpdates,
    unsubscribeFromSoilUpdates,
    requestCurrentData,
    sendPing,
    
    // Status helpers
    isConnecting: connectionStatus === 'connecting',
    isError: connectionStatus === 'error'
  };
};

export default useWebSocket;