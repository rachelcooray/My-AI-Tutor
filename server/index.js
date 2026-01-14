require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CIMA AI Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
