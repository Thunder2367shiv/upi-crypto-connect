"use client";
import React, { useState, useRef, useEffect } from 'react';
import SearchResult from '@/components/SearchResult';
import popularCurrencies from "@/context/popularCurrencies";

const storedCurrency = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CNY', 'CAD', 'AUD'];

const Page = () => {
    const [vsCurrency, setVsCurrency] = useState('inr');
    const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
    const [crypto, setCrypto] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCurrencyDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCurrencies = popularCurrencies.filter((coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCurrencySelect = (code) => {
        setVsCurrency(code.toLowerCase());
        setIsCurrencyDropdownOpen(false);
        setSearchQuery('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!crypto.trim()) {
            setError('Please enter a cryptocurrency name or symbol');
            return;
        }
        setError('');
        setIsLoading(true);
        setShow(true);
        setIsLoading(false);
    };

    const selectedCurrency = popularCurrencies.find(c => c.code.toLowerCase() === vsCurrency.toLowerCase());

    return (
        <div className='min-h-screen bg-gradient-to-br flex flex-col items-center p-4 pt-24 md:pt-32'>
            <div className='bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-3xl transition-all duration-300 hover:shadow-2xl'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2'>
                        Crypto Tracker
                    </h1>
                    <p className='text-gray-400'>
                        Search for cryptocurrency prices in any currency
                    </p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex-1 relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </div>
                            <input
                                type='text'
                                placeholder='Bitcoin, Ethereum, etc...'
                                value={crypto}
                                onChange={(e) => setCrypto(e.target.value)}
                                className='w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400'
                                autoFocus
                            />
                        </div>

                        <div className='relative w-full md:w-64' ref={dropdownRef}>
                            <button
                                type='button'
                                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                                className='w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg transition-all flex items-center justify-between'
                                aria-expanded={isCurrencyDropdownOpen}
                                aria-haspopup='listbox'
                            >
                                <div className='flex items-center'>
                                    <span className='font-medium'>{vsCurrency.toUpperCase()}</span>
                                    {selectedCurrency && (
                                        <span className='ml-2 text-sm text-gray-400 truncate hidden md:inline'>
                                            {selectedCurrency.name.split(' ')[0]}
                                        </span>
                                    )}
                                </div>
                                <svg className={`w-5 h-5 ml-2 transition-transform duration-200 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7' />
                                </svg>
                            </button>

                            {isCurrencyDropdownOpen && (
                                <div className='absolute mt-1 w-full bg-gray-800 rounded-lg shadow-xl z-10 overflow-hidden border border-gray-700 animate-fade-in'>
                                    <div className='p-2 border-b border-gray-700'>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                                </svg>
                                            </div>
                                            <input
                                                type='text'
                                                placeholder='Search currency...'
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className='w-full pl-10 pr-4 py-2 bg-gray-900 border-none rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400'
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className='max-h-60 overflow-y-auto'>
                                        {/* Popular currencies */}
                                        {!searchQuery && (
                                            <div className='px-2 py-1'>
                                                <p className='text-xs text-gray-400 uppercase tracking-wider px-2 py-1'>Popular</p>
                                                <div className='flex flex-wrap gap-1 p-1'>
                                                    {storedCurrency.map(code => {
                                                        const currency = popularCurrencies.find(c => c.code === code);
                                                        return (
                                                            <button
                                                                key={code}
                                                                onClick={() => handleCurrencySelect(code)}
                                                                className={`px-3 py-1 text-sm rounded-md transition-all ${
                                                                    vsCurrency === code.toLowerCase()
                                                                        ? 'bg-blue-600 text-white'
                                                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                                                }`}
                                                            >
                                                                {code}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Filtered currency list */}
                                        {filteredCurrencies.map((coin) => (
                                            <button
                                                key={coin.code}
                                                onClick={() => handleCurrencySelect(coin.code)}
                                                className={`w-full px-4 py-2 text-left text-sm transition-all duration-200 flex items-center ${
                                                    vsCurrency === coin.code.toLowerCase()
                                                        ? 'bg-blue-600 text-white'
                                                        : 'hover:bg-gray-700 text-gray-200'
                                                }`}
                                            >
                                                <span className='font-medium w-12'>{coin.code}</span>
                                                <span className='truncate'>{coin.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed'
                        >
                            {isLoading ? (
                                <>
                                    <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                    </svg>
                                    Searching...
                                </>
                            ) : (
                                'Search'
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className='px-4 py-2 bg-red-900/30 border border-red-700 rounded-lg text-red-300 animate-fade-in'>
                            {error}
                        </div>
                    )}
                </form>
            </div>

            {show && (
                <div className='mt-12 w-full animate-fade-in-up'>
                    {isLoading ? (
                        <div className='flex justify-center py-12'>
                            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
                        </div>
                    ) : (
                        <SearchResult vs_currency={vsCurrency} crypto={crypto} />
                    )}
                </div>
            )}
        </div>
    );
};

export default Page;