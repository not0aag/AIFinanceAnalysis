import { NextResponse } from "next/server";
import {
  generateAdvancedInsights,
  detectSpendingAnomalies,
  generateSavingsStrategy,
} from "@/lib/ai-functions";
import { Transaction, FinancialProfile } from "@/types/finance";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactions, monthlyIncome, financialGoals } = body;

    // Validate input data
    if (!transactions || !Array.isArray(transactions)) {
      return NextResponse.json(
        { error: "Invalid transactions data" },
        { status: 400 }
      );
    }

    if (!monthlyIncome || isNaN(monthlyIncome) || monthlyIncome <= 0) {
      return NextResponse.json(
        { error: "Invalid monthly income" },
        { status: 400 }
      );
    }

    // Ensure transactions have proper types
    const typedTransactions: Transaction[] = transactions.map((t: any) => ({
      ...t,
      type: t.type || (t.amount > 0 ? "income" : "expense"),
      amount: typeof t.amount === "number" ? t.amount : parseFloat(t.amount),
    }));

    // Calculate monthly expenses from transactions
    const monthlyExpenses = typedTransactions
      .filter((t: Transaction) => t.type === "expense")
      .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);

    // Create a proper financial profile
    const profile: FinancialProfile = {
      userId: "user-1",
      monthlyIncome: monthlyIncome,
      monthlyExpenses: monthlyExpenses,
      savingsGoal: Math.max(1000, monthlyIncome * 0.2), // 20% of income or $1000 minimum
      riskTolerance: "moderate",
      financialGoals: financialGoals || [],
      preferences: {
        currency: "USD",
        timezone: "America/New_York",
        fiscalYearStart: 1,
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    };

    // Run all AI analyses in parallel with error handling
    const [insightsData, anomaliesData, strategiesData] = await Promise.all([
      generateAdvancedInsights(typedTransactions, profile).catch((err) => {
        console.error("Error generating insights:", err);
        return {
          financialHealthScore: 50,
          insights: [],
          nextMonthPrediction: {
            expectedExpenses: monthlyExpenses,
            savingsPotential: 0,
          },
        };
      }),
      detectSpendingAnomalies(typedTransactions).catch((err) => {
        console.error("Error detecting anomalies:", err);
        return { anomalies: [], trustScore: 100 };
      }),
      generateSavingsStrategy(
        typedTransactions,
        monthlyIncome,
        financialGoals || []
      ).catch((err) => {
        console.error("Error generating strategies:", err);
        return { strategies: [] };
      }),
    ]);

    // Return successful response
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
