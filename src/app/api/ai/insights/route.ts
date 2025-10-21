import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInsight } from "@/lib/openai";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
    const userProfile = {
      monthlyIncome: 5000, // Default value - should be fetched from user profile
      monthlyExpenses: transactions
        .filter((t: any) => t.amount < 0)
        .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0),
      savingsGoal: 1000,
      riskTolerance: "moderate" as const,
    };

    const content = await generateInsight(transactions, userProfile);

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
