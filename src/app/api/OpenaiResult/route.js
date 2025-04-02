import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();


const genAI = new GoogleGenerativeAI("AIzaSyDjSYvrk_h0glyDt589wO0kRQ3UEX5ghy4");

export async function POST(request) {
  try {
    let { prompt } = await request.json(); // Get user input

    // Get Gemini model
    prompt = "Explain About " + prompt + " . Explain it in about 2.5 to 3 paragraph";
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
