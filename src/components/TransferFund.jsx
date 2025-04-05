'use client';
import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransferToWallet({ userId, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('');

    useEffect(() => {
        const fetchBankAccounts = async () => {
            try {
                const res = await fetch('/api/FetchAllBankAccount', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });
                const data = await res.json();
                if (res.ok) {
                    setAccounts(data.data);
                    if (data.data.length > 0) {
                        setSelectedAccountId(data.data[0]._id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch bank accounts:", err);
            }
        };

        fetchBankAccounts();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedAccountId) {
            setError("Please select a bank account");
            return;
        }

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch('/api/TransferMoenyFromAccountToWallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    accountId: selectedAccountId,
                    requestedAmount: Number(amount)
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setAmount('');
                setTimeout(() => {
                    setShow(false);
                    onSuccess(); // Call parent's success handler
                }, 1500);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
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
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ 
                        scale: 0.9, 
                        y: -20,
                        opacity: 0,
                        transition: { duration: 0.2 }
                    }}
                    className="bg-white shadow-xl rounded-2xl w-full max-w-md"
                >
                    <div className="p-6">
                        <div className="text-center mb-6">
                            <motion.div
                                animate={{ 
                                    rotateY: message ? 360 : 0,
                                    scale: message ? 1.1 : 1
                                }}
                                transition={{ duration: 0.5 }}
                                className="mx-auto w-fit mb-3"
                            >
                                <FaWallet className="text-indigo-600 text-4xl" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-800">Transfer to Wallet</h2>
                            <p className="text-sm text-gray-500 mt-1">Move funds to your digital wallet</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Account</label>
                                    <select
                                        value={selectedAccountId}
                                        onChange={(e) => setSelectedAccountId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                                        required
                                    >
                                        {accounts.map(account => (
                                            <option key={account._id} value={account._id}>
                                                {account.bankName} (••••{account.accountNumber.slice(-4)})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <motion.input
                                        type="number"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                            setError(null);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                                        required
                                        whileFocus={{ scale: 1.02 }}
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {(message || error) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`text-center px-4 py-2 rounded-lg text-sm font-medium ${
                                            message ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {message || error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex gap-3 pt-2">
                                <motion.button
                                    type="submit"
                                    disabled={loading || !amount || !selectedAccountId}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                                        loading || !amount || !selectedAccountId
                                            ? 'bg-indigo-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
                                        'Transfer'
                                    )}
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        setShow(false);
                                        onSuccess();
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                                >
                                    Cancel
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}