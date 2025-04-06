import dbConnect from "@/lib/dbConnect";
import transactionModel from "@/schemas/transaction.model";
import dotenv from "dotenv";

dotenv.config();

export async function DELETE(request) {
    await dbConnect();

    try {
        const { transactionId } = await request.json();

        if (!transactionId) {
            return new Response(
                JSON.stringify({ status: false, message: "Transaction ID is required" }),
                { status: 400 }
            );
        }

        const deletedTransaction = await transactionModel.findByIdAndDelete(transactionId);

        if (!deletedTransaction) {
            return new Response(
                JSON.stringify({ status: false, message: "Transaction not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ status: true, message: "Transaction deleted successfully" }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ status: false, message: error.message }),
            { status: 500 }
        );
    }
}
