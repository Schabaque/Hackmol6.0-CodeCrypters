require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Wallet, ethers } = require('ethers');
const { Anthropic } = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.SERVER_PRIVATE_KEY, provider);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Predefined mapping of names to wallet addresses
const userWallets = {
  john: '0x282ABaD9a2B7DE48b1A986cbF11f62032f5c1041', // Replace with actual wallet address
  alice: '0xRecipientWalletAddressForAlice', // Example for another user
};

async function getETHBalance() {
  const balance = await provider.getBalance(wallet.address);
  const eth = ethers.formatEther(balance);
  return `${eth} Sepolia ETH`;
}

async function interpretCommandWithClaude(command) {
  const prompt = `You are a blockchain assistant. Interpret this user command and return a JSON object with the action.

Command: "${command}"

Return JSON like:
{ "action": "SEND_ETH", "recipient": "john", "amount": "0.011" }

If unknown, return:
{ "action": "UNKNOWN" }
`;

  const msg = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 50,
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

app.post('/api/process-command', async (req, res) => {
  const { command } = req.body;

  try {
    const { action, recipient, amount } = await interpretCommandWithClaude(command);

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
        return res.status(400).json({ result: `Recipient "${recipient}" not found.` });
      }

      try {
        const tx = await wallet.sendTransaction({
          to: recipientAddress,
          value: ethers.parseEther(amount),
        });

        return res.json({
          result: `Successfully sent ${amount} Sepolia ETH to ${recipient} (${recipientAddress}). Transaction hash: ${tx.hash}`,
        });
      } catch (error) {
        console.error('Error sending transaction:', error);
        return res.status(500).json({ result: 'Failed to send transaction. ' + error.message });
      }
    }

    return res.json({ result: `Sorry, I couldn't understand that command.` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error processing command' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
