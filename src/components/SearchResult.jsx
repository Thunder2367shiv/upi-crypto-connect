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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post("/api/GetStats", { vs_currency, crypto });
                if (response.data && response.data.status) {
                    setData(response.data.data);
                } else {
                    setError("No valid data received.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [vs_currency, crypto]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (error) {
        return <p className="text-center text-lg text-red-500">{error}</p>;
    }

    if (!data) {
        return <p className="text-center text-lg text-gray-700">Failed to load data.</p>;
    }

    return (
        <div className="min-h-screen text-white flex flex-col items-center p-8 pt-32">
            {/* Header */}
            <div className="text-center justify-center mb-8">
                <motion.img 
                    src={data.imageURL} 
                    alt={data.name} 
                    className="w-20 h-20 mb-4 rounded-full shadow-lg mx-auto" 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    {data.name} ({data.symbol.toUpperCase()})
                </h1>
                <p className="text-xl mt-2 text-gray-400">Live Market Stats & Analytics</p>
            </div>

            {/* Graph & Percentage Changes */}
            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
                {/* Graph Section */}
                <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">Price Chart</h2>
                    <BitcoinChart symbol={data.symbol} vs_currency={vs_currency} crypto={crypto} />
                </div>

                {/* Percentage Changes Section */}
                <div className="w-full lg:w-1/4 flex flex-col gap-12 mt-6">
                    {[
                        { label: "Price Change (24h)", value: data.price_change_percentage_24h_in_currency },
                        { label: "Price Change (7d)", value: data.price_change_percentage_7d_in_currency },
                        { label: "Price Change (30d)", value: data.price_change_percentage_30d_in_currency },
                        { label: "Price Change (1y)", value: data.price_change_percentage_1y_in_currency },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                            <h2 className="text-2xl font-semibold text-gray-400 mb-2">{item.label}</h2>
                            <p className={`text-3xl font-bold ${item.value >= 0 ? "text-green-400" : "text-red-400"}`}>
                                {item.value.toFixed(2)}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {[
                    { label: "Current Price", value: `${data.current_price} ${vs_currency}` },
                    { label: "Market Cap", value: `${data.market_cap} ${vs_currency}` },
                    { label: "Market Cap Rank", value: `#${data.market_cap_rank}` },
                    { label: "Total Volume", value: `${data.total_volume} ${vs_currency}` },
                    { label: "24h High / Low", value: `${data.high_24h} / ${data.low_24h} ${vs_currency}` },
                    { label: "All-Time High", value: `${data.ath} ${vs_currency} (${data.ath_change_percentage.toFixed(2)}%)` },
                    { label: "Circulating Supply", value: `${data.circulating_supply} ${data.symbol.toUpperCase()}` },
                    { label: "Total Supply", value: `${data.total_supply} ${data.symbol.toUpperCase()}` },
                    { label: "Max Supply", value: `${data.max_supply} ${data.symbol.toUpperCase()}` },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <h2 className="text-lg font-semibold text-gray-400 mb-2">{item.label}</h2>
                        <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResult;