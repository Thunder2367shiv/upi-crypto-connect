"use client";
import { useState, useEffect } from "react";
import TableShowData from "@/components/Table_ShowData";
import TopCryptoDisplay from "@/components/TopCryptoDisplay";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const currency = [
  { "code": "AED", "name": "United Arab Emirates Dirham" },
  { "code": "AFN", "name": "Afghan Afghani" },
  { "code": "ALL", "name": "Albanian Lek" },
  { "code": "AMD", "name": "Armenian Dram" },
  { "code": "ANG", "name": "Netherlands Antillean Guilder" },
  { "code": "AOA", "name": "Angolan Kwanza" },
  { "code": "ARS", "name": "Argentine Peso" },
  { "code": "AUD", "name": "Australian Dollar" },
  { "code": "AWG", "name": "Aruban Florin" },
  { "code": "AZN", "name": "Azerbaijani Manat" },
  { "code": "BAM", "name": "Bosnia-Herzegovina Convertible Mark" },
  { "code": "BBD", "name": "Barbadian Dollar" },
  { "code": "BDT", "name": "Bangladeshi Taka" },
  { "code": "BGN", "name": "Bulgarian Lev" },
  { "code": "BHD", "name": "Bahraini Dinar" },
  { "code": "BIF", "name": "Burundian Franc" },
  { "code": "BMD", "name": "Bermudian Dollar" },
  { "code": "BND", "name": "Brunei Dollar" },
  { "code": "BOB", "name": "Bolivian Boliviano" },
  { "code": "BRL", "name": "Brazilian Real" },
  { "code": "BSD", "name": "Bahamian Dollar" },
  { "code": "BTN", "name": "Bhutanese Ngultrum" },
  { "code": "BWP", "name": "Botswana Pula" },
  { "code": "BYN", "name": "Belarusian Ruble" },
  { "code": "BZD", "name": "Belize Dollar" },
  { "code": "CAD", "name": "Canadian Dollar" },
  { "code": "CDF", "name": "Congolese Franc" },
  { "code": "CHF", "name": "Swiss Franc" },
  { "code": "CLP", "name": "Chilean Peso" },
  { "code": "CNY", "name": "Chinese Yuan" },
  { "code": "COP", "name": "Colombian Peso" },
  { "code": "CRC", "name": "Costa Rican Colón" },
  { "code": "CUP", "name": "Cuban Peso" },
  { "code": "CVE", "name": "Cape Verdean Escudo" },
  { "code": "CZK", "name": "Czech Koruna" },
  { "code": "DJF", "name": "Djiboutian Franc" },
  { "code": "DKK", "name": "Danish Krone" },
  { "code": "DOP", "name": "Dominican Peso" },
  { "code": "DZD", "name": "Algerian Dinar" },
  { "code": "EGP", "name": "Egyptian Pound" },
  { "code": "ERN", "name": "Eritrean Nakfa" },
  { "code": "ETB", "name": "Ethiopian Birr" },
  { "code": "EUR", "name": "Euro" },
  { "code": "FJD", "name": "Fijian Dollar" },
  { "code": "GBP", "name": "British Pound Sterling" },
  { "code": "GEL", "name": "Georgian Lari" },
  { "code": "GHS", "name": "Ghanaian Cedi" },
  { "code": "GIP", "name": "Gibraltar Pound" },
  { "code": "GMD", "name": "Gambian Dalasi" },
  { "code": "GNF", "name": "Guinean Franc" },
  { "code": "GTQ", "name": "Guatemalan Quetzal" },
  { "code": "GYD", "name": "Guyanese Dollar" },
  { "code": "HKD", "name": "Hong Kong Dollar" },
  { "code": "HNL", "name": "Honduran Lempira" },
  { "code": "HRK", "name": "Croatian Kuna" },
  { "code": "HTG", "name": "Haitian Gourde" },
  { "code": "HUF", "name": "Hungarian Forint" },
  { "code": "IDR", "name": "Indonesian Rupiah" },
  { "code": "ILS", "name": "Israeli New Shekel" },
  { "code": "INR", "name": "Indian Rupee" },
  { "code": "IQD", "name": "Iraqi Dinar" },
  { "code": "IRR", "name": "Iranian Rial" },
  { "code": "ISK", "name": "Icelandic Króna" },
  { "code": "JMD", "name": "Jamaican Dollar" },
  { "code": "JOD", "name": "Jordanian Dinar" },
  { "code": "JPY", "name": "Japanese Yen" },
  { "code": "KES", "name": "Kenyan Shilling" },
  { "code": "KGS", "name": "Kyrgyzstani Som" },
  { "code": "KHR", "name": "Cambodian Riel" },
  { "code": "KMF", "name": "Comorian Franc" },
  { "code": "KRW", "name": "South Korean Won" },
  { "code": "KWD", "name": "Kuwaiti Dinar" },
  { "code": "KZT", "name": "Kazakhstani Tenge" },
  { "code": "LAK", "name": "Lao Kip" },
  { "code": "LBP", "name": "Lebanese Pound" },
  { "code": "LKR", "name": "Sri Lankan Rupee" },
  { "code": "LRD", "name": "Liberian Dollar" },
  { "code": "LSL", "name": "Lesotho Loti" },
  { "code": "LYD", "name": "Libyan Dinar" },
  { "code": "MAD", "name": "Moroccan Dirham" },
  { "code": "MDL", "name": "Moldovan Leu" },
  { "code": "MGA", "name": "Malagasy Ariary" },
  { "code": "MKD", "name": "Macedonian Denar" },
  { "code": "MMK", "name": "Burmese Kyat" },
  { "code": "MNT", "name": "Mongolian Tögrög" },
  { "code": "MOP", "name": "Macanese Pataca" },
  { "code": "MUR", "name": "Mauritian Rupee" },
  { "code": "MVR", "name": "Maldivian Rufiyaa" },
  { "code": "MXN", "name": "Mexican Peso" },
  { "code": "MYR", "name": "Malaysian Ringgit" },
  { "code": "NGN", "name": "Nigerian Naira" },
  { "code": "NOK", "name": "Norwegian Krone" },
  { "code": "NZD", "name": "New Zealand Dollar" },
  { "code": "PHP", "name": "Philippine Peso" },
  { "code": "PKR", "name": "Pakistani Rupee" },
  { "code": "PLN", "name": "Polish Złoty" },
  { "code": "SGD", "name": "Singapore Dollar" },
  { "code": "USD", "name": "United States Dollar" },
  { "code": "ZAR", "name": "South African Rand" }
]

const allCurrencies = [
  { code: "AED", name: "United Arab Emirates Dirham" },
  // ... (rest of your currency list)
  { code: "ZAR", name: "South African Rand" }
];

export default function Home() {
  const [vs_currency, setVsCurrency] = useState("inr");
  const [pageNumber, setPageNumber] = useState(1);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCurrencyName, setSelectedCurrencyName] = useState("Indian Rupee");

  const filteredCurrencies = allCurrencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextPage = () => setPageNumber(prev => prev + 1);
  const prevPage = () => setPageNumber(prev => (prev > 1 ? prev - 1 : 1));

  const handleCurrencySelect = (code, name) => {
    setVsCurrency(code.toLowerCase());
    setSelectedCurrencyName(name);
    setIsCurrencyDropdownOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const selected = allCurrencies.find(c => c.code.toLowerCase() === vs_currency);
    if (selected) setSelectedCurrencyName(selected.name);
  }, [vs_currency]);

  return (
    <div className="min-h-screen bg-gradient-to-b text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-800 to-black">
          Crypto Market Dashboard
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Real-time cryptocurrency prices, trends, and market data in your preferred currency
        </p>
      </div>

      {/* Top Cryptos Section */}
      <div className="px-4">
        <h2 className="text-2xl font-bold mb-2 text-center bg-clip-text text-transparent text-white">
        Hot Right Now - Today's Most Active Cryptos
        </h2>
        <div className="max-w-7xl mx-auto">
          <TopCryptoDisplay />
        </div>
      </div>

      {/* Main Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Currency Selector and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center justify-between w-full md:w-64 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all"
            >
              <div className="flex items-center">
                <span className="font-medium">{vs_currency.toUpperCase()}</span>
                <span className="ml-2 text-sm text-gray-400 truncate max-w-[120px]">
                  {selectedCurrencyName}
                </span>
              </div>
              <FiChevronDown className={`ml-2 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full md:w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                <div className="p-3 border-b border-gray-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search currency..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {/* Popular Currencies */}
                  {!searchQuery && (
                    <div className="p-2">
                      <h3 className="text-xs uppercase text-gray-500 px-2 mb-1">Popular</h3>
                      <div className="flex flex-wrap gap-2">
                        {popularCurrencies.map(currency => (
                          <button
                            key={currency.code}
                            onClick={() => handleCurrencySelect(currency.code, currency.name)}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${
                              vs_currency === currency.code.toLowerCase()
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                          >
                            {currency.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Currencies */}
                  {filteredCurrencies.map(currency => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencySelect(currency.code, currency.name)}
                      className={`w-full px-4 py-2 text-left flex items-center hover:bg-gray-700 transition-colors ${
                        vs_currency === currency.code.toLowerCase() ? 'bg-blue-900/30' : ''
                      }`}
                    >
                      <span className="w-12 font-medium">{currency.code}</span>
                      <span className="text-gray-300">{currency.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={prevPage}
              disabled={pageNumber === 1}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                pageNumber === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              <FiChevronLeft className="mr-1" /> Prev
            </button>
            <span className="px-4 py-2 bg-gray-800 rounded-lg">
              Page {pageNumber}
            </span>
            <button
              onClick={nextPage}
              className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Next <FiChevronRight className="ml-1" />
            </button>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">
              {selectedCurrencyName} ({vs_currency.toUpperCase()}) Exchange Rates
            </h2>
            <TableShowData vs_currency={vs_currency} pageNumber={pageNumber} />
          </div>
        </div>
      </div>
    </div>
  );
}