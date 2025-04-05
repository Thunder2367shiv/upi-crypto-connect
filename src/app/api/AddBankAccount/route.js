import dbConnect from "@/lib/dbConnect";
import BankModel from "@/schemas/bank.model";
import UserModel from "@/schemas/user.model";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
    await dbConnect();

    try {
        let { userId, 
            AccountHolderName,
            accountNumber,
            ifscCode,
            bankName,
            BranchName,
            UpiId,
            Amount,
            Currency,
            accountType 
        } = await request.json();

        const existing_Bank_Account = await BankModel.findOne({ accountNumber, ifscCode });
        if (existing_Bank_Account) {
            return new Response(JSON.stringify({ status: false, message: "Bank Account is Already Connected" }), { status: 400 });
        }

        const newAccount = new BankModel({
            AccountHolderName,
            accountNumber,
            ifscCode,
            bankName,
            BranchName,
            UpiId,
            Amount,
            Currency,
            accountType
        });

        await newAccount.save();

        const user = await UserModel.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ status: false, message: "User not found" }), { status: 404 });
        }

        user.BankAccounts.push(newAccount._id);
        await user.save();

        console.log("Account Added successfully");

        return new Response(
            JSON.stringify({ status: true, message: "Bank account added successfully", data: newAccount }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
