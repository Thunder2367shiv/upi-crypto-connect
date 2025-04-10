import dbConnect from "@/lib/dbConnect";
import transactionModel from "@/schemas/transaction.model";
import TransactionHistoryModel from "@/schemas/TransactionHistory.model";
import dotenv from "dotenv";
import UserModel from "@/schemas/user.model";

dotenv.config();

export async function POST(request) {
  await dbConnect();

  try {
    const { Amount, userId, transactionSearchId } = await request.json();
    console.log( Amount, userId, transactionSearchId );

    if (!Amount) {
      return new Response(
        JSON.stringify({ status: false, message: "Amount are required." }),
        { status: 400 }
      );
    }

    const newTransaction = new transactionModel({
      userId,
      Amount,
      transactionSearchId,
      status: "pending",
    });
    await newTransaction.save();

    const newHistoryTransaction = new TransactionHistoryModel({
        transactionId: newTransaction._id,
        userId,
        Amount,
        status: "pending",
    })

    await newHistoryTransaction.save();

    const user = await UserModel.findById(userId);
    if (!user) {
        return new Response(JSON.stringify({ status: false, message: "User not found" }), { status: 404 });
    }
    user.TransactionHistory.push(newHistoryTransaction._id);
    await user.save();
    
    return new Response(
      JSON.stringify({
        status: true,
        message: "Transaction created successfully",
        id: newTransaction._id,
      }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      { status: 500 }
    );
  }
}
