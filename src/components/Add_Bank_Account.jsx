"use client";
import { useState } from "react";
import axios from "axios";
import { Banknote, PlusCircle, User, Landmark, Wallet, CreditCard, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddBankAccountForm({ userId, onSuccess }) {
    const [formData, setFormData] = useState({
        AccountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        BranchName: "",
        UpiId: "",
        Amount: "",
        Currency: "INR",
        accountType: "Savings"
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [show, setShow] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("/api/AddBankAccount", {
                userId,
                ...formData
            });

            if (response.data.status) {
                setMessage("Bank account added successfully!");
                // Reset form and prepare to close
                setTimeout(() => {
                    setShow(false);
                    onSuccess(); // Notify parent component
                }, 1500);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage("Failed to add bank account. Please try again.");
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
                    exit={{ 
                        scale: 0.95, 
                        y: -20,
                        opacity: 0,
                        transition: { duration: 0.2 }
                    }}
                    className="bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl w-full max-w-2xl relative"
                >
                    <button 
                        onClick={() => onSuccess()}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-8">
                        <motion.div 
                            className="flex items-center gap-3 mb-8 justify-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Banknote className="w-7 h-7 text-indigo-600" />
                            <h2 className="text-2xl font-bold text-gray-800">Add New Bank Account</h2>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Form fields with animations */}
                            {Object.entries({
                                AccountHolderName: { icon: <User className="w-5 h-5 text-gray-400" />, placeholder: "Account Holder Name" },
                                accountNumber: { icon: <CreditCard className="w-5 h-5 text-gray-400" />, placeholder: "Account Number" },
                                ifscCode: { icon: <Landmark className="w-5 h-5 text-gray-400" />, placeholder: "IFSC Code" },
                                bankName: { placeholder: "Bank Name" },
                                BranchName: { placeholder: "Branch Name" },
                                UpiId: { placeholder: "UPI ID" }
                            }).map(([name, config], index) => (
                                <motion.div
                                    key={name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={config.icon ? "relative" : ""}
                                >
                                    {config.icon && (
                                        <div className="absolute left-3 top-3.5">
                                            {config.icon}
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        name={name}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        placeholder={config.placeholder}
                                        required={name !== "BranchName" && name !== "UpiId"}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                            config.icon ? "pl-10" : ""
                                        }`}
                                    />
                                </motion.div>
                            ))}

                            {/* Amount */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="md:col-span-2"
                            >
                                <input
                                    type="number"
                                    name="Amount"
                                    value={formData.Amount}
                                    onChange={handleChange}
                                    placeholder="Balance Amount"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </motion.div>

                            {/* Currency & Account Type */}
                            <motion.div 
                                className="flex gap-4 md:col-span-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <select
                                    name="Currency"
                                    value={formData.Currency}
                                    onChange={handleChange}
                                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>

                                <select
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                    className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="Savings">Savings</option>
                                    <option value="Current">Current</option>
                                </select>
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`md:col-span-2 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 ${
                                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
                                }`}
                            >
                                {loading ? (
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="inline-block"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                    </motion.span>
                                ) : (
                                    <>
                                        <PlusCircle className="w-5 h-5" />
                                        Add Bank Account
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mt-6 p-3 rounded-lg text-center font-medium ${
                                        message.includes("success") 
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}