const dotenv = require("dotenv");
const OpenAI = require("openai");
const Agent = require("../model/agentSchema");
const User = require("../model/userSchema");

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey });

async function generateEmbeddings(texts) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: texts,
    });
    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error("Error generating embeddings:", error.message);
    throw new Error("Internal Server Error");
  }
}

function cosineSimilarity(vec1, vec2) {
  const dotProduct = vec1.reduce((acc, val, i) => acc + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitude1 * magnitude2);
}

async function retrieveRelevantChunks(knowledgeBase, query, k = 3) {
  try {
    const knowledgeChunks = knowledgeBase.split("\n\n");
    const chunkEmbeddings = await generateEmbeddings(knowledgeChunks);
    const queryEmbedding = await generateEmbeddings([query]);

    if (!chunkEmbeddings.length || !queryEmbedding.length) {
      throw new Error("Empty embeddings returned from OpenAI API");
    }

    const similarities = chunkEmbeddings.map((chunkEmb) =>
      cosineSimilarity(queryEmbedding[0], chunkEmb)
    );

    const topKIndices = similarities
      .map((sim, index) => ({ sim, index }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, k)
      .map(({ index }) => index);

    return topKIndices.map((index) => knowledgeChunks[index]);
  } catch (error) {
    console.error("Error retrieving relevant chunks:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function ragChatgpt(agent, query) {
  try {
    const relevantChunks = await retrieveRelevantChunks(agent.knowledge, query);
    const context = relevantChunks.join(" ");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Your prompt is: ${agent.prompt} Here is the context: ${context}. Make sure that you haven't answered anything outside the prompt. If asked any question outside the prompt, then politely reply that this is out of your knowledge and tell them if they want to know anything related to your context.`,
        },
        { role: "user", content: `Question: ${query}\nAnswer:` },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating response:", error.message);
    throw new Error("Internal Server Error");
  }
}

// get all agents
async function getAllAgents(req, res) {
  try {
    const agents = await Agent.find().populate("user");
    if (!agents || agents.length === 0) {
      return res.status(404).json({ detail: "No agents found" });
    }
    res.json({ agents });
  } catch (error) {
    console.error("Error fetching all agents:", error.message);
    res.status(500).json({ detail: "Internal Server Error" });
  }
}

// getAgentsForUser
async function getAgentsForUser(req, res) {
  try {
    const userId = req.query.userId;
    const user = await User.findById(userId).populate("agents");
    if (!user) {
      return res.status(404).json({ detail: "User not found" });
    }
    res.json({ agents: user.agents });
  } catch (error) {
    console.error("Error fetching agents:", error.message);
    res.status(500).json({ detail: "Internal Server Error" });
  }
}

// create agent
async function createAgent(req, res) {
  try {
    const { userId, email, agent_name, knowledge, prompt } = req.body;

    const newAgent = new Agent({
      email,
      agent_name,
      knowledge,
      prompt,
      user: userId,
    });

    await newAgent.save();
    await User.findByIdAndUpdate(userId, { $push: { agents: newAgent._id } });
    res.json({ message: "Agent created successfully", newAgent });
  } catch (error) {
    console.error("Error creating agent:", error.message);
    res.status(500).json({ detail: "Internal Server Error" });
  }
}

// askQuestion
async function askQuestion(req, res) {
  const { agentId, question } = req.body;

  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ detail: "Agent not found." });
    }

    const answer = await ragChatgpt(agent, question);
    res.json({ answer });
  } catch (error) {
    console.error("Error in ask_question:", error.message);
    res.status(500).json({ detail: "Internal Server Error" });
  }
}

module.exports = {
  createAgent,
  askQuestion,
  getAgentsForUser,
  getAllAgents,
};
