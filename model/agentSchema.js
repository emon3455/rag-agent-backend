const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  agent_name: {
    type: String,
    required: [true, "Agent name is required"],
  },
  knowledge: {
    type: String,
    required: [true, "Knowledge is required"],
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
});

module.exports = mongoose.model("Agent", agentSchema);