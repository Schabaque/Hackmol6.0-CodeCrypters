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

  return (
    <div className="min-h-screen w-full bg-[#03221B] text-[#F1F7F6] p-6 overflow-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2CC295]">
              Crypto Dashboard
            </h2>
            <Link to="/commands">
              <button className="px-4 py-2 bg-teal-200 text-teal-800 font-medium hover:bg-teal-100 transition-colors rounded-lg whitespace-nowrap">
                Launch commands
              </button>
            </Link>
          </div>
          <p className="text-[#2FA98C] max-w-xl mb-4">
            Track the latest cryptocurrency market trends
          </p>
          <ConnectButton 
            showBalance={false} 
            chainStatus="icon" 
            accountStatus="full" 
          />
        </div>
        
        <div className="hidden md:flex h-28 w-28 rounded-full bg-[#0B453A] items-center justify-center shadow-lg mt-4 md:mt-0">
          <Robot className="h-14 w-14 text-[#2CC295]" />
        </div>
      </div>

      {/* Crypto Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BTC Chart */}
        <Card className="bg-[#04382C] border border-[#036249] p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#2CC295]" />
              BTC
            </h3>
            <div className="text-right">
              <div className="text-[#2CC295]">
                ${marketData?.BTC?.price?.toLocaleString()}
              </div>
              <div className={marketData?.BTC?.change >= 0 ? "text-green-400" : "text-red-400"}>
                {formatChange(marketData?.BTC?.change)}
              </div>
            </div>
          </div>
          <div className="h-48">
            {marketData?.BTC?.history?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart data={marketData.BTC.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#036249" horizontal={false} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#F7931A"
                    strokeWidth={2}
                    dot={false}
                  />
                </RechartLineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#2FA98C]">
                Loading BTC data...
              </div>
            )}
          </div>
        </Card>

        {/* ETH Chart */}
        <Card className="bg-[#04382C] border border-[#036249] p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#2CC295]" />
              ETH
            </h3>
            <div className="text-right">
              <div className="text-[#2CC295]">
                ${marketData?.ETH?.price?.toLocaleString()}
              </div>
              <div className={marketData?.ETH?.change >= 0 ? "text-green-400" : "text-red-400"}>
                {formatChange(marketData?.ETH?.change)}
              </div>
            </div>
          </div>
          <div className="h-48">
            {marketData?.ETH?.history?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart data={marketData.ETH.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#036249" horizontal={false} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#627EEA"
                    strokeWidth={2}
                    dot={false}
                  />
                </RechartLineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#2FA98C]">
                Loading ETH data...
              </div>
            )}
          </div>
        </Card>

        {/* SOL Chart */}
        <Card className="bg-[#04382C] border border-[#036249] p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#2CC295]" />
              SOL
            </h3>
            <div className="text-right">
              <div className="text-[#2CC295]">
                ${marketData?.SOL?.price?.toLocaleString()}
              </div>
              <div className={marketData?.SOL?.change >= 0 ? "text-green-400" : "text-red-400"}>
                {formatChange(marketData?.SOL?.change)}
              </div>
            </div>
          </div>
          <div className="h-48">
            {marketData?.SOL?.history?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart data={marketData.SOL.history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#036249" horizontal={false} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#00FFA3"
                    strokeWidth={2}
                    dot={false}
                  />
                </RechartLineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-[#2FA98C]">
                Loading SOL data...
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;