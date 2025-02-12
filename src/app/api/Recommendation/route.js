import axios from "axios";

export async function GET() {
    try {
        const url = "https://api.coingecko.com/api/v3/coins/markets";

        // Fetch 100 coins with INR price trends
        const { data } = await axios.get(url, {
            params: {
                vs_currency: "inr",
                order: "market_cap_desc",
                per_page: 100,  // Fetch 100 coins
                page: 1,
                price_change_percentage: "24h,7d,30d,1y",
            },
        });

        const recommendations = [];

        for (let coin of data) {
            const { id, name, current_price, price_change_percentage_24h, price_change_percentage_7d, price_change_percentage_30d, price_change_percentage_1y } = coin;

            // Buying logic: If long-term is good but short-term is down, it's a buy signal
            if (price_change_percentage_1y > 50 && price_change_percentage_7d < 0) {
                recommendations.push({
                    id,
                    name,
                    current_price,
                    reason: "Good long-term growth with a short-term dip. Potential buy opportunity.",
                });
            }
            // Momentum strategy: If last 7 days and 30 days are both strong, suggest
            else if (price_change_percentage_7d > 5 && price_change_percentage_30d > 10) {
                recommendations.push({
                    id,
                    name,
                    current_price,
                    reason: "Strong short-term and mid-term growth. Possible bullish trend.",
                });
            }
            // Avoid highly volatile coins or consistently declining ones
            else if (price_change_percentage_7d < -10 && price_change_percentage_30d < -20) {
                continue; // Skip bad investments
            }
        }

        return new Response(JSON.stringify({ status: true, recommendations }), { status: 200 });
    } catch (error) {
        console.error("Error:", error.message);
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
