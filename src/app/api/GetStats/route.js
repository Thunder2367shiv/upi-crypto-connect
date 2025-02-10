import DigitalCurrency from "@/schemas/crypto.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
        await dbConnect();
    try {
        const { symbol } = await request.json();
        const stats = await DigitalCurrency.find({"symbol": symbol})
        .sort({createdAt: 1})  // Sort by `createdAt` in ascending order
        .limit(1); // Only retrieve one record

        // After processing all data, send a response
        return new Response(JSON.stringify({ status: true, data: stats, message: "Data saved successfully." }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        // Handle any error that occurs during the execution
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}