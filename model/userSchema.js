const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  agents: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Agent",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
