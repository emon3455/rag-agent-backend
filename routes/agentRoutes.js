const express = require("express");
const router = express.Router();
const {
  createAgent,
  askQuestion,
  getAgentsForUser,
  getAllAgents,
  updateAgent,
  deleteAgent
} = require("../controllers/agentController");

router.get("/", getAllAgents);

router.get("/userAllAgent", getAgentsForUser);

router.post("/", createAgent);

router.put("/", updateAgent);

router.delete("/", deleteAgent);

router.post("/ask-question", askQuestion);

module.exports = router;
