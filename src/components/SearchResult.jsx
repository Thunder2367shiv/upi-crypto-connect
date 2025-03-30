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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("/api/GetStats", { vs_currency, crypto });
                if (response.data?.status) {
                    setData(response.data.data);
                } else {
                    setError("No valid data received.");
                }

                const response1 = await axios.post("/api/OpenaiResult", { "prompt": crypto });
                setPromptData(response1.data.data)
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
        <div className="min-h-screen text-white flex flex-col p-6 bg-gradient-to-br from-gray-900 to-gray-800">

            {/* Rotating Logo with Crypto Name */}
            {/* Rotating Logo with Crypto Name */}
            <div className='w-full flex flex-row justify-start items-center mb-8'>
    <motion.div
        className='w-24 h-24 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow-xl'
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
        <Image
            src={!data.imageURL ? "/not-available-circle.png" : data.imageURL}
            alt={data.name || "Crypto Logo"}
            width={90}
            height={90}
            className="rounded-full"
        />
    </motion.div>
    <span className="ml-4 text-4xl tracking-normal font-extrabold text-yellow-500">{crypto.toUpperCase()}</span>
</div>


            {/* Content Layout */}
            <div className='w-full flex gap-6'>
                {/* Left Side: Graph and Info Boxes */}
                <div className='flex-1 bg-gray-700 p-6 rounded-xl shadow-lg'>
                    <h2 className='text-2xl font-bold text-gray-100 mb-4 text-center'>Price Chart</h2>
                    <div className='w-full h-64 bg-gray-800 rounded-lg shadow-inner mb-72'>
                        <BitcoinChart symbol={data.symbol} vs_currency={vs_currency} crypto={crypto} />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        {["current_price", "market_cap", "market_cap_rank", "total_volume", "high_24h", "low_24h", "ath", "circulating_supply", "total_supply", "max_supply"].map((key, index) => (
                            <div key={index} className='bg-gray-800 p-4 rounded-lg shadow-md'>
                                <h2 className='text-lg font-semibold text-gray-400 mb-2'>{key.replace(/_/g, " ").toUpperCase()}</h2>
                                <p className='text-2xl font-bold text-green-500'>{data[key]} {vs_currency}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Prompts and Search Results */}
                <div className='flex-1 bg-gray-700 p-6 rounded-xl shadow-lg'>
                    <h2 className='text-3xl font-extrabold text-green-400 mb-4 text-center'>Crypto Information</h2>
                    <p className='text-lg text-gray-300 leading-relaxed whitespace-pre-line'>{promptData}</p>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;