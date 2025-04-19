import dbConnect from "@/lib/dbConnect";
import transactionModel from "@/schemas/transaction.model";
import TransactionHistoryModel from "@/schemas/TransactionHistory.model";
import { NextResponse } from 'next/server';
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
  await dbConnect();

  try {
    const { transactionSearchId, UpiId } = await request.json();

    if (!transactionSearchId) {
      return NextResponse.json(
        { status: false, message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const existingTransaction = await transactionModel.findOne({ transactionSearchId });
    if (!existingTransaction) {
      return NextResponse.json(
        { status: false, message: "Transaction not found" },
        { status: 404 }
      );
    }
    // console.log("existingTransaction: ", existingTransaction);
    // Update transaction
    const updatedTransaction = await transactionModel.findOneAndUpdate(
      { transactionSearchId },
      {
        status: "confirmed",
        upiId: UpiId,
        updatedAt: new Date()
      },
      { new: true }
    );

    // console.log("updatedTransaction: ", updatedTransaction);

    // Update transaction history
    const updatedHistory = await TransactionHistoryModel.findOneAndUpdate(
      { transactionId: existingTransaction._id },
      {
        status: "confirmed",
        upiId: UpiId,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedHistory) {
      return NextResponse.json(
        { status: false, message: "Transaction history not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        status: true, 
        message: "Transaction confirmed successfully",
        data: {
          transaction: updatedTransaction,
          history: updatedHistory
        }
      },
      { status: 200 }
    );

  } catch (error) {
    // console.error("Transaction update error:", error);
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}