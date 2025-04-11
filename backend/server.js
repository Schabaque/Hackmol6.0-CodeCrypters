require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Wallet, ethers } = require('ethers');
const { Anthropic } = require('@anthropic-ai/sdk');
const mongoose = require('mongoose');


const port = 5000;
const app = express();
// Use CORS with specific origin instead of the default configuration
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));
app.use(express.json());

// Log environment variables status (without revealing values)
console.log('Environment check:');
console.log('- ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);
console.log('- SEPOLIA_RPC_URL set:', !!process.env.SEPOLIA_RPC_URL);
console.log('- SERVER_PRIVATE_KEY set:', !!process.env.SERVER_PRIVATE_KEY);

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.SERVER_PRIVATE_KEY, provider);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Log wallet address for verification
console.log('Server wallet address:', wallet.address);

// Predefined mapping of names to wallet addresses
const userWallets = {
  john: '0x282ABaD9a2B7DE48b1A986cbF11f62032f5c1041',
  alice: '0xRecipientWalletAddressForAlice', // Replace with actual address
};

// Function to get ETH balance of any address (defaults to server wallet)
async function getETHBalance(address = wallet.address) {
  try {
    const balance = await provider.getBalance(address);
    const eth = ethers.formatEther(balance);
    return `${eth} Sepolia ETH`;
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error(`Failed to get balance: ${error.message}`);
  }
}

// Function to interpret commands using Claude AI
async function interpretCommandWithClaude(command) {
  try {
    console.log('Interpreting command:', command);
    
    const prompt = `You are a blockchain assistant. Interpret this user command and return a JSON object with the action.

Command: "${command}"

Return JSON like one of these:
{ "action": "SEND_ETH", "recipient": "john", "amount": "0.011" }
{ "action": "GET_BALANCE" }
{ "action": "HELP" }
{ "action": "STATUS" }
{ "action": "LIST" }

If unknown, return:
{ "action": "UNKNOWN" }`;

    const msg = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      temperature: 0,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = msg.content[0]?.text;
    console.log('Claude response:', content);
    
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing Claude response:', e);
      return { action: "UNKNOWN" };
    }
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return { action: "UNKNOWN" };
  }
}

// Function to send ETH
async function sendETH(recipient, amount) {
  try {
    console.log(`Sending ${amount} ETH to ${recipient}`);
    
    // Validate inputs
    if (!recipient || !amount) {
      throw new Error('Recipient and amount are required');
    }
    
    // Check server wallet balance
    const balanceWei = await provider.getBalance(wallet.address);
    const amountWei = ethers.parseEther(amount);
    
    if (balanceWei < amountWei) {
      throw new Error(`Insufficient balance. Server has ${ethers.formatEther(balanceWei)} ETH but tried to send ${amount} ETH`);
    }
    
    // Send transaction
    const tx = await wallet.sendTransaction({
      to: recipient,
      value: amountWei,
      gasLimit: 21000 // Standard gas limit for ETH transfers
    });
    
    console.log('Transaction sent:', tx.hash);
    return tx;
  } catch (error) {
    console.error('Error in sendETH function:', error);
    throw error;
  }
}

// Simple command handling without AI
function handleSimpleCommands(command) {
  const lowerCommand = command.toLowerCase().trim();
  
  if (lowerCommand === 'help') {
    return { 
      result: "Available commands:\n- help: Display available commands\n- status: Check system status\n- list: List available resources\n- balance: Check your ETH balance\n- send [amount] ETH to [recipient]: Send ETH to a recipient" 
    };
  }
  
  if (lowerCommand === 'status') {
    return { 
      result: `System Status: Online\nNetwork: Sepolia Testnet\nWallet: ${wallet.address}` 
    };
  }
  
  if (lowerCommand === 'list') {
    return { 
      result: "Available resources:\n- ETH balance\n- Known recipients: " + Object.keys(userWallets).join(', ')
    };
  }
  
  return null; // Not a simple command
}

// API endpoint to process commands
app.post('/api/process-command', async (req, res) => {
  console.log('Received command request:', req.body);
  const { command } = req.body;

  if (!command) {
    return res.status(400).json({ result: 'Command is required' });
  }

  try {
    // First try simple commands that don't need AI
    const simpleResult = handleSimpleCommands(command);
    if (simpleResult) {
      return res.json(simpleResult);
    }
    
    // For balance command
    if (command.toLowerCase().includes('balance')) {
      const balance = await getETHBalance();
      return res.json({ result: `Your Sepolia ETH balance is: ${balance}` });
    }
    
    // For more complex commands, use Claude
    const interpretation = await interpretCommandWithClaude(command);
    console.log('Command interpretation:', interpretation);
    
    const { action, recipient, amount } = interpretation;

    if (action === 'GET_BALANCE') {
      const balance = await getETHBalance();
      return res.json({ result: `Your Sepolia ETH balance is: ${balance}` });
    }

    if (action === 'SEND_ETH') {
      if (!recipient || !amount) {
        return res.status(400).json({ result: 'Recipient or amount is missing in the command.' });
      }

      const recipientAddress = userWallets[recipient.toLowerCase()];
      if (!recipientAddress) {
        return res.status(400).json({ result: `Recipient "${recipient}" not found. Available recipients: ${Object.keys(userWallets).join(', ')}` });
      }

      try {
        const tx = await sendETH(recipientAddress, amount);
        
        return res.json({
          result: `Successfully sent ${amount} Sepolia ETH to ${recipient} (${recipientAddress}).\nTransaction hash: ${tx.hash}`
        });
      } catch (error) {
        console.error('Error sending transaction:', error);
        return res.status(500).json({ result: `Failed to send transaction: ${error.message}` });
      }
    }

    return res.json({ result: "Sorry, I couldn't understand that command. Type 'help' for available commands." });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: `Error processing command: ${err.message}` });
  }
});
const Recipient = require('./models/Recipient');


// Add a simple test endpoint for troubleshooting
app.get('/api/test', (req, res) => {
  res.json({ result: 'API is working' });
});


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
///python ki baari 


// MongoDB connection URL
const dbURI = 'mongodb+srv://saanvichabaque:chabaque%40123@cluster0.piqojhx.mongodb.net/crypto_energy_db?retryWrites=true&w=majority&appName=Cluster0';


// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a schema for your data
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
  test_predictions: [[Number]],      // <- Double array
  future_predictions: [[Number]],    // <- Double array
  metrics: {
    avg_future_price: Number,
    trend: String,
    trend_magnitude: Number
  }
}, { collection: 'gas_predictions' });


const GasPrediction = mongoose.model('GasPrediction', gasPredictionSchema);

// Trend logic
function calculateTrend(prices) {
  if (prices.length < 2) return 'FLAT';

  const diffs = prices.slice(1).map((v, i) => v - prices[i]);
  const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;

  if (avgDiff > 0.5) return 'UP';
  if (avgDiff < -0.5) return 'DOWN';
  return 'FLAT';
}

// API route
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

// API endpoint to get recommendation and confidence
app.get('/api/eth-signal', async (req, res) => {
  try {
    const ethSignal = await EthSignal.findOne(); // Fetch the first document
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
