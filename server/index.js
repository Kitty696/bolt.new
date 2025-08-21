const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const LocalAIHandler = require('./local-ai-handler');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize local AI
const aiHandler = new LocalAIHandler();
aiHandler.initializeModel();

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoints
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await aiHandler.generateCode(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Bolt.new running offline on port ${PORT}`);
});
