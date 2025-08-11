"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Send } from "lucide-react";
import Image from "next/image";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const typeText = (text) => {
    let index = 0;
    setTypingMessage("");
    text = text.replace(/\*/g, "");
    const interval = setInterval(() => {
      if (index < text.length) {
        setTypingMessage((prev) => prev + text[index]);
        index++;
      } else {
        clearInterval(interval);
        setMessages((prev) => [...prev, { text, sender: "bot" }]);
        setTypingMessage("");
      }
    }, 20);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axios.post("/api/ChatbotResult", { user_input: input });
      const botReply = res.data.data;
      typeText(botReply);
    } catch (error) {
      typeText("Sorry, something went wrong!");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="transition-all pointer-events-auto flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <Image
          src="/chatbot.png"
          alt="Chatbot icon"
          width={55}
          height={55}
          className="hover:rotate-12 transition-transform"
        />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, width: 0, height: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              width: 384, // 96 * 4 (since Tailwind w-96 = 384px)
              height: 500,
            }}
            exit={{ opacity: 0, scale: 0.8, width: 0, height: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            className="absolute bottom-full right-0 mb-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden pointer-events-auto flex flex-col"
            style={{ originX: 1, originY: 1 }} // Expands from bottom-right
          >
            <div className="flex justify-between items-center p-4 bg-[#033d4a] text-white">
              <div className="flex items-center gap-3">
                <Image
                  src="/chatbot.png"
                  alt="Chatbot icon"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <h2 className="font-semibold text-lg">Chat Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-t from-[#ffffff] to-[#033d4a] dark:bg-gray-800"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hide scrollbar
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-white dark:text-white">
                  <MessageSquare size={48} className="mb-4 opacity-50" />
                  <p className="text-lg font-medium">How can I help you today?</p>
                  <p className="text-sm mt-2">Ask me anything!</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${msg.sender === "user"
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"}`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {typingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-3 rounded-2xl rounded-bl-none">
                    {typingMessage}
                    <span className="ml-1 inline-block w-2 h-4 bg-gray-500 dark:bg-gray-400 animate-pulse"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#210a39] focus:border-transparent transition-all"
                  aria-label="Type your message"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="p-3 rounded-full bg-[#033d4a] text-white hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
