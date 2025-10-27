const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Connection string from .env:', process.env.MONGODB_URI ? 'Present' : 'Not found');

const testConnection = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/soiliq';
    console.log('Trying to connect to:', connectionString);

    const conn = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('SUCCESS: MongoDB Connected!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    
    process.exit(0);
  } catch (error) {
    console.error('FAILED: MongoDB connection error:');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('TIP: MongoDB might not be running or network issue');
    }
    
    process.exit(1);
  }
};

testConnection();