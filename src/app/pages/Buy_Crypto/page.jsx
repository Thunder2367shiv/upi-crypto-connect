"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import ConnectWallet from "@/components/ConnectWallet";
import { useToast } from "@/hooks/use-toast";
import QRPage from '@/components/GenerateQr'

const PaymentPage = () => {
  const { toast } = useToast();
  const { publicKey, connected } = useWallet();
  const [amount, setAmount] = useState(1000);
  const [solAmount, setSolAmount] = useState(0);
  const [solPrice, setSolPrice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [airdropDone, setAirdropDone] = useState(false);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  // Fetch SOL price and wallet balance
  useEffect(() => {
    const fetchData = async () => {
      try {
        const priceRes = await fetch("/api/getCryptoPrice");
        const priceData = await priceRes.json();
        if (priceData.status) {
          const price = parseFloat(priceData.data.ticker.last);
          setSolPrice(price);
          setSolAmount((amount / price).toFixed(6));
        }

        if (connected && publicKey) {
          const connection = new Connection("https://api.devnet.solana.com");
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / 1000000000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [connected, publicKey, amount]);

  useEffect(() => {
    if (solPrice) {
      setSolAmount((amount / solPrice).toFixed(6));
    }
  }, [amount, solPrice]);

  const handleAirdrop = useCallback(async () => {
    if (!solPrice) return toastError("SOL price not available");
    if (!connected) return toastError("Please connect your wallet first");
    if (airdropDone) return toastError("Airdrop already completed");
  
    const solToSend = amount / solPrice;
    const maxDevnetAirdrop = 2;
  
    if (solToSend > maxDevnetAirdrop) {
      return toastError(`Devnet limit: Maximum ${maxDevnetAirdrop} SOL per request`);
    }
  
    setIsProcessing(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const airdropAmount = Math.floor(solToSend * 1_000_000_000);
  
      const signature = await connection.requestAirdrop(
        publicKey,
        airdropAmount
      );
  
      await connection.confirmTransaction(signature);
  
      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / 1_000_000_000);
      setAirdropDone(true);
  
      toastSuccess(signature);
    } catch (error) {
      toastError(error.message);
    } finally {
      setIsProcessing(false);
    }
  }, [solPrice, connected, amount, publicKey, airdropDone]);

  // Automatically trigger airdrop when transaction is confirmed
  useEffect(() => {
    if (transactionConfirmed && !airdropDone && connected) {
      handleAirdrop();
    }
  }, [transactionConfirmed, airdropDone, connected, handleAirdrop]);

  const toastError = (message) => toast({
    className: "bg-red-500 text-white rounded-lg p-4 shadow-lg",
    title: message
  });

  const toastSuccess = (signature) => toast({
    className: "bg-green-500 text-white rounded-lg p-4 shadow-lg",
    title: "Airdrop successful!",
    description: (
      <div className="space-y-2">
        <p>You received: {solAmount} SOL</p>
        <a 
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline flex items-center gap-1"
        >
          View on Solana Explorer
        </a>
      </div>
    )
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {transactionConfirmed === false && (<QRPage 
        Amount={amount} 
        userId={userId} 
        onTransactionConfirmed={() => setTransactionConfirmed(true)}
      />)}
      
      <motion.div
        className="bg-gradient-to-t from-cyan-900 to-black rounded-xl shadow-lg w-full max-w-md p-6 border border-gray-700"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-purple-400">Devnet</span> SOL Faucet
          </h1>
          <ConnectWallet />
        </div>

        {connected && publicKey && (
          <div className="bg-gray-700 text-white rounded-lg p-3 mb-4 text-sm">
            <div className="flex justify-between">
              <span>Wallet: {`${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`}</span>
              <span className="font-bold">{balance.toFixed(2)} SOL</span>
            </div>
            {airdropDone && (
              <div className="mt-2 text-green-400 text-xs">
                Airdrop completed successfully!
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Amount (INR)</label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.valueAsNumber || 0)}
                className="w-full p-3 bg-gray-700 rounded-lg text-white"
                min="10"
                step="10"
              />
              <span className="absolute right-3 top-3 text-gray-400">₹</span>
            </div>
          </div>

          <div className="bg-gray-700 p-3 rounded-lg text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-white">Current SOL Price:</span>
              <span className="text-green-400">
                {solPrice ? `₹${solPrice.toFixed(2)}` : "Loading..."}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white">You'll receive:</span>
              <span className="text-green-400">{solAmount} SOL</span>
            </div>
          </div>

          <button
            onClick={handleAirdrop}
            disabled={!connected || !solPrice || isProcessing || airdropDone || !transactionConfirmed}
            className={`w-full p-3 rounded-lg font-medium ${
              !connected || !solPrice || airdropDone || !transactionConfirmed
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-500 text-white"
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
              connected 
                ? airdropDone 
                  ? "Airdrop Completed" 
                  : transactionConfirmed
                    ? "Buy SOL"
                    : "Complete UPI Payment First"
                : "Connect Wallet"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentPage;