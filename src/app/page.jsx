"use client";
import { useState } from "react";
import TableShowData from "@/components/Table_ShowData";
import TopCryptoDisplay from "@/components/TopCryptoDisplay";
import { FiChevronDown } from "react-icons/fi";
import popularCurrencies from "@/context/popularCurrencies";

export default function Home() {
  const [vs_currency, setVsCurrency] = useState("inr");
  const [pageNumber, setPageNumber] = useState(1);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Main Content */}
      <main className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cryptocurrency
            </span>{" "}
            Market Intelligence
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Real-time data, analytics, and insights for informed crypto trading
          </p>
        </section>

        {/* Top Performers */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Top Performers</h3>
          </div>
          <TopCryptoDisplay />
        </section>

        {/* Market Dashboard */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center justify-between w-48 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition-all"
              >
                <span className="font-medium">{vs_currency.toUpperCase()}</span>
                <FiChevronDown className={`ml-2 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute z-10 mt-2 w-64 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                  <div className="p-3 border-b border-gray-700">
                    <input
                      type="text"
                      placeholder="Search currency..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {popularCurrencies
                      .filter(c => 
                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        c.code.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(currency => (
                        <button
                          key={currency.code}
                          onClick={() => {
                            setVsCurrency(currency.code.toLowerCase());
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                            vs_currency === currency.code.toLowerCase() ? 'bg-blue-900/30' : ''
                          }`}
                        >
                          {currency.code} - {currency.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber === 1}
                className={`px-4 py-2 rounded-lg ${pageNumber === 1 ? 'text-gray-500' : 'hover:bg-gray-800'}`}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-800 rounded-lg">
                Page {pageNumber}
              </span>
              <button
                onClick={() => setPageNumber(p => p + 1)}
                className="px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
            <TableShowData vs_currency={vs_currency} pageNumber={pageNumber} />
          </div>
        </section>
      </main>

    </div>
  );
}