const express = require('express');
const router = express.Router();
const ChatSession = require('../models/ChatSession');
const Agent = require('../models/Agent');
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper function to encode image to base64
const encodeImage = (imagePath) => {
  const fs = require('fs');
  return fs.readFileSync(imagePath, { encoding: 'base64' });
};

// POST /chat
router.post('/', async (req, res) => {
  const { sessionId, username, member, message, imageData } = req.body;
  console.log('Chat request received:', { sessionId, username, member, message: message?.substring(0, 100), hasImageData: !!imageData });
  try {
    // Get or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({ sessionId, username, member, messages: [] });
    }
    
    // Get system prompt from Agent collection
    const agent = await Agent.findOne({ name: member });
    const systemPrompt = agent ? agent.system_prompt : '';
    // Log the first few lines of the system prompt for verification
    if (systemPrompt) {
      const head = systemPrompt.slice(0, 200);
      console.log('--- SYSTEM PROMPT (first 200 chars) ---\n' + head + '\n--- END SYSTEM PROMPT HEAD ---');
    } else {
      console.log('No system prompt found for agent:', member);
    }
    
    // Prepare messages array
    const messages = [];
    
    // Add system prompt (handle long prompts by chunking)
    const chunkSize = 10000;
    if (systemPrompt.split(' ').length < chunkSize) {
      messages.push({ 
        role: 'system', 
        content: [{ type: 'input_text', text: systemPrompt }] 
      });
    } else {
      const words = systemPrompt.split(' ');
      const chunks = [];
      for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(' '));
      }
      chunks.forEach(chunk => {
        messages.push({ 
          role: 'system', 
          content: [{ type: 'input_text', text: chunk }] 
        });
      });
    }
    
    // Add chat history
    session.messages.forEach(msg => {
      if (msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: [{ type: 'output_text', text: msg.content }]
        });
      } else {
        messages.push({
          role: msg.role,
          content: [{ type: 'input_text', text: msg.content }]
        });
      }
    });
    
    // Handle user message with or without image
    if (imageData) {
      // User message with image - use correct format for Responses API
      const imageMessage = [
        { type: 'input_text', text: message || "Here is the image" },
        { type: 'input_image', image_url: { url: `data:image/jpeg;base64,${imageData}` } }
      ];
      messages.push({ role: 'user', content: imageMessage });
      console.log('Added image message with', imageData.length, 'characters of base64 data');
    } else {
      // Text-only user message
      messages.push({ 
        role: 'user', 
        content: [{ type: 'input_text', text: message }] 
      });
      console.log('Added text-only message');
    }
    
    // Use Responses API + file_search (RAG with your OpenAI Vector Store)
    const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
    const useFileSearch = Boolean(vectorStoreId);

    console.log('Sending request to OpenAI with', messages.length, 'messages',
                useFileSearch ? 'and file_search' : '(no vector store)');

    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: messages,          // Responses API uses 'input' instead of 'messages'
      tools: useFileSearch ? [{
        type: 'file_search',
        vector_store_ids: [vectorStoreId]
      }] : [],
      // (optional) ask the model to cite sources in-text
      // reasoning: { effort: "medium" },   // if you want stronger retrieval reasoning
    });

    console.log('OpenAI response received');
    
    // Add user message to session (handle both text and image messages)
    if (imageData) {
      // For image messages, save a text representation
      session.messages.push({ 
        role: 'user', 
        content: message || "Sent an image" 
      });
    } else {
      // For text messages, save the actual message
      session.messages.push({ role: 'user', content: message });
    }
    
    // Responses API: easiest text is response.output_text
    const assistantResponse = response.output_text ?? (
      response.output?.[response.output.length - 1]?.content?.[0]?.text || ''
    );
    session.messages.push({ role: 'assistant', content: assistantResponse });
    
    await session.save();
    res.json({ reply: assistantResponse });
  } catch (err) {
    console.error('Chat error:', err);
    console.error('Error details:', {
      message: err.message,
      status: err.status,
      code: err.code,
      type: err.type
    });
    res.status(500).json({ 
      error: err.message,
      details: err.status || err.code || 'Unknown error'
    });
  }
});

module.exports = router;
