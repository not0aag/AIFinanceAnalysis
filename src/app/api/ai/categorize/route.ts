import { NextResponse } from "next/server";
import { categorizeTransaction } from "@/lib/openai";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    const category = await categorizeTransaction(description);

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to categorize transaction" },
      { status: 500 }
    );
  }
}
