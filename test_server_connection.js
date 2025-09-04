#!/usr/bin/env node
/**
 * Test script to verify server database connection
 * Run with: node test_server_connection.js
 */

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const ChatSession = require('./server/models/ChatSession');

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DATABASE || 'ai_lisa_probability';
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    // Ensure the database name is in the URI
    const uriWithDb = mongoUri.includes('?') 
      ? `${mongoUri}&dbName=${dbName}`
      : `${mongoUri}/${dbName}`;
    
    console.log(`   URI: ${uriWithDb}`);
    console.log(`   Database: ${dbName}`);
    console.log(`   Collection: chats`);
    
    // Connect to MongoDB
    await mongoose.connect(uriWithDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test the ChatSession model
    const sessionCount = await ChatSession.countDocuments({});
    console.log(`📊 Found ${sessionCount} chat sessions in the 'chats' collection`);
    
    // Show sample data
    if (sessionCount > 0) {
      const sampleSession = await ChatSession.findOne({});
      console.log('📝 Sample session:');
      console.log(`   Session ID: ${sampleSession.sessionId}`);
      console.log(`   Username: ${sampleSession.username}`);
      console.log(`   Member: ${sampleSession.member}`);
      console.log(`   Messages: ${sampleSession.messages.length}`);
      console.log(`   Created: ${sampleSession.createdAt}`);
    }
    
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
