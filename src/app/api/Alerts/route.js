import dbConnect from "@/lib/dbConnect";
import User from "@/schemas/user.model";

export async function POST(req) {
  await dbConnect();
  const { email, enable } = await req.json();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email, receiveAlerts: enable });
  } else {
    user.receiveAlerts = enable;
    await user.save();
  }

  return new Response(
    JSON.stringify({ status: true, message: `Alert ${enable ? "enabled" : "disabled"}` }),
    { status: 200 }
  );
}
