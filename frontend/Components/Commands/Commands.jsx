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

  const connectSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
          throw addError;
        }
      } else {
        console.error('Failed to switch to Sepolia:', switchError);
        throw switchError;
      }
    }
  };

  const getBalance = async (account) => {
    if (!provider) return;
    try {
      await connectSepolia();
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
      await connectSepolia();

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
    try {
      cmd = cmd.toLowerCase().trim();
      
      // Check balance command
      if (cmd.includes('balance') || cmd.includes('check my balance')) {
        const bal = await getBalance(address);
        return `Your balance is ${bal} ETH`;
      }
      
      // Send ETH command
      const sendMatch = cmd.match(/send\s+([0-9.]+)\s+eth\s+to\s+(0x[a-fA-F0-9]{40}|[a-zA-Z]+)/i);
      if (sendMatch) {
        const amount = sendMatch[1];
        let toAddress = sendMatch[2];
        
        // If recipient is a name, you could map it to an address here
        // For now, we'll assume it's a valid address
        if (!toAddress.startsWith('0x')) {
          return `Error: Recipient must be a valid Ethereum address starting with 0x`;
        }
        
        const txHash = await sendTransaction(toAddress, amount);
        return `Success! Sent ${amount} ETH to ${toAddress.slice(0, 6)}...${toAddress.slice(-4)}\nTX Hash: ${txHash}`;
      }
      
      // Default response for unknown commands
      return `I didn't understand that command. Try:\n- "Check my balance"\n- "Send 0.02 ETH to 0x123..."`;
      
    } catch (error) {
      return `Error: ${error.message}`;
    }
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
                placeholder="Type a command (e.g., 'send 0.02 eth to 0x123...' or 'check my balance')"
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