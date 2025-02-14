"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableShowData = ({ vs_currency, pageNumber }) => {
  const [data, setData] = useState([]);
  const [imageErrors, setImageErrors] = useState({}); // Store failed images

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/GetCryptoAllData", {
          vs_currency,
          pageNumber,
        });

        if (response.data) {
          console.log("Data fetched successfully");
          setData(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [vs_currency, pageNumber]);

  return (
    <div className="overflow-x-auto rounded-xl shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-6">
      <Table className="min-w-full">
        <TableCaption className="text-yellow-400 text-sm sm:text-base mb-4">
          Live Crypto Market Data
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-800 hover:bg-gray-750 transition-colors">
            <TableHead className="w-20 text-center text-gray-300 font-semibold py-3">
              Logo
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Name
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Symbol
            </TableHead>
            <TableHead className=" text-gray-300 font-semibold py-3">
              Current Price
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Price Change 24h
            </TableHead>
            <TableHead className=" text-gray-300 font-semibold py-3">
              Price Change % 24h
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              High 24h
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Low 24h
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Market Cap
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Market Cap Rank
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Market Cap Change 24h
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Market Cap Change %24h
            </TableHead>
            <TableHead className="text-gray-300 font-semibold py-3">
              Total Volume
            </TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((coin, index) => (
              <motion.tr
                key={coin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="border-b border-gray-750 hover:bg-gray-750 transition-colors"
              >
                <TableCell className="text-center py-3">
                  <Image
                    src={imageErrors[coin.id] || !coin.image ? "/not-available-circle.png" : coin.image}
                    alt={coin.name || "Crypto Logo"}
                    width={32}
                    height={32}
                    className="rounded-full"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [coin.id]: true }))
                    }
                  />

                </TableCell>
                <TableCell className="font-medium text-white py-3">
                  {coin.name}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.symbol}
                </TableCell>
                <TableCell className=" text-green-400 font-semibold py-3">
                  {coin.current_price ? coin.current_price : '0.00'}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.price_change_24h ? coin.price_change_24h : "No data"}
                </TableCell>
                <TableCell
                  className={`font-semibold py-3 ${coin.price_change_percentage_24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                    }`}
                >
                  {coin.price_change_percentage_24h
                    ? `${coin.price_change_percentage_24h.toFixed(2)}%`
                    : "0.00%"}
                </TableCell>

                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.high_24h ? coin.high_24h : "No data"}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.low_24h ? coin.low_24h : "No data"}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.market_cap ? coin.market_cap : "No data"}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.market_cap_rank ? coin.market_cap_rank : "No data"}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.market_cap_change_24h ? coin.market_cap_change_24h : "No data"}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.market_cap_change_percentage_24h ? coin.market_cap_change_percentage_24h : "No data"}
                </TableCell>
                <TableCell className="uppercase text-gray-300 py-3">
                  {coin.total_volume ? coin.total_volume : "No data"}
                </TableCell>

              </motion.tr>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan="5"
                className="text-center py-6 text-gray-400"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableShowData;
