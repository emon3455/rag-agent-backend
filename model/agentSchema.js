const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  email: String,
  agent_name: String,
  knowledge: String,
  prompt: String,
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Agent", agentSchema);
