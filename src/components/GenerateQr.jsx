"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import qrcode from "qrcode-generator";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function QRPage({ Amount, userId, onTransactionConfirmed }) {
  const [confirmed, setConfirmed] = useState("waiting");
  const [myid, setMyid] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const pollingInterval = useRef(null);
  const transactionAdded = useRef(false);

  // Initialize only once
  useEffect(() => {
    const newId = uuidv4();
    setMyid(newId);
    setFullData({ Amount, transactionSearchId: newId });

    return () => {
      // Clean up interval when component unmounts
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [Amount, userId]);

  // Generate QR only once
  useEffect(() => {
    if (fullData?.transactionSearchId && !qrGenerated) {
      try {
        const qr = qrcode(4, "L");
        qr.addData(JSON.stringify(fullData));
        qr.make();

        const placeholder = document.getElementById("placeHolder");
        if (placeholder) {
          placeholder.innerHTML = qr.createImgTag(6, 12);
          setQrGenerated(true);
        }
      } catch (error) {
        console.error("QR generation error:", error);
      }
    }
  }, [fullData, qrGenerated]);

  const checkTransactionStatus = useCallback(async (id) => {
    try {
      const checkConfirmation = await axios.post("/api/CheckTransaction", {
        transactionId: id,
      });

      if (checkConfirmation.data.data === "confirmed") {
        await axios.delete("/api/RemoveTransaction", {
          data: { transactionId: id },
        });
        setConfirmed("confirmed");
        onTransactionConfirmed();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Polling error:", error.message);
      return false;
    }
  }, [onTransactionConfirmed]);

  const startTransactionPolling = useCallback(async () => {
    if (confirmed !== "waiting" || !myid || transactionAdded.current) return;

    try {
      transactionAdded.current = true;
      
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

      // Clear any existing interval
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }

      // Initial immediate check
      const isConfirmed = await checkTransactionStatus(id);
      if (isConfirmed) return;

      // Then start interval for periodic checks
      pollingInterval.current = setInterval(async () => {
        time += 10;
        
        const isConfirmed = await checkTransactionStatus(id);
        if (isConfirmed) {
          clearInterval(pollingInterval.current);
          return;
        }

        if (time >= 180) {
          await axios.post("/api/TransactionFailed", {
            transactionId: id,
          });
          setConfirmed("failed");
          clearInterval(pollingInterval.current);
        }
      }, 10000);

    } catch (error) {
      console.error("Transaction error:", error.message);
      setConfirmed("failed");
    }
  }, [Amount, userId, myid, confirmed, checkTransactionStatus]);

  useEffect(() => {
    if (myid && confirmed === "waiting") {
      startTransactionPolling();
    }
  }, [myid, confirmed, startTransactionPolling]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
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
      </div>
    </div>
  );
}