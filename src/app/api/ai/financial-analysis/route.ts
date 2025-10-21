import { NextResponse } from "next/server";
import {
  generateAdvancedInsights,
  detectSpendingAnomalies,
  generateSavingsStrategy,
} from "@/lib/openai";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      transactions,
      monthlyIncome: providedIncome,
      financialGoals,
    } = body;

    console.log("Financial Analysis Request:", {
      transactionsCount: transactions?.length,
      providedIncome,
      goalsCount: financialGoals?.length,
      hasTransactions: Array.isArray(transactions),
    });

    // Validate input data
    if (!transactions || !Array.isArray(transactions)) {
      console.error("Invalid transactions:", typeof transactions);
      return NextResponse.json(
        { error: "Invalid transactions data - must be an array" },
        { status: 400 }
      );
    }

    if (transactions.length === 0) {
      console.error("No transactions provided");
      return NextResponse.json(
        { error: "No transactions provided" },
        { status: 400 }
      );
    }

    // Allow monthlyIncome to be 0 or undefined
    const validMonthlyIncome =
      typeof providedIncome === "number" && !isNaN(providedIncome)
        ? providedIncome
        : 0;

    const monthlyExpenses = transactions
      .filter((t: any) => t.amount < 0 || t.type === "expense")
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

    const calculatedMonthlyIncome = transactions
      .filter((t: any) => t.amount > 0 || t.type === "income")
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);

    const monthlyIncome = validMonthlyIncome || calculatedMonthlyIncome;

    // Calculate proper savings rate
    const savingsRate =
      monthlyIncome > 0
        ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
        : 0;

    // Calculate health score based on actual data
    let healthScore = 50; // Base score
    if (savingsRate > 20) healthScore += 30;
    else if (savingsRate > 10) healthScore += 20;
    else if (savingsRate > 0) healthScore += 10;

    if (monthlyExpenses < monthlyIncome) healthScore += 20;

    healthScore = Math.min(100, Math.max(0, healthScore));

    const profile = {
      monthlyIncome: validMonthlyIncome || monthlyIncome,
      monthlyExpenses,
      savingsGoal: 1000,
      riskTolerance: "moderate" as const,
    };

    // Run all AI analyses in parallel with error handling
    const [insightsData, anomaliesData, strategiesData] =
      await Promise.allSettled([
        generateAdvancedInsights(transactions, profile).catch((err) => {
          console.error("Insights error:", err);
          return [];
        }),
        detectSpendingAnomalies(transactions).catch((err) => {
          console.error("Anomalies error:", err);
          return [];
        }),
        generateSavingsStrategy(
          monthlyIncome,
          monthlyExpenses,
          financialGoals || []
        ).catch((err) => {
          console.error("Strategies error:", err);
          return null;
        }),
      ]);

    // Extract results or use fallbacks
    const insights =
      insightsData.status === "fulfilled" ? insightsData.value : [];
    const anomalies =
      anomaliesData.status === "fulfilled" ? anomaliesData.value : [];
    const strategies =
      strategiesData.status === "fulfilled" ? strategiesData.value : null;

    // Format response with proper structure
    return NextResponse.json({
      insights: {
        financialHealthScore: Math.round(healthScore),
        insights: Array.isArray(insights)
          ? insights.map((insight: any) => ({
              type: insight.type || "recommendation",
              title: insight.title || "Financial Insight",
              description: insight.description || "No description available",
              impact: insight.impact || "medium",
              actionItems: insight.actionItems || [],
              potentialSavings: insight.potentialSavings || 0,
              timeframe: insight.timeframe || "30 days",
            }))
          : [],
        nextMonthPrediction: {
          expectedExpenses: monthlyExpenses,
          savingsPotential: monthlyExpenses * 0.15,
        },
      },
      anomalies: {
        anomalies: Array.isArray(anomalies) ? anomalies : [],
        trustScore: 95,
      },
      savingsStrategies: strategies || {
        strategies: [],
      },
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
