import dbConnect from "@/lib/dbConnect";
import BankModel from "@/schemas/bank.model";
import UserModel from "@/schemas/user.model";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
    await dbConnect();

    try {
        let { userId, accountId, requestedAmount } = await request.json();

        const existing_Bank_Account = await BankModel.findById(accountId);
        if (!existing_Bank_Account) {
            return new Response(JSON.stringify({ status: false, message: "Bank Account does not exist" }), { status: 400 });
        }

        const existing_User = await UserModel.findById(userId);
        if (!existing_User) {
            return new Response(JSON.stringify({ status: false, message: "User does not exist" }), { status: 400 });
        }

        if (requestedAmount > existing_Bank_Account.Amount) {
            return new Response(JSON.stringify({ status: false, message: "Insufficient balance" }), { status: 400 });
        }

        existing_Bank_Account.Amount -= requestedAmount;
        await existing_Bank_Account.save();

        existing_User.Wallet += requestedAmount;
        await existing_User.save();

        // console.log("Amount transferred successfully");

        return new Response(
            JSON.stringify({ status: true, message: "Amount transferred successfully" }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 500 });
    }
}
