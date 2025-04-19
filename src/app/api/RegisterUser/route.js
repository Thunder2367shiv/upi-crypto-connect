import dbConnect from "@/lib/dbConnect";
import UserModel from "@/schemas/user.model";

export async function POST(request) {
    await dbConnect();

    try {
        const { username, email, phone, authProvider } = await request.json();
        const formattedUsername = username?.toString().toLowerCase() || email.split('@')[0];

        // Check if the user already exists (by email)
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            // // console.log("username: ", username);
            // // console.log("email: ", email)
            // // console.log("phone: ", phone)
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User already exists",
                    userId: existingUser._id
                }),
                {
                    status: 201,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        // Create and save the new user
        const newUser = new UserModel({
            username: formattedUsername,
            email,
            phone: phone || null, // Make phone optional
            authProvider: authProvider || 'email' // Track sign-up method
        });
        await newUser.save();
        // console.log("User registered successfully");

        return new Response(
            JSON.stringify({
                success: true,
                message: "Account registered successfully",
                userId: newUser._id
            }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        // console.error("Error registering user:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message || "Error registering user"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}