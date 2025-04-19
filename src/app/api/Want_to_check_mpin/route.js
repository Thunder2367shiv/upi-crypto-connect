import dbConnect from "@/lib/dbConnect";
import UserModel from "@/schemas/user.model";

export async function POST(request) {
    await dbConnect();

    try {
        // Properly parse the JSON body
        const requestBody = await request.json();
        const { userId } = requestBody;
        
        if (!userId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User ID is required"
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Find user by _id (not userId field)
        const existingUser = await UserModel.findById(userId);

        if (!existingUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found"
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "User data fetched successfully",
                hasMPIN: existingUser?.mpin && existingUser.mpin.length > 1 ? true : false
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        // console.error("Error getting user:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message || "Error getting user"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}