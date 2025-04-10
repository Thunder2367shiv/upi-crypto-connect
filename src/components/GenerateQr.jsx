"use client";

import { useEffect, useState, useCallback } from "react";
import qrcode from "qrcode-generator";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function QRPage({ Amount, userId }) {
  const [confirmed, setConfirmed] = useState("waiting");
  const [myid, setMyid] = useState(null);
  const [fullData, setFullData] = useState(null);

  // Generate myid and fullData
  useEffect(() => {
    const newId = uuidv4();
    setMyid(newId);
    setFullData({ Amount, transactionSearchId: newId });
  }, [Amount, userId]);

  // Generate the QR code
  useEffect(() => {
    if (fullData?.transactionSearchId) {
      try {
        const qr = qrcode(4, "L");
        qr.addData(JSON.stringify(fullData));
        qr.make();

        const placeholder = document.getElementById("placeHolder");
        if (placeholder) {
          placeholder.innerHTML = qr.createImgTag(6, 12);
        }
      } catch (error) {
        console.error("QR generation error:", error);
      }
    }
  }, [fullData]);

  // Start transaction + polling
  const startTransactionPolling = useCallback(async () => {
    try {
      const response = await axios.post("/api/ADDTransaction", {
        Amount,
        userId,
        transactionSearchId: myid,
      });

      if (response.status !== 200 || response.data.status === false) {
        setConfirmed("failed");
        return;
      }

      const id = response.data.id || myid;
      let time = 0;

      const interval = setInterval(async () => {
        try {
          const checkConfirmation = await axios.post("/api/CheckTransaction", {
            transactionId: id,
          });

          if (checkConfirmation.data.data === "confirmed") {
            await axios.delete("/api/RemoveTransaction", {
              data: { transactionId: id },
            });
            setConfirmed("confirmed");
            clearInterval(interval);
            return;
          }

          time += 10;
          if (time >= 180) {
            await axios.post("/api/TransactionFailed", {
              transactionId: id,
            });
            setConfirmed("failed");
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Polling error:", error.message);
        }
      }, 10000);

      return () => clearInterval(interval); // Clean up
    } catch (error) {
      console.error("Transaction error:", error.message);
      setConfirmed("failed");
    }
  }, [Amount, userId, myid]);

  useEffect(() => {
    if (myid) {
      startTransactionPolling();
    }
  }, [myid, startTransactionPolling]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          UPI Crypto Payment
        </h1>
        <div id="placeHolder" className="flex justify-center mb-6" />
        <div className="text-lg font-medium text-gray-700">
          Status:{" "}
          {confirmed === "confirmed" ? (
            <span className="text-green-600 animate-pulse">✅ Confirmed</span>
          ) : confirmed === "waiting" ? (
            <span className="text-yellow-600 animate-pulse">
              ⏳ Waiting for confirmation
            </span>
          ) : confirmed === "failed" ? (
            <span className="text-red-600">❌ Failed</span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-gray-500">Transaction ID: {myid}</p>
        <p className="mt-1 text-sm text-gray-500">Amount: ₹{Amount}</p>
      </div>
    </div>
  );
}
