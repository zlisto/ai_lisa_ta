const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  system_prompt: { type: String, required: true },
});

module.exports = mongoose.model('Agent', AgentSchema);
