'use client';
import { useState } from 'react';
import { FiPhone} from 'react-icons/fi';
import {X} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

export default function AddPhone({ userId, onSuccess, initialPhone = '' }) {
    const [phone, setPhone] = useState(initialPhone);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [show, setShow] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/AddPhone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, num: phone })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: data.message, type: 'success' });
                setTimeout(() => {
                    setShow(false);
                    onSuccess?.();
                }, 1500);
            } else {
                setMessage({ text: data.message, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: "Something went wrong", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: -20, opacity: 0 }}
                    className="bg-white shadow-2xl rounded-2xl w-full max-w-md relative"
                >
                    <button 
                        onClick={() => onSuccess()}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <motion.div
                                animate={{ 
                                    rotateY: message?.type === 'success' ? 360 : 0,
                                    scale: message?.type === 'success' ? 1.1 : 1
                                }}
                                transition={{ duration: 0.5 }}
                                className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-3"
                            >
                                <FiPhone className="text-blue-600 text-3xl" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {initialPhone ? 'Update Phone Number' : 'Link Your Phone'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Secure your account with your mobile number
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <input
                                    type="tel"
                                    placeholder="e.g. +1 123-456-7890"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        setMessage(null);
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                    required
                                />
                            </motion.div>

                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-center px-4 py-2 rounded-lg text-sm font-medium ${
                                            message.type === 'success' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 px-4 rounded-xl text-white font-semibold ${
                                    loading
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1 }}
                                            className="inline-block mr-2"
                                        >
                                            ↻
                                        </motion.span>
                                        Processing...
                                    </span>
                                ) : (
                                    initialPhone ? 'Update Number' : 'Save Number'
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}