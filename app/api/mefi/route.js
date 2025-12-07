import OpenAI from "openai";
import { NextResponse } from "next/server";
import { SAFETY_KEYWORDS } from "@/lib/medical/safetyKeywords";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { chatLog } from "@/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Safety keyword checker
function containsKeyword(message = "", list = []) {
  const text = message.toLowerCase();
  for (let i = 0; i < list.length; i++) {
    if (text.includes(list[i].toLowerCase())) return true;
  }
  return false;
}

export async function POST(req) {
  const { message } = await req.json();

  // Better Auth user - need to pass headers for App Router
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  const userId = session?.user?.id || null;

  // Save + respond helper
  async function saveAndRespond(answer) {
    await db.insert(chatLog).values({
      id: randomUUID(),
      userId,
      question: message,
      answer,
    });

    return NextResponse.json({ answer });
  }

  // SAFETY CHECKS
  if (containsKeyword(message, SAFETY_KEYWORDS.emergency)) {
    return saveAndRespond(
      "⚠️ Your symptoms might be serious. Please go to an emergency room or call emergency services."
    );
  }

  if (containsKeyword(message, SAFETY_KEYWORDS.selfHarm)) {
    return saveAndRespond(
      "I'm really sorry you're feeling this way. Please contact a crisis hotline or emergency services immediately."
    );
  }

  if (containsKeyword(message, SAFETY_KEYWORDS.dosing)) {
    return saveAndRespond(
      "I can't give medication doses. Please ask a doctor or pharmacist."
    );
  }

  if (containsKeyword(message, SAFETY_KEYWORDS.unsafeTreatment)) {
    return saveAndRespond(
      "I can't guide medical procedures. Please see a healthcare professional."
    );
  }

  // If safe → ask AI
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a cautious medical info assistant.
Use simple language.
Do NOT diagnose.
Do NOT give medication doses.
Always advise seeing a doctor.
        `,
      },
      { role: "user", content: message },
    ],
  });

  const answer = completion.choices[0].message.content;

  return saveAndRespond(answer);
}

export async function GET(req) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  const userId = session?.user?.id || null;

  const chatHistory = await db
    .select()
    .from(chatLog)
    .where(eq(chatLog.userId, userId));

  return NextResponse.json(chatHistory);
}
