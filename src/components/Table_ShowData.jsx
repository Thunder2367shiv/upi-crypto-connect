"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiArrowUpRight, FiTrendingUp, FiTrendingDown, FiStar, FiSearch } from "react-icons/fi";

const CryptoDashboard = ({ vs_currency, pageNumber, onPageChange }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [timeframe, setTimeframe] = useState('24h');

  // Load data function
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/GetCryptoAllData", {
        vs_currency,
        pageNumber,
      });
      setData(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and page change handler
  useEffect(() => {
    loadData();
  }, [vs_currency, pageNumber]);

  const toggleWatchlist = (id) => {
    setWatchlist(prev => 
      prev.includes(id) 
        ? prev.filter(coinId => coinId !== id) 
        : [...prev, id]
    );
  };

  const filteredData = data.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'gainers' && coin.price_change_percentage_24h > 0) ||
                      (activeTab === 'losers' && coin.price_change_percentage_24h < 0) ||
                      (activeTab === 'watchlist' && watchlist.includes(coin.id));
    return matchesSearch && matchesTab;
  });

  const formatValue = (value, type = 'default') => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'price':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: vs_currency.toUpperCase(),
          minimumFractionDigits: 2,
          maximumFractionDigits: value < 1 ? 6 : 2
        }).format(value);
      case 'percent':
        return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
      case 'largeNumber':
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 2
        }).format(value);
      default:
        return value;
    }
  };

  const getPriceChange = (coin) => {
    switch (timeframe) {
      case '1h': return coin.price_change_percentage_1h_in_currency;
      case '24h': return coin.price_change_percentage_24h;
      case '7d': return coin.price_change_percentage_7d_in_currency;
      case '30d': return coin.price_change_percentage_30d_in_currency;
      default: return coin.price_change_percentage_24h;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header - Always visible */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Crypto Market</h1>
          <p className="text-gray-300">Real-time cryptocurrency prices and trends</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>
          
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="1h">1h</option>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </select>
        </div>
      </div>

      {/* Tabs - Always visible */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['all', 'gainers', 'losers', 'watchlist'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } ${isLoading ? 'opacity-70' : ''}`}
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

      {/* Crypto Cards Grid - Only this part shows loading state */}
      <div className="relative min-h-[300px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 rounded-xl p-4 h-48 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredData.map((coin) => {
                const priceChange = getPriceChange(coin);
                const isWatchlisted = watchlist.includes(coin.id);
                
                return (
                  <motion.div
                    key={coin.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-gradient-to-br ${
                      priceChange > 0 
                        ? 'from-green-900/30 to-gray-900' 
                        : 'from-red-900/30 to-gray-900'
                    } border ${
                      priceChange > 0 
                        ? 'border-green-800/30' 
                        : 'border-red-800/30'
                    } rounded-xl p-4 hover:shadow-lg transition-all hover:-translate-y-1`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="relative w-10 h-10 mr-3">
                          <Image
                            src={coin.imageURL || '/crypto-placeholder.png'}
                            alt={coin.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{coin.name}</h3>
                          <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleWatchlist(coin.id)}
                        className={`p-1.5 rounded-full ${
                          isWatchlisted 
                            ? 'text-yellow-400 bg-yellow-400/10' 
                            : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                        }`}
                      >
                        <FiStar className={isWatchlisted ? 'fill-current' : ''} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {formatValue(coin.current_price, 'price')}
                        </p>
                        <div className={`flex items-center mt-1 ${
                          priceChange > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {priceChange > 0 ? (
                            <FiTrendingUp className="mr-1" />
                          ) : (
                            <FiTrendingDown className="mr-1" />
                          )}
                          <span>{formatValue(priceChange, 'percent')}</span>
                        </div>
                      </div>
                      
                      <button className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                      onClick={() => {
                        // Pass vs_currency and crypto to new tab
                        window.open(
                          `/pages/InfoPage?vs_currency=${encodeURIComponent(vs_currency.toUpperCase())}&crypto=${encodeURIComponent(coin.name)}`,
                          '_blank'
                        );
                      }}
                      >
                        Explore <FiArrowUpRight className="ml-1" />
                      </button>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between text-xs text-gray-400">
                      <div>
                        <p>Market Cap</p>
                        <p className="text-white">{formatValue(coin.market_cap, 'largeNumber')}</p>
                      </div>
                      <div className="text-right">
                        <p>24h Volume</p>
                        <p className="text-white">{formatValue(coin.total_volume, 'largeNumber')}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {!isLoading && filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No cryptocurrencies found</p>
            {activeTab === 'watchlist' && watchlist.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Add coins to your watchlist by clicking the star icon
              </p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default CryptoDashboard;