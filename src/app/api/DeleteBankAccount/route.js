import dbConnect from "@/lib/dbConnect";
import BankModel from "@/schemas/bank.model";
import UserModel from "@/schemas/user.model";
import dotenv from "dotenv";

dotenv.config();

export async function DELETE(request) {
    await dbConnect();

    try {
        const { userId, bankAccountId } = await request.json();

        const user = await UserModel.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ status: false, message: "User not found" }), { status: 404 });
        }

        if (!user.BankAccounts.includes(bankAccountId)) {
            return new Response(JSON.stringify({ status: false, message: "Bank account not linked to user" }), { status: 400 });
        }

        user.bankAccounts = user.BankAccounts.filter(id => id.toString() !== bankAccountId);
        await user.save();

        await BankModel.findByIdAndDelete(bankAccountId);

        return new Response(
            JSON.stringify({ status: true, message: "Bank account deleted successfully" }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
