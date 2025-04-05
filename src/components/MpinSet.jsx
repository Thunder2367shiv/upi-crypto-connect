'use client';
import { useState } from "react";
import axios from "axios";
import { LockKeyhole, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetMpinForm({ userId, isUpdate = false, onSuccess }) {
    const [mpin, setMpin] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mpin.length !== 4 || isNaN(mpin)) {
            setMessage({ text: "MPIN must be a 4-digit number", type: "error" });
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("/api/Addmpin", {
                userId,
                numcode: mpin
            });

            if (response.data.status) {
                setMessage({ 
                    text: `✅ ${isUpdate ? 'MPIN updated' : 'MPIN set'} successfully!`, 
                    type: "success" 
                });
                setTimeout(() => {
                    setShow(false);
                    onSuccess?.();
                }, 1500);
            } else {
                setMessage({ text: `❌ ${response.data.message}`, type: "error" });
            }
        } catch (error) {
            setMessage({ text: "❌ Failed to set MPIN", type: "error" });
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
                    className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative"
                >
                    <button 
                        onClick={() => onSuccess()}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        <motion.div 
                            className="flex flex-col items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <motion.div
                                animate={{ 
                                    rotateY: message?.type === 'success' ? 360 : 0,
                                    scale: message?.type === 'success' ? 1.1 : 1
                                }}
                                transition={{ duration: 0.5 }}
                                className="bg-blue-100 p-3 rounded-full mb-4"
                            >
                                <LockKeyhole className="text-blue-600 w-6 h-6" />
                            </motion.div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {isUpdate ? 'Update Your MPIN' : 'Set Your MPIN'}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Secure your account with a 4-digit code
                            </p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="mt-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <input
                                    type="password"
                                    maxLength="4"
                                    value={mpin}
                                    onChange={(e) => {
                                        setMpin(e.target.value.replace(/\D/g, '')); // Only allow numbers
                                        setMessage("");
                                    }}
                                    placeholder="Enter 4-digit MPIN"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                                    required
                                />
                            </motion.div>

                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`mt-4 text-center px-4 py-2 rounded-lg text-sm font-medium ${
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
                                disabled={loading || mpin.length !== 4}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`mt-4 w-full py-3 rounded-xl font-semibold ${
                                    loading || mpin.length !== 4
                                        ? 'bg-blue-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
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
                                    isUpdate ? 'Update MPIN' : 'Set MPIN'
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}