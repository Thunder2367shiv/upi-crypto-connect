"use client";
import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const BitcoinChart = ({ crypto = "bitcoin", vs_currency = "inr", symbol = "BTC" }) => {
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [timeRange, setTimeRange] = useState(1); // Default to 1-day

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=${vs_currency}&days=${timeRange}`
        );
        const data = await response.json();

        const formattedData = data.prices.map((entry) => ({
          date:
            timeRange === 1
              ? new Date(entry[0]).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) // Hourly for 1-day
              : new Date(entry[0]).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), // Daily for 7-day
          price: entry[1],
        }));

        setData(formattedData);

        const latestPrice = formattedData[formattedData.length - 1]?.price || 0;
        const previousPrice = formattedData[0]?.price || latestPrice;
        const change = latestPrice - previousPrice;
        const percentChange = ((change / previousPrice) * 100).toFixed(2);

        setCurrentPrice(latestPrice.toLocaleString("en-IN", { style: "currency", currency: vs_currency.toUpperCase() }));
        setPriceChange(change.toFixed(2));
        setPercentageChange(percentChange);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [crypto, vs_currency, timeRange]); // ✅ Includes props in dependency array

  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-2xl text-white w-full max-w-3xl font-inter">
      {/* Crypto Price Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-wide text-white">
          {crypto.charAt(0).toUpperCase() + crypto.slice(1)} ({symbol.toUpperCase()})
        </h2>
        <p className="text-3xl font-extrabold text-green-400">{currentPrice || "Loading..."}</p>
        <p className={`text-lg font-medium ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
          {priceChange >= 0 ? `+${priceChange}` : priceChange} ({percentageChange}%)
        </p>
      </div>

      {/* Time Range Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setTimeRange(1)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            timeRange === 1 ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          1 Day
        </button>
        <button
          onClick={() => setTimeRange(7)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            timeRange === 7 ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          7 Days
        </button>
      </div>

      {/* Price Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
          <defs>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255, 255, 255, 0.1)" vertical={false} /> {/* Horizontal grid only */}
          <XAxis
            dataKey="date"
            stroke="#ffffff"
            tick={{ fontSize: 12, fontWeight: "500" }}
            tickMargin={10}
          />
          <YAxis
            stroke="#ffffff"
            domain={["dataMin", "dataMax"]}
            tick={{ fontSize: 12, fontWeight: "500" }}
            tickMargin={10}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff", fontSize: "14px", fontWeight: "500" }}
          />
          <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={3} fill="url(#colorGreen)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BitcoinChart;
