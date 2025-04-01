import axios from "axios";

export async function GET() {

    try {
        const response = await axios.get("https://api.wazirx.com/api/v2/tickers/solinr");
        return new Response(JSON.stringify({ status: true, data: response?.data }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
