"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import BitcoinChart from "@/components/Chart";
import { motion } from "framer-motion";
import Image from "next/image";

const SearchResult = ({ vs_currency = "inr", crypto = "bitcoin" }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [promptData, setPromptData] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch coin stats
                const [statsResponse, infoResponse] = await Promise.all([
                    axios.post("/api/GetStats", { vs_currency, crypto }),
                    axios.post("/api/OpenaiResult", { prompt: crypto })
                ]);

                if (statsResponse.data?.status) {
                    setData(statsResponse.data.data);
                } else {
                    throw new Error("No valid data received from stats API");
                }

                if (infoResponse.data?.data) {
                    setPromptData(infoResponse.data.data);
                }
            } catch (err) {
                setError(err.message || "Failed to fetch data");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [vs_currency, crypto]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <motion.div
                        className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-yellow-500 text-xl">Loading {crypto.toUpperCase()} data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <div className="bg-red-900/50 p-6 rounded-xl max-w-md text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
                    <p className="text-red-200 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-white font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-400 text-xl">No data available for {crypto.toUpperCase()}</p>
                </div>
            </div>
        );
    }

    // Format large numbers
    const formatNumber = (num) => {
        if (!num) return "N/A";
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: vs_currency.toUpperCase(),
            maximumFractionDigits: 2
        }).format(num);
    };

    const stats = [
        { label: "Current Price", value: data.current_price, key: "current_price" },
        { label: "Market Cap", value: data.market_cap, key: "market_cap" },
        { label: "Market Cap Rank", value: `#${data.market_cap_rank}`, key: "market_cap_rank" },
        { label: "24h Trading Volume", value: data.total_volume, key: "total_volume" },
        { label: "24h High", value: data.high_24h, key: "high_24h" },
        { label: "24h Low", value: data.low_24h, key: "low_24h" },
        { label: "All Time High", value: data.ath, key: "ath" },
        { label: "Circulating Supply", value: data.circulating_supply, key: "circulating_supply" },
        { label: "Total Supply", value: data.total_supply || "N/A", key: "total_supply" },
        { label: "Max Supply", value: data.max_supply || "N/A", key: "max_supply" },
    ];

    return (
        <div className="min-h-screen text-white bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 rounded-lg">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row items-center mb-8 gap-6">
                <motion.div
                    className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex-shrink-0 shadow-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    whileHover={{ scale: 1.1 }}
                >
                    <Image
                        src={data.imageURL || "/not-available-circle.png"}
                        alt={data.name || "Crypto Logo"}
                        width={96}
                        height={96}
                        className="rounded-full object-contain p-1"
                    />
                </motion.div>

                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-500">
                        {data.name || crypto.toUpperCase()}
                        <span className="text-gray-400 ml-2">({data.symbol?.toUpperCase()})</span>
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Last updated: {new Date().toLocaleString()}
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Chart */}
                <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">
                        Price Chart ({vs_currency.toUpperCase()})
                    </h2>
                    <div className="h-64 md:h-80 lg:h-96">
                        <BitcoinChart
                            symbol={data.symbol}
                            vs_currency={vs_currency}
                            crypto={crypto}
                        />
                    </div>
                </section>

                {/* Right Column - Info */}
                <section className="bg-gray-800/50 rounded-xl p-6 shadow-lg">
                    <div className="flex border-b border-gray-700 mb-6">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400"}`}
                            onClick={() => setActiveTab("overview")}
                        >
                            Overview
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "details" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400"}`}
                            onClick={() => setActiveTab("details")}
                        >
                            Details
                        </button>
                    </div>

                    {activeTab === "overview" ? (
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-xl font-bold mb-4 text-yellow-400">About {data.name}</h3>
                            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                                {promptData || "No description available."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.key}
                                    className="bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                        {stat.label}
                                    </h3>
                                    <p className="text-xl font-bold mt-1 text-green-400">
                                        {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Price Change Indicators */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 24, 7, 30, 90, 365].map((hours) => {
                    const key = `price_change_percentage_${hours}h`;
                    const value = data[key];
                    if (value === undefined || value === null) return null;

                    return (
                        <div key={key} className="bg-gray-800/50 p-1 rounded-lg text-center flex gap-8">
                            <Image
                                src={"/hour.png"}
                                alt={data.name || "Crypto Logo"}
                                width={80}
                                height={80}
                                className="rounded-full object-contain"
                            />
                            <div>
                                <p className="text-sm text-gray-400 pt-4">{hours}h Change</p>
                                <p className={`text-lg font-bold ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
                                </p>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchResult;