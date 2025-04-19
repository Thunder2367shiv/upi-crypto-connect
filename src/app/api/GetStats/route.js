import dbConnect from "@/lib/dbConnect";
import DigitalCurrency from "@/schemas/crypto.model";
import axios from "axios";

export async function POST(request) {
    await dbConnect();
    try {
        const { crypto, vs_currency = "inr" } = await request.json();

        if (!crypto) {
            return new Response(JSON.stringify({ status: false, message: "Crypto parameter is required" }), { status: 400 });
        }

        let lastRecord = await DigitalCurrency.findOne({ id: crypto }).sort({ createdAt: -1 });

        const now = new Date();
        const lastUpdated = lastRecord?.last_updated ? new Date(lastRecord.last_updated) : null;
        const isDataOutdated = !lastUpdated || now.toISOString().slice(0, 10) !== lastUpdated.toISOString().slice(0, 10);

        if (!lastRecord || isDataOutdated) {
            // Fetch fresh data from CoinGecko API
            const url = "https://api.coingecko.com/api/v3/coins/markets";
            const { data } = await axios.get(url, {
                params: {
                    vs_currency,
                    ids: crypto, // <-- Corrected this to use 'ids'
                    price_change_percentage: "24h,7d,30d,1y",
                },
            });

            if (!data || data.length === 0) {
                return new Response(JSON.stringify({ status: false, message: "No data found from API" }), { status: 404 });
            }

            const coin = data[0];

            // Use `findOneAndUpdate` to avoid duplicate key errors
            lastRecord = await DigitalCurrency.findOneAndUpdate(
                { id: crypto }, // Find by `id` instead of `name`
                {
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    current_price: coin.current_price,
                    market_cap: coin.market_cap,
                    market_cap_rank: coin.market_cap_rank,
                    fully_diluted_valuation: coin.fully_diluted_valuation,
                    total_volume: coin.total_volume,
                    high_24h: coin.high_24h,
                    low_24h: coin.low_24h,
                    price_change_24h: coin.price_change_24h,
                    price_change_percentage_24h: coin.price_change_percentage_24h,
                    market_cap_change_24h: coin.market_cap_change_24h,
                    market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
                    circulating_supply: coin.circulating_supply,
                    total_supply: coin.total_supply,
                    max_supply: coin.max_supply,
                    ath: coin.ath,
                    ath_change_percentage: coin.ath_change_percentage,
                    ath_date: new Date(coin.ath_date),
                    atl: coin.atl,
                    atl_change_percentage: coin.atl_change_percentage,
                    price_change_percentage_1y_in_currency: coin.price_change_percentage_1y_in_currency,
                    price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency,
                    price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency,
                    price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
                    imageURL: coin.image,
                    last_updated: now,
                },
                { upsert: true, new: true } // Prevent duplicate key errors
            );

            // // console.log(`Updated record for ${crypto}`);
        }

        return new Response(
            JSON.stringify({ status: true, data: lastRecord, message: "Data retrieved successfully." }),
            { status: 200 }
        );
    } catch (error) {
        // // console.error("Error:", error.message);
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
