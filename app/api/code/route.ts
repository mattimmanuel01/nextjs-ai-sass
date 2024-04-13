import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage = {
  role: "system",
  content: "",
};
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    console.log("woi");
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      // return new NextResponse("Free Trial Expired", { status: 403 });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-2024-04-09",
      messages: [instructionMessage, ...messages],
    });

    await openai.chat.completions.create;
    await increaseApiLimit();

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[Code_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
