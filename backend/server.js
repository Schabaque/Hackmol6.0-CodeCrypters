require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Wallet, ethers } = require('ethers');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.SERVER_PRIVATE_KEY, provider);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Predefined mapping of names to wallet addresses
const userWallets = {
  john: '0x282ABaD9a2B7DE48b1A986cbF11f62032f5c1041',
  alice: '0x913E7fa01ed1bE95f6D5404bbA66d2265E4406B4',
};

// Function to get ETH balance
async function getETHBalance(address) {
  const balance = await provider.getBalance(address);
  const eth = ethers.formatEther(balance);
  return `${eth} Sepolia ETH`;
}

// Function to interpret commands using Claude AI
async function interpretCommandWithClaude(command) {
  const prompt = `You are a blockchain assistant. Interpret this user command and return a JSON object with the action.

Command: "${command}"

Possible actions:
- GET_BALANCE (when user asks to check balance)
- SEND_ETH (when user wants to send ETH to someone)
- HELP (when user asks for help)
- STATUS (when user asks for system status)
- UNKNOWN (when command isn't recognized)

For GET_BALANCE, return:
{ "action": "GET_BALANCE" }

For SEND_ETH, return:
{ "action": "SEND_ETH", "recipient": "john", "amount": "0.1" }

For HELP, return:
{ "action": "HELP" }

For STATUS, return:
{ "action": "STATUS" }

If unknown, return:
{ "action": "UNKNOWN" }

Only respond with valid JSON.`;

  const msg = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 100,
    temperature: 0,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = msg.content[0]?.text;
  try {
    return JSON.parse(content);
  } catch (e) {
    return { action: "UNKNOWN" };
  }
}

// API endpoint to process commands
app.post('/api/process-command', async (req, res) => {
  const { command, userAddress } = req.body;

  if (!userAddress) {
    return res.status(400).json({ 
      result: 'Please connect your wallet to use this feature.' 
    });
  }

  try {
    const { action, recipient, amount } = await interpretCommandWithClaude(command);

    if (action === 'GET_BALANCE') {
      const balance = await getETHBalance(userAddress);
      return res.json({ result: `Your Sepolia ETH balance is: ${balance}` });
    }
    if (action === 'SEND_ETH') {
      if (!recipient || !amount) {
        return res.status(400).json({ result: 'Recipient or amount is missing in the command.' });
      }
    
      const recipientAddress = userWallets[recipient.toLowerCase()];
      if (!recipientAddress) {
        return res.status(400).json({ result: `Recipient "${recipient}" not found.` });
      }
    
      return res.json({
        action: "SEND_ETH",
        result: `Preparing to send ${amount} Sepolia ETH to ${recipient}`,
        recipientAddress,
        amount,
        recipient
      });
    }
    
    if (action === 'HELP') {
      return res.json({
        result: "Available commands:\n- check balance\n- send [amount] ETH to [name]\n- help\n- status\n\nExample: 'send 0.1 ETH to john'"
      });
    }

    if (action === 'STATUS') {
      return res.json({
        result: `System Status: Online\nNetwork: Sepolia\nServer Wallet: ${wallet.address}`
      });
    }

    return res.json({ result: `Sorry, I couldn't understand that command. Type 'help' for available commands.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      result: `Error processing command: ${err.message}` 
    });
  }
});
// Add to your existing Express app
app.get('/api/resolve-recipient', (req, res) => {
  const { name } = req.query;
  const address = userWallets[name?.toLowerCase()];
  if (!address) return res.status(404).json({ error: 'Recipient not found' });
  res.json({ address });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});