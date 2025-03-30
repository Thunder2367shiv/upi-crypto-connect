"use client";
import React, { useState } from 'react';
import SearchResult from '@/components/SearchResult';

const Page = () => {
    const [vsCurrency, setVsCurrency] = useState('inr');
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const [crypto, setCrypto] = useState('bitcoin');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const currencyList = [
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
    ];

    const filteredCurrencies = currencyList.filter((coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCurrencySelect = (code) => {
        setVsCurrency(code.toLowerCase());
        setIsCurrencyDropdownOpen(false); // Close dropdown after selection
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!crypto.trim()) {
            setError('Please enter a cryptocurrency name.');
            return;
        }
        setError('');
        setShow(true);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br flex flex-col items-center justify-center p-4 mt-20'>
            <div className='bg-gray-900 rounded-3xl shadow-2xl p-4 w-full max-w-2xl transform transition-all hover:shadow-3xl hover:-translate-y-2'>
                <h1 className='text-4xl font-extrabold text-center text-yellow-400 mb-8 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'>
                    Crypto-currency Finder
                </h1>
                <form onSubmit={handleSubmit} className='flex gap-4 bg-gray-700 p-4 rounded-xl shadow-md'>
                    <input
                        type='text'
                        placeholder='Search for a cryptocurrency...'
                        value={crypto}
                        onChange={(e) => setCrypto(e.target.value)}
                        className='w-full px-4 py-3 bg-gray-800 border-none focus:ring-2 focus:ring-blue-400 rounded-lg text-white'
                    />

<div className='relative w-full'>
                            {/* Dropdown Button */}
                            <button
                                type='button'
                                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                                className='w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 shadow-md transition-all flex items-center justify-between hover:shadow-lg'
                                aria-expanded={isCurrencyDropdownOpen}
                                aria-haspopup='listbox'
                            >
                                <span>{vsCurrency.toUpperCase()}</span>
                                <span className='transform transition-transform duration-200'>
                                    {isCurrencyDropdownOpen ? '▴' : '▾'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {isCurrencyDropdownOpen && (
                                <div
                                    className='absolute top-14 left-0 min-w-full w-64 bg-white rounded-xl shadow-xl z-10 overflow-hidden animate-fade-in'
                                >
                                    {/* Search Input */}
                                    <div className='p-2 border-b border-gray-200'>
                                        <input
                                            type='text'
                                            placeholder='Search currency...'
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 placeholder-gray-400 text-gray-700'
                                            aria-label='Search currency'
                                        />
                                    </div>

                                    {/* Currency List */}
                                    <div className='max-h-60 overflow-y-auto'>
                                        {filteredCurrencies.map((coin) => (
                                            <button
                                                key={coin.code}
                                                onClick={() => handleCurrencySelect(coin.code)}
                                                className={`w-full px-4 py-2 text-left text-sm font-medium rounded-lg transition-all duration-200 ${
                                                    vsCurrency === coin.code.toLowerCase()
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                                        : 'bg-white hover:bg-gray-50'
                                                }`}
                                                role='option'
                                                aria-selected={vsCurrency === coin.code.toLowerCase()}
                                            >
                                                {coin.name} ({coin.code})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    {error && (
                        <p className='text-red-500 text-sm mt-1 animate-fade-in'>{error}</p>
                    )}

                    <button
                        type='submit'
                        className='px-2 py-1 font-extrabold text-3xl bg-white rounded-full hover:bg-gray-200 transition-all'
                    >
                        🔎
                    </button>
                </form>
            
            </div>

            {show && (
                <div className='mt-20 w-full'>
                    <SearchResult vs_currency={vsCurrency} crypto={crypto} />
                </div>
            )}
        </div>
    );
};

export default Page;