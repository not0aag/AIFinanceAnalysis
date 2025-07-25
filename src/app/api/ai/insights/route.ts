import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInsight } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Get recent transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Generate AI insight
    const content = await generateInsight(transactions);

    // Save insight
    const insight = await prisma.insight.create({
      data: {
        userId,
        type: "spending_pattern",
        content,
        data: { transactionCount: transactions.length },
      },
    });

    return NextResponse.json(insight);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 }
    );
  }
}
