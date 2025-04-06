import dbConnect from "@/lib/dbConnect";
import transactionModel from "@/schemas/transaction.model";
import TransactionHistoryModel from "@/schemas/TransactionHistory.model";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
  await dbConnect();

  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return new Response(
        JSON.stringify({ status: false, message: "Transaction ID is required" }),
        { status: 400 }
      );
    }

    const existingTransaction = await transactionModel.findById(transactionId);

    if (!existingTransaction) {
      return new Response(
        JSON.stringify({ status: false, message: "Transaction does not exist" }),
        { status: 404 }
      );
    }

    existingTransaction.status = "confirmed";
    await existingTransaction.save();

    const existingHistoryTransaction = await TransactionHistoryModel.findOne({transactionId: transactionId})

    if (!existingHistoryTransaction) {
        return new Response(
          JSON.stringify({ status: false, message: "History Transaction does not exist" }),
          { status: 404 }
        );
      }

    existingHistoryTransaction.status = "confirmed";
    await existingHistoryTransaction.save();

    return new Response(
      JSON.stringify({ status: true, message: "Transaction confirmed successfully" }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      { status: 500 }
    );
  }
}
