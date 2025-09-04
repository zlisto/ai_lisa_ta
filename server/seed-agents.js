require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Agent = require('./models/Agent');

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

console.log(`🔌 Connected to MongoDB database: ${dbName}`);
console.log(`📊 Using collection: agents`);

// Load system prompt from prompt.txt
const promptPath = path.join(__dirname, 'prompt.txt');
let lisaSystemPrompt = '';
try {
  lisaSystemPrompt = fs.readFileSync(promptPath, 'utf8');
  const head = lisaSystemPrompt.slice(0, 200);
  console.log('Loaded prompt.txt from:', promptPath);
  console.log('--- PROMPT HEAD (first 200 chars) ---\n' + head + '\n--- END PROMPT HEAD ---');
} catch (e) {
  console.error('Failed to read prompt.txt at', promptPath, e);
  process.exit(1);
}

async function seedAgents() {
  try {
    // Clear existing agents
    await Agent.deleteMany({});

    // Create Lisa agent
    const lisaAgent = new Agent({
      name: 'Lisa',
      system_prompt: lisaSystemPrompt,
    });

    await lisaAgent.save();
    console.log('✅ Lisa agent created successfully!');
    console.log('System prompt length:', lisaSystemPrompt.length, 'characters');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding agents:', error);
    process.exit(1);
  }
}

seedAgents();
