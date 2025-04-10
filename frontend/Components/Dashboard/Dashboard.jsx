import React, { useEffect, useState } from "react";
import Card from "../ui/card";
import { Link } from 'react-router-dom';
import {
  Wallet,
  BotIcon as Robot,
  LineChart,
  TrendingUp
} from "lucide-react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, usePublicClient } from "wagmi";
import { formatEther } from "viem";
import {
  LineChart as RechartLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function Dashboard() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const publicClient = usePublicClient();

  const [walletData, setWalletData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [usdRate, setUsdRate] = useState(null);
  const [marketData, setMarketData] = useState({});

  const fetchMarketData = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
      );
      const data = await res.json();
      setMarketData({
        BTC: {
          price: data.bitcoin.usd,
          change: data.bitcoin.usd_24h_change
        },
        ETH: {
          price: data.ethereum.usd,
          change: data.ethereum.usd_24h_change
        },
        SOL: {
          price: data.solana.usd,
          change: data.solana.usd_24h_change
        }
      });
      setUsdRate(data.ethereum.usd);
    } catch (err) {
      console.error("Failed to fetch market data", err);
    }
  };

  const fetchBalance = async () => {
    if (!address || !publicClient) return;

    try {
      const balance = await publicClient.getBalance({ address });
      const ethBalance = formatEther(balance);
      const usdValue = usdRate
        ? (parseFloat(ethBalance) * usdRate).toFixed(2)
        : null;

      setWalletData({
        address,
        balance: ethBalance,
        usdValue
      });

      setChartData([
        {
          name: "Wallet #1",
          Balance: parseFloat(ethBalance)
        }
      ]);

      sendWalletAddressToServer(address);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const sendWalletAddressToServer = async (walletAddress) => {
    try {
      const response = await fetch('http://localhost:5000/api/connect-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();
      console.log('Server connection response:', data);
    } catch (error) {
      console.error('Error connecting wallet to server:', error);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isConnected && address && usdRate) {
      fetchBalance();
    }
  }, [isConnected, address, usdRate, publicClient]);

  const shortenAddress = (addr) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatChange = (change) => {
    const fixed = change?.toFixed(2);
    return change >= 0 ? `↑ ${fixed}%` : `↓ ${Math.abs(fixed)}%`;
  };

  return (
    <div className="h-screen w-screen bg-[#03221B] text-[#F1F7F6] p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2CC295] mb-2">
              Your AI-Powered Crypto Command Center
            </h2>
            <p className="text-[#2FA98C] mb-4 max-w-xl">
              Manage your assets, track performance, and get AI-driven insights.
            </p>
            <div className="mt-4 flex gap-2 items-center">
              <ConnectButton showBalance={false} chainStatus="icon" accountStatus="full" />
            </div>
          </div>
          <div className="hidden md:flex h-28 w-28 rounded-full bg-[#0B453A] items-center justify-center shadow-lg">
            <Robot className="h-14 w-14 text-[#2CC295]" />
          </div>
        </div>
      </div>
      <Link to="/commands">
  <button className="px-6 py-3 m-10  bg-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors flex items-center justify-center">
    Launch commands in a click !
   
  </button>
</Link>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {walletData && (
          <Card className="bg-[#04382C] border border-[#036249] p-4 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#2CC295]" />
              Wallet #1
            </h3>
            <p className="text-sm">
              Address:{" "}
              <span className="font-bold text-[#2CC295]">
                {shortenAddress(walletData.address)}
              </span>
            </p>
            <p className="text-sm">
              Balance:{" "}
              <span className="font-bold text-[#2CC295]">
                {parseFloat(walletData.balance).toFixed(4)} ETH
              </span>
            </p>
            {walletData.usdValue && (
              <p className="text-sm">
                ≈{" "}
                <span className="font-bold text-[#2CC295]">
                  ${walletData.usdValue} USD
                </span>
              </p>
            )}
          </Card>
        )}

        <Card className="bg-[#04382C] border border-[#036249] p-4 rounded-xl shadow-md col-span-1 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <LineChart className="h-5 w-5 text-[#2CC295]" />
            Portfolio Performance
          </h3>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#036249" />
                  <XAxis dataKey="name" stroke="#F1F7F6" />
                  <YAxis stroke="#F1F7F6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#04382C",
                      borderColor: "#036249"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Balance"
                    stroke="#2CC295"
                    strokeWidth={2}
                  />
                </RechartLineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#2FA98C]">
                Connect your wallet to see portfolio data
              </div>
            )}
          </div>
        </Card>

        {/* Market Highlights */}
        <div className="bg-[#04382C] border border-[#036249] p-4 rounded-xl shadow-md col-span-1 md:col-span-3">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2CC295]" />
            Market Highlights
          </h3>
          <ul className="text-sm grid grid-cols-1 md:grid-cols-3 gap-2">
            <li>
              BTC {formatChange(marketData?.BTC?.change)}{" "}
              <span className="text-[#2CC295]">
                (${marketData?.BTC?.price?.toLocaleString()})
              </span>
            </li>
            <li>
              ETH {formatChange(marketData?.ETH?.change)}{" "}
              <span className="text-[#2CC295]">
                (${marketData?.ETH?.price?.toLocaleString()})
              </span>
            </li>
            <li>
              SOL {formatChange(marketData?.SOL?.change)}{" "}
              <span className="text-[#2CC295]">
                (${marketData?.SOL?.price?.toLocaleString()})
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
