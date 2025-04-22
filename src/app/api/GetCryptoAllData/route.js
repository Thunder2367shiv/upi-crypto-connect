import dbConnect from "@/lib/dbConnect";
import DigitalCurrency from "@/schemas/crypto.model";
import axios from "axios";
import rawdata from "@/context/data";

export async function POST(request) {
    try {
        await dbConnect();

        // First check if there's any body content
        let requestData;
        try {
            const requestBody = await request.text();
            requestData = requestBody ? JSON.parse(requestBody) : {};
        } catch (jsonError) {
            console.error("JSON parsing error:", jsonError);
            return new Response(
                JSON.stringify({ 
                    status: false, 
                    message: "Invalid JSON request body",
                    error: jsonError.message 
                }),
                { 
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        // Set default values
        const pageNumber = parseInt(requestData.pageNumber) || 1;
        const vs_currency = requestData.vs_currency || 'usd';

        // Validate inputs
        if (isNaN(pageNumber)) {
            return new Response(
                JSON.stringify({ 
                    status: false, 
                    message: "pageNumber must be a number" 
                }),
                { 
                    status: 402,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        const batchSize = 8;
        const start = (pageNumber - 1) * batchSize;
        const totalPages = Math.ceil(rawdata.length / batchSize);

        if (pageNumber < 1 || pageNumber > totalPages) {
            return new Response(
                JSON.stringify({ 
                    status: false, 
                    message: "Page number out of range",
                    maxPages: totalPages
                }),
                { 
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

        const end = Math.min(start + batchSize, rawdata.length);
        const savedData = [];
        const ids = rawdata.slice(start, end).map(coin => coin.id).join(",");

        try {
            const url = "https://api.coingecko.com/api/v3/coins/markets";
            const { data } = await axios.get(url, {
                params: {
                    ids,
                    vs_currency,
                    price_change_percentage: "24h,7d,30d,1y",
                },
                timeout: 10000
            });

            for (const coin of data) {
                try {
                    const existingRecord = await DigitalCurrency.findOne({ id: coin.id });

                    // Skip if data is already up to date
                    if (existingRecord?.last_updated && 
                        new Date(existingRecord.last_updated).getTime() === new Date(coin.last_updated).getTime()) {
                        savedData.push(existingRecord);
                        continue;
                    }

                    // Delete old record if exists
                    if (existingRecord) {
                        await DigitalCurrency.deleteOne({ _id: existingRecord._id });
                    }

                    // Create new record with proper null checks
                    const savedCoin = await DigitalCurrency.create({
                        id: coin.id,
                        name: coin.name,
                        symbol: coin.symbol,
                        current_price: coin.current_price || 0,
                        market_cap: coin.market_cap || 0,
                        market_cap_rank: coin.market_cap_rank || 0,
                        fully_diluted_valuation: coin.fully_diluted_valuation || 0,
                        total_volume: coin.total_volume || 0,
                        high_24h: coin.high_24h || 0,
                        low_24h: coin.low_24h || 0,
                        price_change_24h: coin.price_change_24h || 0,
                        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
                        market_cap_change_24h: coin.market_cap_change_24h || 0,
                        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h || 0,
                        circulating_supply: coin.circulating_supply || 0,
                        total_supply: coin.total_supply || 0,
                        max_supply: coin.max_supply || 0,
                        ath: coin.ath || 0,
                        ath_change_percentage: coin.ath_change_percentage || 0,
                        ath_date: coin.ath_date ? new Date(coin.ath_date) : null,
                        atl: coin.atl || 0,
                        atl_change_percentage: coin.atl_change_percentage || 0,
                        price_change_percentage_1y_in_currency: coin.price_change_percentage_1y_in_currency || 0,
                        price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency || 0,
                        price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency || 0,
                        price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency || 0,
                        imageURL: coin.image || '/crypto-placeholder.png',
                        last_updated: new Date(coin.last_updated),
                    });

                    savedData.push(savedCoin);
                } catch (dbError) {
                    console.error(`Error processing coin ${coin.id}:`, dbError);
                    continue;
                }
            }

            savedData.sort((a, b) => (b.current_price || 0) - (a.current_price || 0));

            return new Response(
                JSON.stringify({ 
                    status: true, 
                    data: savedData,
                    currentPage: pageNumber,
                    totalPages: totalPages,
                    message: "Data fetched successfully" 
                }),
                { 
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

        } catch (apiError) {
            console.error("CoinGecko API Error:", apiError);
            return new Response(
                JSON.stringify({ 
                    status: false, 
                    message: "Failed to fetch data from CoinGecko API",
                    error: apiError.message 
                }),
                { 
                    status: 502,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }

    } catch (error) {
        console.error("Server Error:", error);
        return new Response(
            JSON.stringify({ 
                status: false, 
                message: "Internal server error",
                error: error.message 
            }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}