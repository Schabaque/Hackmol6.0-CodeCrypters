import React, { useEffect, useState } from "react";
import Card from "../ui/card";
import { Link } from "react-router-dom";
import { BotIcon as Robot, TrendingUp } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  LineChart as RechartLineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export function Dashboard() {
  const [marketData, setMarketData] = useState({});
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const fetchHistoricalData = async (coinId) => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      const data = await res.json();
      return data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price
      }));
    } catch (err) {
      console.error(`Failed to fetch historical data for ${coinId}`, err);
      return [];
    }
  };

  const fetchMarketData = async () => {
    try {
      const [priceRes, btcHistory, ethHistory, solHistory] = await Promise.all([
        fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"),
        fetchHistoricalData('bitcoin'),
        fetchHistoricalData('ethereum'),
        fetchHistoricalData('solana')
      ]);

      const priceData = await priceRes.json();

      setMarketData({
        BTC: {
          price: priceData.bitcoin.usd,
          change: priceData.bitcoin.usd_24h_change,
          history: btcHistory
        },
        ETH: {
          price: priceData.ethereum.usd,
          change: priceData.ethereum.usd_24h_change,
          history: ethHistory
        },
        SOL: {
          price: priceData.solana.usd,
          change: priceData.solana.usd_24h_change,
          history: solHistory
        }
      });
    } catch (err) {
      console.error("Failed to fetch market data", err);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatChange = (change) => {
    const fixed = change?.toFixed(2);
    return change >= 0 ? `↑ ${fixed}%` : `↓ ${Math.abs(fixed)}%`;
  };

  const handleAddRecipient = async () => {
    try {
      const res = await fetch("/api/recipients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: recipientName,
          walletAddress: recipientAddress
        })
      });

      if (res.ok) {
        alert("Recipient added successfully!");
        setRecipientName("");
        setRecipientAddress("");
        setIsModalOpen(false);
      } else {
        alert("Failed to add recipient.");
      }
    } catch (error) {
      console.error("Error adding recipient:", error);
      alert("Error adding recipient.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#03221B] text-[#F1F7F6] p-6 overflow-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-bold text-[#2CC295]">Crypto Dashboard</h2>
          <p className="text-[#2FA98C] max-w-xl">
            Track the latest cryptocurrency market trends
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="full" />
          <Link to="/commands">
            <button className="px-4 py-2 bg-[#0BD1A4] text-[#03221B] font-semibold hover:bg-[#00b892] transition rounded-lg shadow">
              Launch Commands
            </button>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#2CC295] text-white font-semibold hover:bg-[#28a67a] transition rounded-lg shadow"
          >
            Add Recipient
          </button>
        </div>
      </div>

      {/* Crypto Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["BTC", "ETH", "SOL"].map((coin) => (
          <Card key={coin} className="bg-[#04382C] border border-[#036249] p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#2CC295]" />
                {coin}
              </h3>
              <div className="text-right">
                <div className="text-[#2CC295]">
                  ${marketData?.[coin]?.price?.toLocaleString()}
                </div>
                <div className={marketData?.[coin]?.change >= 0 ? "text-green-400" : "text-red-400"}>
                  {formatChange(marketData?.[coin]?.change)}
                </div>
              </div>
            </div>
            <div className="h-48">
              {marketData?.[coin]?.history?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartLineChart data={marketData[coin].history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#036249" horizontal={false} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={
                        coin === "BTC" ? "#F7931A" : coin === "ETH" ? "#627EEA" : "#00FFA3"
                      }
                      strokeWidth={2}
                      dot={false}
                    />
                  </RechartLineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-[#2FA98C]">
                  Loading {coin} data...
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for adding recipient */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#03221B] p-6 rounded-xl w-full max-w-md text-white shadow-lg border border-[#2CC295]">
            <h2 className="text-2xl font-semibold mb-4 text-[#2CC295]">Add Recipient</h2>
            <input
              type="text"
              placeholder="Recipient Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full border border-[#2CC295] rounded-md px-4 py-2 mb-3 bg-transparent text-white placeholder:text-[#999]"
            />
            <input
              type="text"
              placeholder="Wallet Address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full border border-[#2CC295] rounded-md px-4 py-2 mb-4 bg-transparent text-white placeholder:text-[#999]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-md bg-[#2FA98C] text-[#03221B] hover:bg-[#28a67a]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecipient}
                className="px-4 py-2 rounded-md bg-[#0BD1A4] text-[#03221B] font-semibold hover:bg-[#00b892]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;