import dbConnect from "@/lib/dbConnect";
import UserModel from "@/schemas/user.model";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";  // 🔹 Hash MPIN for security

dotenv.config();

export async function POST(request) {
    await dbConnect();

    try {
        let { userId, num } = await request.json();

        const existing_User = await UserModel.findById(userId);
        if (!existing_User) {
            return new Response(
                JSON.stringify({ status: false, message: "User does not exist" }),
                { status: 400 }
            );
        }
        existing_User.phone = num;
        await existing_User.save();

        return new Response(
            JSON.stringify({ status: true, message: "Phone number added successfully" }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ status: false, message: error.message }),
            { status: 500 }
        );
    }
}
