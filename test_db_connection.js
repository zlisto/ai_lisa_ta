#!/usr/bin/env node
/**
 * Test script to check database connection and names
 */

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DATABASE || 'ai_lisa_probability';
    
    console.log('📋 Environment variables:');
    console.log(`   MONGODB_URI: ${mongoUri ? 'Set' : 'Not set'}`);
    console.log(`   MONGODB_DATABASE: ${process.env.MONGODB_DATABASE || 'Not set (using default: ai_lisa_probability)'}`);
    console.log(`   Final database name: ${dbName}`);
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    // Test with a simple database name first
    const testDbName = 'test_db';
    const uriWithTestDb = mongoUri.includes('?') 
      ? `${mongoUri}&dbName=${testDbName}`
      : `${mongoUri}/${testDbName}`;
    
    console.log(`\n🔌 Testing connection with simple database name: ${testDbName}`);
    console.log(`   URI: ${uriWithTestDb}`);
    
    await mongoose.connect(uriWithTestDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    
    console.log('\n📋 Available databases:');
    dbs.databases.forEach(db => {
      console.log(`   - ${db.name}`);
    });
    
    // Test the target database
    console.log(`\n🔍 Testing target database: ${dbName}`);
    try {
      const targetDb = mongoose.connection.client.db(dbName);
      const collections = await targetDb.listCollections().toArray();
      console.log(`✅ Database '${dbName}' is accessible`);
      console.log(`📊 Collections in '${dbName}':`);
      if (collections.length === 0) {
        console.log('   (No collections yet - will be created automatically)');
      } else {
        collections.forEach(col => {
          console.log(`   - ${col.name}`);
        });
      }
    } catch (err) {
      console.log(`❌ Error accessing database '${dbName}': ${err.message}`);
    }
    
    // Close connection
    await mongoose.disconnect();
    console.log('\n🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
