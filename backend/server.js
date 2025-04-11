require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Wallet, ethers } = require('ethers');
const { Anthropic } = require('@anthropic-ai/sdk');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Environment log
console.log('Environment check:');
console.log('- ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);
console.log('- SEPOLIA_RPC_URL set:', !!process.env.SEPOLIA_RPC_URL);
console.log('- SERVER_PRIVATE_KEY set:', !!process.env.SERVER_PRIVATE_KEY);

// Provider & Wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.SERVER_PRIVATE_KEY, provider);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
console.log('Server wallet address:', wallet.address);

// MongoDB connection
const dbURI = 'mongodb+srv://saanvichabaque:chabaque%40123@cluster0.piqojhx.mongodb.net/crypto_energy_db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const recipientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  walletAddress: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: props => `${props.value} is not a valid Ethereum address!`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Recipient = mongoose.model('Recipient', recipientSchema);

const ethSignalSchema = new mongoose.Schema({
  model: String,
  last_trained: Date,
  test_signals: [String],
  future_signals: [String],
  recommendation: String,
  confidence: Number,
});

const EthSignal = mongoose.model('EthSignal', ethSignalSchema, 'eth_signals');

const gasPredictionSchema = new mongoose.Schema({
  model: String,
  last_trained: Date,
  test_predictions: [[Number]],
  future_predictions: [[Number]],
  metrics: {
    avg_future_price: Number,
    trend: String,
    trend_magnitude: Number
  }
}, { collection: 'gas_predictions' });

const GasPrediction = mongoose.model('GasPrediction', gasPredictionSchema);

// ROUTES
app.get('/api/recipients', async (req, res) => {
  try {
    const recipients = await Recipient.find({});
    res.json(recipients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/recipients', async (req, res) => {
  try {
    const { name, walletAddress } = req.body;

    if (!name || !walletAddress) {
      return res.status(400).json({ message: 'Name and wallet address are required' });
    }

    const existingRecipient = await Recipient.findOne({ name: name.toLowerCase() });
    if (existingRecipient) {
      return res.status(400).json({ message: 'Recipient with this name already exists' });
    }

    const newRecipient = new Recipient({
      name: name.toLowerCase(),
      walletAddress
    });

    await newRecipient.save();
    res.status(201).json({ message: 'Recipient added successfully', recipient: newRecipient });
  } catch (err) {
    console.error('Error saving recipient:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Gas metrics
app.get('/api/gas-metrics', async (req, res) => {
  try {
    const latest = await GasPrediction.findOne().sort({ last_trained: -1 });

    if (!latest || !latest.metrics) {
      return res.status(404).json({ message: 'No metrics available' });
    }

    res.json({
      average_future_price: latest.metrics.avg_future_price,
      trend: latest.metrics.trend,
      trend_magnitude: latest.metrics.trend_magnitude
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// ETH Signal
app.get('/api/eth-signal', async (req, res) => {
  try {
    const ethSignal = await EthSignal.findOne();
    if (ethSignal) {
      res.json({
        recommendation: ethSignal.recommendation,
        confidence: ethSignal.confidence,
      });
    } else {
      res.status(404).json({ message: 'No data found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ result: 'API is working' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
