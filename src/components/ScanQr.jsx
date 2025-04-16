"use client";

import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

export default function QRScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [confirmed, setConfirmed] = useState("waiting");
  const [bankAccountId, setBankAccountId] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [upiId, setUpiId] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchAccounts = async () => {
      try {
        const response = await axios.post("/api/FetchAllBankAccount", {
          userId,
        });
        setBankAccounts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching bank accounts:", error.message);
        setConfirmed("failed");
      }
    };

    fetchAccounts();
  }, [userId]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    });

    scanner.render(
      (result) => {
        scanner.clear();
        try {
          const parsedResult = JSON.parse(result);
          setScanResult(parsedResult);
        } catch (err) {
          console.error("Invalid QR Code format", err);
        }
      },
      (err) => {
        console.warn("QR scan error", err);
      }
    );

    return () => scanner.clear();
  }, []);

  const handlePay = async () => {
    if (!scanResult || !bankAccountId || !upiId) {
      alert("Please select a bank account");
      return;
    }

    try {
      const response = await axios.post('/api/TransactionUpdate', {
        transactionSearchId: scanResult.transactionSearchId,
        UpiId: upiId
      });

      if (response.data.status !== true) {
        throw new Error(response.data.message || "Transaction update failed");
      }

      const bankDeduction = await axios.post('/api/DeductMoneyBank', {
        userId,
        accountId: bankAccountId,
        requestedAmount: scanResult.Amount
      });

      if (bankDeduction.data.status === true) {
        setConfirmed("confirmed");
      } else {
        throw new Error(bankDeduction.data.message || "Bank deduction failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setConfirmed("failed");
      alert(error.response?.data?.message || error.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          QR Code Scan & Pay
        </h1>

        {!scanResult ? (
          <div id="reader" className="rounded-lg overflow-hidden border border-gray-300" />
        ) : (
          <>
            <div className="bg-gray-100 rounded-md p-4 mb-4">
              <p className="text-gray-700">
                <strong>Transaction ID:</strong>{" "}
                <span className="break-words">{scanResult.transactionSearchId}</span>
              </p>
              <p className="text-gray-700 mt-1">
                <strong>Amount:</strong> ₹{scanResult.Amount}
              </p>
            </div>

            <label className="block mb-2 font-semibold text-gray-700">
              Select Bank Account:
            </label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedBank = bankAccounts.find(acc => acc._id === selectedId);
                setBankAccountId(selectedId);
                setUpiId(selectedBank?.UpiId);
              }}
            >
              <option value="">-- Select Bank Account --</option>
              {bankAccounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.bankName} • {acc.accountNumber}
                </option>
              ))}
            </select>

            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
              onClick={handlePay}
            >
              Pay Now
            </button>

            <div className="mt-4 text-center">
              {confirmed === "confirmed" && (
                <p className="text-green-600 font-semibold text-lg animate-pulse">
                  ✅ Transaction Successful
                </p>
              )}
              {confirmed === "waiting" && (
                <p className="text-blue-600 font-semibold text-lg">
                   ⏳ Transaction Waiting
                </p>
              )}
              {confirmed === "failed" && (
                <p className="text-red-600 font-semibold text-lg">
                  ❌ Transaction Failed
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
