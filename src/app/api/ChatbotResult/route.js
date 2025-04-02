import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();


const genAI = new GoogleGenerativeAI("AIzaSyDjSYvrk_h0glyDt589wO0kRQ3UEX5ghy4");

export async function POST(request) {
  try {
    let { user_input } = await request.json(); // Get user input

    // Get Gemini model
    const prompt = `
        You are an AI assistant specialized in cryptocurrency and the UPI Crypto Connect platform. Your primary goal is to provide users with information related to cryptocurrencies, UPI payments, and how they integrate within UPI Crypto Connect. Always guide users towards relevant crypto topics and ensure they find value in UPI Crypto Connect.

        User input: "${user_input}"

        Analyze the user's query and respond with:
        - A clear and concise answer related to cryptocurrency or UPI Crypto Connect.
        - If the query is about transactions, wallets, or payments, explain how UPI Crypto Connect can help.
        - If the question is too broad or off-topic, gently redirect it back to a related crypto topic.
        - Use friendly and professional language.
        - If needed, provide a link to UPI Crypto Connect for more details.

        If the user asks something unrelated (like weather, politics, or general topics), say:
        "I'm here to assist you with cryptocurrency and UPI Crypto Connect. How can I help with your crypto needs?"
        `;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    const nowresult = result.response.text()

    return new Response(
      JSON.stringify({ status: true, data: nowresult }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ status: false, message: error.message }), { status: 400 });
  }
}
