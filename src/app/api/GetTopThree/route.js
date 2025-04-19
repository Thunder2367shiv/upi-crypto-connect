import axios from "axios";

export async function GET() {
    try {
        const url = "https://api.coingecko.com/api/v3/coins/markets";
        
        // Fetch data in INR
        const { data } = await axios.get(url, {
            params: {
                vs_currency: "inr",
                order: "market_cap_desc",
                per_page: 100,  // Fetch 100 coins (can be adjusted)
                page: 1,
            },
        });

        // Sort by current price in descending order
        const topCoins = data
            .sort((a, b) => b.current_price - a.current_price)
            .slice(0, 3); // Get top 3 highest price coins

        return new Response(JSON.stringify({ status: true, topCoins }), { status: 200 });
    } catch (error) {
        // console.error("Error:", error.message);
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
