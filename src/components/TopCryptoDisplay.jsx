"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

const TopCryptoDisplay = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/GetTopThree");
        setCoins(data.topCoins || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-900/50 rounded-xl p-6 h-72 animate-pulse border border-gray-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {coins.map((coin, i) => {
        const isUp = coin.price_change_percentage_24h >= 0;
        const changeColor = isUp ? "text-green-400" : "text-red-400";
        const changeIcon = isUp ? "▲" : "▼";

        return (
          <motion.div
            key={coin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <div className="bg-gray-900/50 rounded-xl p-6 h-full flex flex-col border border-gray-800 hover:border-gray-700 transition-colors group">
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{coin.name}</h3>
                  <p className="text-gray-400">{coin.symbol.toUpperCase()}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold mb-2">
                  ₹{coin.current_price.toLocaleString()}
                </p>
                <div className={`flex items-center ${changeColor}`}>
                  <span className="mr-1">{changeIcon}</span>
                  <span>{coin.price_change_percentage_24h.toFixed(2)}%</span>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => window.open(`/pages/InfoPage?crypto=${coin.id}`, '_blank')}
                  className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <span>View Details</span>
                  <FiArrowUpRight className="ml-2" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopCryptoDisplay;