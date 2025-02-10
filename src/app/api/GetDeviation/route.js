import DigitalCurrency from "@/schemas/crypto.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
    await dbConnect();

    try {
        const { symbol } = await request.json();
        // Retrieve the stats for the given coin
        const stats = await DigitalCurrency.find({ "symbol": symbol}).limit(100);
        let deviation = 0, cnt = 0;

        // Iterate over the array correctly
        for (const record of stats) {
            deviation += record.current_price; // Add the current_price of each record
            cnt++;
        }

        // Calculate the average deviation
        const averageDeviation = cnt > 0 ? deviation / cnt : 0;

        // Return the calculated deviation
        return new Response(JSON.stringify({ status: true, data: averageDeviation, message: "Deviation calculated successfully." }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}