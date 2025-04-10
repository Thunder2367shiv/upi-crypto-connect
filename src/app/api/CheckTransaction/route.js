import dbConnect from "@/lib/dbConnect";
import transactionModel from "@/schemas/transaction.model";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
    await dbConnect();

    try {
        const { transactionId } = await request.json();

        if (!transactionId) {
            return new Response(
                JSON.stringify({ status: false, message: "Transaction ID is required" }),
                { status: 301 }
            );
        }

        const transaction = await transactionModel.findById(transactionId);

        if (!transaction) {
            return new Response(
                JSON.stringify({ status: false, message: "Transaction not found" }),
                { status: 210 }
            );
        }

        return new Response(
            JSON.stringify({ status: true, message: "Transaction deleted successfully", data: transaction.status }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ status: false, message: error.message }),
            { status: 500 }
        );
    }
}
