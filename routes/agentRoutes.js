const express = require("express");
const router = express.Router();
const {
  createAgent,
  askQuestion,
  getAgentsForUser,
  getAllAgents,
} = require("../controllers/agentController");

router.get("/", getAllAgents);

router.get("/userAllAgent", getAgentsForUser);

router.post("/", createAgent);

router.post("/ask-question", askQuestion);


module.exports = router;
