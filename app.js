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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
