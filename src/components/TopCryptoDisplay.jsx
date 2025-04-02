"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-900/50 backdrop-blur-lg border-gray-700">
            <div className="animate-pulse p-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-gray-700 mx-auto" />
              <div className="h-6 w-3/4 bg-gray-700 rounded mx-auto" />
              <div className="h-4 w-1/2 bg-gray-700 rounded mx-auto" />
              <div className="h-10 w-full bg-gray-700 rounded-lg mt-4" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {coins.map((coin, i) => {
        const isUp = coin.price_change_percentage_24h >= 0;
        
        return (
          <motion.div
            key={coin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`border overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 ${
                 "bg-gradient-to-b from-black to-gray-500 border-green-500/30"
              }`}
            >
              <CardHeader className="items-center">
                <Image
                  src={coin.image}
                  alt={coin.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </CardHeader>

              <CardContent className="text-center">
                <h3 className="text-xl font-bold text-yellow-400">
                  {coin.name} <span className="text-gray-400">({coin.symbol.toUpperCase()})</span>
                </h3>
                <p className="text-2xl my-2 text-white font-bold">
                  ₹{coin.current_price.toLocaleString()}
                </p>
                <div className={`flex items-center justify-center gap-1 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                  {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </CardContent>

              <CardFooter>
                <button className="w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-b from-yellow-900 to-yellow-500 hover:bg-yellow-600 rounded-lg transition-all">
                  Explore <ArrowUpRight size={16} />
                </button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TopCryptoDisplay;
