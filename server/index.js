require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE || 'ailisaprobability';

console.log(`🔍 Original URI: ${mongoUri}`);
console.log(`🔍 Database name: ${dbName}`);

// Connect without specifying database in URI - let Mongoose handle it
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName
});

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log(`🔌 Connected to MongoDB database: ${dbName}`);
  console.log(`📊 Using collection: chats`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
});

// Import routes
const chatRoutes = require('./routes/chat');
const sessionRoutes = require('./routes/session');
const uploadRoutes = require('./routes/upload');

app.use('/chat', chatRoutes);
app.use('/session', sessionRoutes);
app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully!`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Database: ${dbName}`);
  console.log(`   Collection: chats`);
  console.log(`   API URL: http://localhost:${PORT}`);
  console.log(`\n📡 Available endpoints:`);
  console.log(`   POST /session - Create new chat session`);
  console.log(`   POST /chat - Send chat message`);
  console.log(`   POST /upload - Upload file`);
  console.log(`\n✅ Ready to receive requests!\n`);
});
