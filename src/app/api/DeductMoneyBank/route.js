import dbConnect from "@/lib/dbConnect";
import BankModel from "@/schemas/bank.model";
import UserModel from "@/schemas/user.model";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: "shivamverma1022@gmail.com",
    pass: "hhsb chaj ngex jvbk",
  },
});

export async function POST(request) {
    await dbConnect();

    try {
        let { userId, accountId, requestedAmount} = await request.json();

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

        // Process the transaction
        existing_Bank_Account.Amount -= requestedAmount;
        await existing_Bank_Account.save();
        console.log("Amount transferred successfully");

        // Send email confirmation
        if (existing_User.email) {
            try {
                const mailOptions = {
                    from: "shivamverma1022@gmail.com",
                    to: existing_User.email,
                    subject: "UPI Crypto Connect - Transaction Confirmation",
                    html: `
                      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2f3542; padding: 30px; background-color: #f9f9f9;">
                        <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #dfe4ea; border-radius: 8px; padding: 30px;">
                          
                          <h2 style="color: #2d3436; border-bottom: 1px solid #dfe6e9; padding-bottom: 10px;">Transaction Confirmation</h2>
                          
                          <p style="margin-top: 20px;">Dear ${existing_User.name || "User"},</p>
                  
                          <p>We are pleased to confirm that your recent transaction of <strong>₹${requestedAmount}</strong> has been successfully completed on <strong>UPI Crypto Connect</strong>.</p>
                  
                          <h3 style="margin-top: 30px; color: #2d3436;">Transaction Summary</h3>
                          <table style="width: 100%; margin-top: 10px; border-collapse: collapse;">
                            <tr>
                              <td style="padding: 8px 0;"><strong>Amount:</strong></td>
                              <td style="padding: 8px 0;">₹${requestedAmount}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;"><strong>User ID (Sender):</strong></td>
                              <td style="padding: 8px 0;">${userId}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;"><strong>Account ID (Receiver):</strong></td>
                              <td style="padding: 8px 0;">${accountId}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0;"><strong>Date & Time:</strong></td>
                              <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
                            </tr>
                          </table>
                  
                          <p style="margin-top: 30px;">We appreciate your trust in our platform. Should you require any assistance or have any queries regarding this transaction, please contact our support team at <a href="mailto:support@upicryptoconnect.com" style="color: #0984e3;">support@upicryptoconnect.com</a>.</p>
                  
                          <p style="margin-top: 40px;">Thank you for using <strong>UPI Crypto Connect</strong>.</p>
                  
                          <hr style="margin-top: 40px; border: none; border-top: 1px solid #dcdde1;" />
                          <p style="font-size: 0.85em; color: #a4b0be;">This is an automated message. Please do not reply directly to this email.</p>
                        </div>
                      </div>
                    `,
                  };
                  
                  

                await transporter.sendMail(mailOptions);
                console.log('Email sent successfully');
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Don't fail the request if email fails
            }
        }

        return new Response(
            JSON.stringify({ 
                status: true, 
                message: "Amount transferred successfully",
                emailSent: !!existing_User.email
            }),
            { status: 200 }
        );

    } catch (error) {
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 500 });
    }
}