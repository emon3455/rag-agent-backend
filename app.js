const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const mongodbUri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.zyyhzcl.mongodb.net/RagDB?retryWrites=true&w=majority`;

mongoose
  .connect(mongodbUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.error('MongoDB connection error:', error));


const userRoutes = require('./routes/authRoutes');
const agentRoutes = require('./routes/agentRoutes');



app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RAG Based Agent, Your server is running successfully' });
});

app.use('/api/users', userRoutes);
app.use('/api/agents', agentRoutes);

app.get('/widget.js', (req, res) => {
  const agentId = req.query.agentId;

  if (!agentId) {
    return res.status(400).send(`console.error("Agent ID is required.");`);
  }

  res.type('text/javascript');
  res.send(`
    (function () {
      const chatWidget = document.createElement("div");
      chatWidget.style.position = "fixed";
      chatWidget.style.bottom = "10px";
      chatWidget.style.right = "10px";
      chatWidget.style.width = "360px";
      chatWidget.style.height = "400px";
      chatWidget.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
      chatWidget.style.borderRadius = "10px";
      chatWidget.style.overflow = "hidden";

      chatWidget.innerHTML = '<iframe src="https://rag-agent-frontend.vercel.app/agent-widget/${agentId}" width="100%" height="100%" style="border: none;"></iframe>';
      document.body.appendChild(chatWidget);
    })();
  `);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
