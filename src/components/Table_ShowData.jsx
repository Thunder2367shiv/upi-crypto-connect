"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiStar, FiArrowUpRight, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const CryptoDashboard = ({ vs_currency, pageNumber }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await axios.post("/api/GetCryptoAllData", { vs_currency, pageNumber });
        setData(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [vs_currency, pageNumber]);

  const toggleWatchlist = (id) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredData = data.filter(coin => {
    if (activeTab === 'gainers') return coin.price_change_percentage_24h > 0;
    if (activeTab === 'losers') return coin.price_change_percentage_24h < 0;
    if (activeTab === 'watchlist') return watchlist.includes(coin.id);
    return true;
  });

  const formatValue = (value, type = 'price') => {
    if (value === null || value === undefined) return '-';
    
    if (type === 'price') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: vs_currency.toUpperCase(),
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2
      }).format(value);
    }
    
    if (type === 'percent') {
      return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
    }
    
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex space-x-1 p-1 bg-gray-800 rounded-lg">
          {['all', 'gainers', 'losers', 'watchlist'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm ${
                activeTab === tab 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'watchlist' && watchlist.length > 0 && (
                <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {watchlist.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 rounded-xl p-4 h-64 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredData.map(coin => {
              const isUp = coin.price_change_percentage_24h >= 0;
              const isWatchlisted = watchlist.includes(coin.id);
              
              return (
                <motion.div
                  key={coin.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-900/50 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 mr-3">
                        <Image
                          src={coin.imageURL || '/crypto-placeholder.png'}
                          alt={coin.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{coin.name}</h3>
                        <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleWatchlist(coin.id)}
                      className={`text-xl ${
                        isWatchlisted 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <FiStar className={isWatchlisted ? 'fill-current' : ''} />
                    </button>
                  </div>
                  
                  <div className="mb-5">
                    <p className="text-2xl font-bold mb-1">
                      {formatValue(coin.current_price)}
                    </p>
                    <div className={`flex items-center ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                      {isUp ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
                      <span>{formatValue(coin.price_change_percentage_24h, 'percent')}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => window.open(
                      `/pages/InfoPage?vs_currency=${vs_currency}&crypto=${coin.id}`,
                      '_blank'
                    )}
                    className="w-full flex items-center justify-center py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span>Details</span>
                    <FiArrowUpRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;