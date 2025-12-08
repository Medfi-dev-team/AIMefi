import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session.user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
