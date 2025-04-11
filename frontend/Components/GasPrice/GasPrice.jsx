import React, { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

const GasPrice = () => {
  const [ethData, setEthData] = useState(null);
  const [gasData, setGasData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ethRes, gasRes] = await Promise.all([
          fetch("/api/eth-signal").then(res => {
            if (!res.ok) throw new Error(`ETH API failed with status ${res.status}`);
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('ETH API did not return JSON');
            }
            return res.json();
          }),
          fetch("/api/gas-metrics").then(res => {
            if (!res.ok) throw new Error(`Gas API failed with status ${res.status}`);
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Gas API did not return JSON');
            }
            return res.json();
          })
        ]);
  
        setEthData(ethRes);
        setGasData(gasRes);
      } catch (err) {
        console.error("Error fetching API data", err);
        setError(`Failed to load data: ${err.message}. Please check your API server.`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const renderTrendIcon = (trend) => {
    return trend === "rising" ? (
      <TrendingUp className="text-green-600" />
    ) : (
      <TrendingDown className="text-red-600" />
    );
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      {/* ETH Signal */}
      <div className="bg-purple-700 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">📈 ETH Trading Signal</h2>
        {ethData ? (
          <>
            <p className="text-3xl font-semibold">
              {ethData.recommendation === "SELL" ? "🚨 Sell Now!" : "🤑 Buy Opportunity!"}
            </p>
            <p className="mt-2 text-white/90">
              Confidence Level:{" "}
              <span className="font-mono bg-white text-indigo-700 px-2 py-1 rounded">
                {(ethData.confidence * 100).toFixed(2)}%
              </span>
            </p>
            <p className="mt-4 italic">
              {ethData.recommendation === "SELL"
                ? "The model senses a dip—might be time to exit! 💼"
                : "Momentum is building, consider entering the market! 🚀"}
            </p>
          </>
        ) : (
          <p>No ETH data found.</p>
        )}
      </div>

      {/* Gas Price Info */}
      <div className="bg-orange-500 text-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">⛽ Ethereum Gas Insights</h2>
        {gasData ? (
          <>
            <p className="text-3xl font-semibold flex items-center gap-2">
              {renderTrendIcon(gasData.trend)}
              {gasData.trend === "rising" ? "Gas Fees Going Up" : "Gas Fees Dropping"}
            </p>
            <p className="mt-2">
              Avg Future Price:{" "}
              <span className="font-mono bg-white text-orange-700 px-2 py-1 rounded">
                {gasData.average_future_price.toFixed(3)} Gwei
              </span>
            </p>
            <p className="mt-4 italic">
              {gasData.trend === "rising"
                ? "Prepare for congestion—gas fees may surge soon. ⏫"
                : "It’s a good time to execute transactions. Smooth ride ahead! 🛣️"}
            </p>
          </>
        ) : (
          <p>No gas data found.</p>
        )}
      </div>
    </div>
  );
};

export default GasPrice;
