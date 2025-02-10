import dbConnect from "@/lib/dbConnect";
import DigitalCurrency from "@/schemas/crypto.model"; // ✅ Use default import
import axios from "axios";

export async function POST(request) {
    await dbConnect();

    try {
        const { ids, vs_currency } = await request.json();
        console.log("ids, vs_currency", ids, vs_currency);
        const url = "https://api.coingecko.com/api/v3/coins/markets";

        const { data } = await axios.get(url, {
            params: {
                ids,
                vs_currency,
                price_change_percentage: "24h,7d,30d,1y",
            },
        });

        console.log("data", data);

        const savedData = [];

        for (let coin of data) {
            const uniqueId = coin.id + coin.last_updated;

            const existingRecord = await DigitalCurrency.findOne({ id: uniqueId });
            if (existingRecord) {
                return new Response(JSON.stringify({ status: false, message: "Duplicate Data" }), { status: 400 });
            }

            const recordCount = await DigitalCurrency.countDocuments({ id: coin.id });

            if (recordCount >= 100) {
                const lastUpdatedRecord = await DigitalCurrency.findOne({ id: coin.id })
                    .sort({ createdAt: -1 })
                    .limit(1);

                if (lastUpdatedRecord) {
                    await DigitalCurrency.deleteOne({ _id: lastUpdatedRecord._id });
                    console.log(`Deleted the last updated record for ${coin.id}`);
                }
            }

            const savedCoin = await DigitalCurrency.create({
                id: uniqueId,
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
            });

            savedData.push(savedCoin);
        }

        return new Response(JSON.stringify({ status: true, data: savedData, message: "Data saved successfully." }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error:", error.message);
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
