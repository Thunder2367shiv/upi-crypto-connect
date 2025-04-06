import dbConnect from "@/lib/dbConnect";
import TransactionHistoryModel from "@/schemas/TransactionHistory.model";
import dotenv from "dotenv";
import UserModel from "@/schemas/user.model";

dotenv.config();

export async function POST(request) {
  await dbConnect();

  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ status: false, message: "UpiId are required." }),
        { status: 400 }
      );
    }

    const user = await UserModel.findById(userId);
            if (!user) {
                return new Response(
                    JSON.stringify({ status: false, message: "User not found" }),
                    { status: 404 }
                );
            }

    const History = await TransactionHistoryModel.find({ _id: { $in: user.TransactionHistory } });
    
    return new Response(
      JSON.stringify({
        status: true,
        message: "Transaction created successfully",
        data: History
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
