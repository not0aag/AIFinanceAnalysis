import { NextResponse } from "next/server";
import {
  generateAdvancedInsights,
  detectSpendingAnomalies,
  generateSavingsStrategy,
} from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const { transactions, monthlyIncome, financialGoals } =
      await request.json();

    // Validate input data
    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: "Invalid transactions data" },
        { status: 400 }
      );
    }

    if (!monthlyIncome || isNaN(monthlyIncome)) {
      return NextResponse.json(
        { error: "Invalid monthly income" },
        { status: 400 }
      );
    }

    const monthlyExpenses = transactions
      .filter((t: any) => t.amount < 0)
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

    const profile = {
      monthlyIncome,
      monthlyExpenses,
      savingsGoal: 1000,
      riskTolerance: "moderate" as const,
    };

    // Run all AI analyses in parallel
    const [insightsData, anomaliesData, strategiesData] = await Promise.all([
      generateAdvancedInsights(transactions, profile),
      detectSpendingAnomalies(transactions),
      generateSavingsStrategy(
        monthlyIncome,
        monthlyExpenses,
        financialGoals || []
      ),
    ]);

    return NextResponse.json({
      insights: insightsData,
      anomalies: anomaliesData,
      savingsStrategies: strategiesData,
      success: true,
    });
  } catch (error) {
    console.error("Error in financial analysis:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze financial data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
