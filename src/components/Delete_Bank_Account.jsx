"use client";

import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Delete_Bank_Account({ userId, accountId, accountName, onSuccess }) {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [show, setShow] = useState(true);

  const handleDelete = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.delete("/api/DeleteBankAccount", {
        data: {
          userId,
          bankAccountId: accountId
        }
      });

      if (res.data.status) {
        setConfirmed(true);
        setMessage({ type: "success", text: res.data.message });
        
        // Start the pop-out animation
        setTimeout(() => {
          setShow(false);
          onSuccess(); // Call the parent's success handler
        }, 1000);
      } else {
        setMessage({ type: "error", text: res.data.message });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to delete account"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
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
            className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center"
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            
            {!confirmed ? (
              <>
                <p className="mb-6 text-gray-600">
                  Are you sure you want to delete {accountName}?
                </p>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 px-3 py-2 rounded text-sm ${
                      message.type === "success" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}

                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    {loading ? "Deleting..." : "Yes, Delete"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSuccess()}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </motion.button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-600 font-medium py-4"
              >
                Account deleted successfully!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}