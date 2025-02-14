import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const TopCryptoDisplay = () => {
    const [data, setData] = useState({ topCoins: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/GetTopThree");
                if (response.data) {
                    console.log("Data uploaded successfully");
                    setData(response.data);
                }
            } catch (error) {
                console.error("Error Getting Data from Server:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {data.topCoins.map((coin, index) => (
                <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                    <Card className="w-full shadow-lg rounded-xl border bg-black border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                        <CardHeader className="flex flex-col items-center text-center p-3">
                            <motion.div whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 1 }}>
                                <Image
                                    src={coin.image}
                                    alt={coin.name}
                                    width={80}
                                    height={80}
                                    className="rounded-md mb-3"
                                />
                            </motion.div>
                            <CardTitle className="text-xl font-semibold text-white">
                                {coin.name} ({coin.symbol.toUpperCase()})
                            </CardTitle>
                            <p className="text-lg font-medium text-gray-200 ">Current Price:
                                ₹{new Intl.NumberFormat("en-IN").format(coin.current_price)}
                            </p>
                            <div className="text-yellow-300">
                                Price change percentage in 24h :  
                                <span
                                    className={`text-sm font-medium ${coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                                        }`}
                                >
                                    {coin.price_change_percentage_24h.toFixed(2)}%
                                </span>
                            </div>

                        </CardHeader>
                        <CardFooter className="flex justify-center p-4">
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button className="w-full flex items-center justify-center space-x-2 bg-white text-black font-bold">
                                    <span>Explore More</span>
                                </Button>
                            </motion.div>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default TopCryptoDisplay;
