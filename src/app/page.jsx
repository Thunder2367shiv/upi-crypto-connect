"use client";

import { useState } from "react";
import TableShowData from "@/components/Table_ShowData";
import TopCryptoDisplay from "@/components/TopCryptoDisplay";

export default function Home() {
  const [vs_currency, setVsCurrency] = useState("inr");
  const [vs_currencyname, setVsCurrencyname] = useState("Indian Rupee");
  const [pageNumber, setPageNumber] = useState(1);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

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

  const nextPage = () => setPageNumber((prev) => prev + 1);
  const prevPage = () => setPageNumber((prev) => (prev > 1 ? prev - 1 : 1));

  const handleCurrencySelect = (code) => {
    setVsCurrency(code.toLowerCase());
    setIsCurrencyDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div className="min-h-screen flex flex-col px-4 bg-gray-50">
      {/* Top Crypto Display */}
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Curated Selections for You
        </h2>
      </div>

      <div className="mt-4 w-full">
        <TopCryptoDisplay />
      </div>

      {/* Currency Select Button and Dropdown */}
      <div className="w-full max-w-7xl mx-auto mt-8 relative py-8">
        <button
          onMouseEnter={() => setIsCurrencyDropdownOpen(true)}
          onMouseLeave={() => setIsCurrencyDropdownOpen(false)}
          className="w-full md:w-auto px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 shadow-md transition-all text-center"
        >
          {vs_currencyname + ' '}({vs_currency.toUpperCase()}) ▾
        </button>

        {/* Dropdown Menu */}
        {isCurrencyDropdownOpen && (
          <div
            className="absolute top-12 left-0 w-full max-w-[90vw] overflow-x-auto bg-gray-100 rounded-lg shadow-lg z-10"
            onMouseEnter={() => setIsCurrencyDropdownOpen(true)}
            onMouseLeave={() => setIsCurrencyDropdownOpen(false)}
          >
            <div className="flex gap-3 p-4" style={{ minWidth: "max-content" }}>
              {currency.map((coin, index) => (
                <div
                  key={index}
                  onClick={() => handleCurrencySelect(coin.code)}
                  className={`p-2 border-gray-200 border-2 text-sm font-medium rounded-lg cursor-pointer transition-all text-center whitespace-nowrap ${
                    vs_currency === coin.code.toLowerCase()
                      ? "bg-blue-900 text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {coin.name} ({coin.code})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Table Component */}
      <div className="w-full max-w-7xl mx-auto mt-8">
        <div className="w-full p-6 bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-extrabold text-yellow-500 text-center mb-6">
            {vs_currency.toUpperCase()} Exchange Rates
          </h2>

          <div className="overflow-x-auto">
            <TableShowData vs_currency={vs_currency} pageNumber={pageNumber} />
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              className={`px-5 py-2 text-white font-bold rounded-lg transition-all ${
                pageNumber === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-900 text-white hover:bg-blue-800 shadow-md"
              }`}
              onClick={prevPage}
              disabled={pageNumber === 1}
            >
              Prev Page
            </button>

            <span className="text-lg font-semibold text-white">
              Page {pageNumber}
            </span>

            <button
              className="px-5 py-2 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 shadow-md transition-all"
              onClick={nextPage}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}