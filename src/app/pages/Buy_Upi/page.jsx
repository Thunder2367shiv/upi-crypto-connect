"use client"

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { sendSol } from "@/lib/sendSolanaTransaction";
import { motion, AnimatePresence } from "framer-motion";
import ConnectWallet from "@/components/ConnectWallet";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { useToast } from "@/hooks/use-toast"



const PaymentPage = () => {
  const { toast } = useToast()
  const { publicKey, sendTransaction, connected } = useWallet();
  const [amount, setAmount] = useState(1000);
  const [solAmount, setSolAmount] = useState(0);
  const [solPrice, setSolPrice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSignature, setTxSignature] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch SOL price
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch("/api/getCryptoPrice");
        const data = await response.json();
        if (data.status && data.data.ticker.last) {
          setSolPrice(parseFloat(data.data.ticker.last));
          setSolAmount((1000 / parseFloat(data.data.ticker.last)).toFixed(6));
        }
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };
    fetchSolPrice();
  }, []);

  // Fetch wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        const connection = new Connection("https://api.devnet.solana.com");
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1000000000);
      }
    };
    fetchBalance();
  }, [connected, publicKey, txSignature]);

  // Update SOL amount when price or INR amount changes
  useEffect(() => {
    if (solPrice) {
      setSolAmount((amount / solPrice).toFixed(6));
    }
  }, [amount, solPrice]);

  const handlePayment = async () => {
    if (!solPrice) {
      toast({
        className: "bg-red-500 text-white rounded-lg p-4 shadow-lg",
        title: "SOL price not available. Please try again later."
      });
      return;
    }
    if (!connected || !publicKey) {
      toast({
        className: "bg-red-500 text-white rounded-lg p-4 shadow-lg",
        title: "Please connect your Phantom Wallet first."
      });
      return;
    }
    if (!recipientAddress) {
      toast({
        className: "bg-red-500 text-white rounded-lg p-4 shadow-lg",
        title: "Please enter a recipient wallet address."
      });
      return;
    }

    let recipientPublicKey;
    try {
      const cleanAddress = recipientAddress.trim();
      if (cleanAddress.length < 32 || cleanAddress.length > 44) {
        throw new Error("Address should be 32-44 characters long");
      }
      recipientPublicKey = new PublicKey(cleanAddress);

      if (recipientPublicKey.equals(publicKey)) {
        throw new Error("Cannot send SOL to yourself");
      }
    } catch (error) {
      toast({
        className: "bg-red-500 text-white rounded-lg p-4 shadow-lg",
        title: "Invalid recipient address",
        description: `Error: ${error.message}`,
      });
      return;
    }

    const solToSend = amount / solPrice;
    if (balance < solToSend) {
      toast({
        className: "bg-red-500 text-white rounded-lg p-4 shadow-lg",
        title: "Insufficient balance",
        description: `You need ${solToSend.toFixed(2)} SOL but only have ${balance.toFixed(2)} SOL.`,
      });
      return;
    }

    setIsProcessing(true);
    try {
      const signature = await sendSol(sendTransaction, publicKey, recipientPublicKey, solToSend);
      setTxSignature(signature);

      const connection = new Connection("https://api.devnet.solana.com");
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / 1000000000);

      // alert(`Transaction successful!\nSignature: ${signature}`);
      toast({
        className: "bg-green-500 text-white rounded-lg p-4 shadow-lg",
        title: (
          <span className="font-semibold text-lg">
            Transaction successful
          </span>
        ),
        description: (
          <div className="space-y-2">
            <span className="text-sm">
              Tx: {signature}
            </span>
            <br />
            <a
              href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white flex items-center space-x-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>View on Solana Explorer</span>
            </a>
          </div>
        ),
      });
      


    } catch (error) {
      toast({
        title: "Payment failed",
        description: `Error: ${error.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4 md:p-8">
      <motion.div
        className="bg-gray-800 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-700"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                <span className="text-purple-400">UPI</span> Crypto Connect
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Fast and secure SOL transfers
              </p>
            </div>
            <ConnectWallet />
          </div>

          {connected && publicKey && (
            <motion.div
              className="bg-gray-100 font-semibold text-black rounded-lg p-4 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs ">Connected Wallet</p>
                  <p className="text-sm font-mono ">
                    {`${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs ">Balance</p>
                  <p className="text-sm font-bold text-red-600 ">
                    {balance.toFixed(2)} SOL
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (INR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-200 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 font-bold focus:border-purple-500 text-green-500 placeholder-gray-400 transition-all"
                  min="10"
                  step="10"
                  placeholder="Enter amount"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-black text-lg">₹</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Recipient Wallet Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black placeholder-gray-400 transition-all"
                placeholder="Enter recipient address"
              />
            </div>

            <div className="bg-gray-100 p-4 rounded-lg border border-gray-600">
              <div className="flex justify-between text-sm text-black mb-2">
                <span className="text-sm font-semibold">Current SOL Price:</span>
                <span className="font-medium text-green-500 ">
                  {solPrice ? `₹ ${solPrice.toFixed(2)}` : "Loading..."}
                </span>
              </div>
              <div className="flex justify-between text-sm text-black">
                <span className="text-sm font-semibold">You will send:</span>
                <span className="font-medium text-green-500">
                  {solAmount} SOL
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!connected || !solPrice || !recipientAddress}
              className={`w-full py-3.5 rounded-lg font-medium transition-all ${!connected || !solPrice || !recipientAddress
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-purple-500/20"
                }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>{!connected ? "Connect Wallet First" : "Send SOL"}</>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Secured by Solana Pay</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;