import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const Commands = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(null);
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [provider, setProvider] = useState(null);
  const [history, setHistory] = useState([]);
  const [recipients, setRecipients] = useState({});
  const [recipientsLoaded, setRecipientsLoaded] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  useEffect(() => {
    if (address) {
      getBalance(address);
    }
  }, [address, provider]);

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        // Use the correct API URL - adjust this to match your backend server address
        const API_BASE_URL = 'http://localhost:5000'; // Change this to your actual backend URL
        const res = await fetch(`${API_BASE_URL}/api/recipients`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Raw recipients data:', data);

        // Convert list to name:address map
        const recipientMap = {};
        data.forEach(recipient => {
          recipientMap[recipient.name.toLowerCase()] = recipient.walletAddress;
        });

        setRecipients(recipientMap);
        console.log('Processed recipients:', recipientMap);
      } catch (err) {
        console.error('Failed to load recipients:', err);
      }
    };

    fetchRecipients();
  }, []);

 
  

  const getBalance = async (account) => {
    if (!provider) return;
    try {
     // await connectSepolia();
      const balanceWei = await provider.getBalance(account);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(parseFloat(balanceEth).toFixed(4));
      return parseFloat(balanceEth).toFixed(4);
    } catch (err) {
      console.error('Error fetching balance:', err);
      throw err;
    }
  };

  const sendTransaction = async (toAddress, amount) => {
    if (!address || !amount || !toAddress) {
      throw new Error('Please enter amount and recipient address.');
    }

    try {
      //await connectSepolia();

      const tx = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: toAddress,
          value: '0x' + (parseFloat(amount) * 1e18).toString(16),
        }],
      });

      await getBalance(address);
      return tx;
    } catch (err) {
      console.error('Transaction error:', err);
      throw err;
    }
  };

  const parseCommand = async (cmd) => {
    const sendMatch = cmd.match(/send\s+([0-9.]+)\s*eth\s+to\s+(.+)/i);

    if (sendMatch) {
      const amount = sendMatch[1];
      let recipientName = sendMatch[2].toLowerCase().trim();
      let toAddress;

      console.log('Parsed command:', { amount, recipientName });
      console.log('Available recipients:', recipients);

      if (recipientName.startsWith('0x') && recipientName.length === 42) {
        toAddress = recipientName;
      } else if (recipients[recipientName]) {
        toAddress = recipients[recipientName];
        console.log('Found recipient address:', toAddress);
      } else {
        return `❌ Error: Unknown recipient "${recipientName}". Available recipients: ${Object.keys(recipients).join(', ')}`;
      }

      try {
        const txHash = await sendTransaction(toAddress, amount);
        return `✅ Success! Sent ${amount} ETH to ${recipientName} (${toAddress.slice(0, 6)}...${toAddress.slice(-4)})\n🔗 TX Hash: ${txHash}`;
      } catch (err) {
        return `❌ Transaction failed: ${err.message}`;
      }
    }

    if (cmd.toLowerCase().includes("check") && cmd.toLowerCase().includes("balance")) {
      const bal = await getBalance(address);
      return `💰 Your current balance: ${bal} ETH`;
    }

    if (cmd.toLowerCase() === "list recipients") {
      if (Object.keys(recipients).length === 0) {
        return "No recipients found. Add some first!";
      }
      return `Available recipients:\n${Object.keys(recipients).map(name =>
        `- ${name}: ${recipients[name].slice(0, 6)}...${recipients[name].slice(-4)}`
      ).join('\n')}`;
    }

    return `🤖 Unknown command: "${cmd}". Try "send 0.01 eth to alice", "check my balance", or "list recipients"`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const result = await parseCommand(command);
    setResponse(result);
    setHistory(prev => [...prev, { command, response: result }]);
    setCommand('');
  };

  return (
    <div className="h-screen bg-[#0F0F1B] text-[#F1F7F6] p-6 font-mono overflow-auto">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#2CC295] mb-2">Sepolia ETH Wallet</h1>
          <p className="text-[#2FA98C]">Control your wallet with natural language commands</p>
        </header>

        <div className="bg-[#03221B] border border-[#036249] rounded-lg shadow-lg p-5 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#2CC295] border-b border-[#036249] pb-2">
            Wallet Info
          </h2>

          <div className="mb-4">
            <p className="text-sm text-[#2FA98C]">
              Wallet Status: {address ? (
                <span className="text-[#2CC295]">
                  Connected ({`${address.slice(0, 6)}...${address.slice(-4)}`}) |
                  Balance: {balance !== null ? `${balance} ETH` : 'Loading...'}
                </span>
              ) : (
                <span className="text-yellow-400">Not connected</span>
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex items-center">
              <span className="text-[#2CC295] mr-2">$</span>
              <input
                type="text"
                placeholder="Type a command (e.g., 'send 0.02 eth to yash')"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                className="flex-1 bg-[#032221] border border-[#036249] p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2CC295] text-[#F1F7F6]"
                autoFocus
              />
              <button
                type="submit"
                className="ml-2 bg-[#036249] hover:bg-[#03624C] text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Execute
              </button>
            </div>
          </form>

          {response && (
            <div className="bg-[#032221] border border-[#036249] p-3 rounded-md mb-4 whitespace-pre-wrap">
              <p className="text-[#2CC295]">{response}</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#2CC295] mb-2">Command History</h3>
              <div className="space-y-2">
                {history.slice().reverse().map((item, index) => (
                  <div key={index} className="bg-[#032221] border border-[#036249] p-3 rounded-md">
                    <p className="text-[#F1F7F6] font-bold">$ {item.command}</p>
                    <p className="text-[#2CC295] mt-1 whitespace-pre-wrap">{item.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Commands;
