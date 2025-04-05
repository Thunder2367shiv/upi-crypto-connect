import dbConnect from "@/lib/dbConnect";
import BankModel from "@/schemas/bank.model";
import UserModel from "@/schemas/user.model";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
    await dbConnect();

    try {
        const { userId } = await request.json();

        const user = await UserModel.findById(userId);
        if (!user) {
            return new Response(
                JSON.stringify({ status: false, message: "User not found" }),
                { status: 404 }
            );
        }

        // Efficiently get all bank accounts using $in operator
        const bankAccounts = await BankModel.find({ _id: { $in: user.BankAccounts } });

        return new Response(
            JSON.stringify({ status: true, message: "Bank accounts fetched successfully", data: bankAccounts }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
    }
}
