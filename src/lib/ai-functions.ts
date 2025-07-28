import { Transaction, FinancialProfile } from "@/types/finance";

export async function categorizeTransaction(
  description: string
): Promise<string> {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("grocery")) return "Groceries";
  if (lowerDesc.includes("gas")) return "Transportation";
  if (lowerDesc.includes("rent")) return "Housing";
  return "Miscellaneous";
}

export async function generateInsight(
  transactions: Transaction[]
): Promise<string> {
  return "AI insight generated successfully";
}

export async function generateAdvancedInsights(
  transactions: Transaction[],
  profile: FinancialProfile
): Promise<{
  financialHealthScore: number;
  insights: Array<{
    type: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    actionItems: string[];
    potentialSavings?: number;
    timeframe: string;
  }>;
  nextMonthPrediction: { expectedExpenses: number; savingsPotential: number };
}> {
  return {
    financialHealthScore: 75,
    insights: [
      {
        type: "prediction",
        title: "Financial Health Good",
        description: "Your financial health is stable",
        impact: "medium" as const,
        actionItems: ["Continue monitoring"],
        timeframe: "Next 30 days",
      },
    ],
    nextMonthPrediction: {
      expectedExpenses: profile.monthlyExpenses * 1.05,
      savingsPotential: profile.monthlyExpenses * 0.15,
    },
  };
}

export async function detectSpendingAnomalies(
  transactions: Transaction[]
): Promise<{
  anomalies: Array<{
    transaction: Transaction;
    reason: string;
    severity: "high" | "medium" | "low";
    recommendation: string;
  }>;
  trustScore: number;
}> {
  return { anomalies: [], trustScore: 95 };
}

export async function generateSavingsStrategy(
  transactions: Transaction[],
  monthlyIncome: number,
  financialGoals: string[]
): Promise<{
  strategies: Array<{
    title: string;
    description: string;
    potentialSavings: number;
    difficulty: "easy" | "medium" | "hard";
    timeframe: string;
    steps: string[];
  }>;
}> {
  return {
    strategies: [
      {
        title: "Automate Savings",
        description: "Set up automatic transfers",
        potentialSavings: monthlyIncome * 0.1,
        difficulty: "easy" as const,
        timeframe: "This week",
        steps: ["Set up automatic transfer", "Start with 10% of income"],
      },
    ],
  };
}
