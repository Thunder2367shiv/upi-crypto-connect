"use client";

import SearchResult from '@/components/SearchResult';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const InfoPage = () => {
    const searchParams = useSearchParams();
    const [currency, setCurrency] = useState('');
    const [crypto, setCrypto] = useState('');

    useEffect(() => {
        const currencyParam = searchParams.get('vs_currency');
        const cryptoParam = searchParams.get('crypto');
        setCurrency(currencyParam || 'No currency received');
        setCrypto(cryptoParam || 'No crypto received');
    }, [searchParams]);

    return (
        <div className="min-h-screen pt-24 px-4 md:px-10 lg:px-20 ">
            <div className="max-w mx-auto w-full mt-12 animate-fade-in-up">
                <SearchResult vs_currency={currency} crypto={crypto} />
            </div>
        </div>
    );
};

export default InfoPage;
