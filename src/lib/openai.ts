// This file should ONLY be used in server-side API routes
import OpenAI from "openai";

// Only initialize if we're on the server and have an API key
const openai =
  typeof window === "undefined" && process.env.OPENAI_API_KEY
    ? new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
    : null;

interface Transaction {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
}

interface FinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
}

// Advanced financial insights with actionable recommendations
export async function generateAdvancedInsights(
  transactions: Transaction[],
  profile: FinancialProfile
): Promise<{
  insights: Array<{
    type: "warning" | "opportunity" | "achievement" | "prediction";
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    actionItems: string[];
    potentialSavings?: number;
    timeframe: string;
  }>;
  financialHealthScore: number;
  nextMonthPrediction: {
    expectedExpenses: number;
    savingsPotential: number;
    riskFactors: string[];
  };
}> {
  const expenses = transactions.filter((t) => t.amount < 0);
  const income = transactions.filter((t) => t.amount > 0);

  const totalExpenses = expenses.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  // Calculate financial health score (0-100)
  const savingsRate =
    totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
  const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : 1;

  let financialHealthScore = 100;

  // Deduct points for high expense ratio
  if (expenseRatio > 0.9) financialHealthScore -= 40;
  else if (expenseRatio > 0.8) financialHealthScore -= 25;
  else if (expenseRatio > 0.7) financialHealthScore -= 15;
  else if (expenseRatio > 0.6) financialHealthScore -= 5;

  // Add points for good savings rate
  if (savingsRate > 0.3) financialHealthScore += 10;
  else if (savingsRate > 0.2) financialHealthScore += 5;

  financialHealthScore = Math.max(0, Math.min(100, financialHealthScore));

  // Generate smart insights
  const insights = [];

  // High expense ratio warning
  if (expenseRatio > 0.85) {
    insights.push({
      type: "warning" as const,
      title: "High Expense Ratio Alert",
      description: `You're spending ${Math.round(
        expenseRatio * 100
      )}% of your income, leaving little room for savings or emergencies.`,
      impact: "high" as const,
      actionItems: [
        "Review all expenses and identify non-essentials",
        "Cancel unused subscriptions immediately",
        "Set strict monthly spending limits",
        "Consider additional income sources",
      ],
      potentialSavings: Math.floor(totalExpenses * 0.2),
      timeframe: "This week",
    });
  }

  // Subscription optimization opportunity
  const subscriptionCategories = ["Entertainment", "Bills & Utilities"];
  const subscriptionSpending = Object.entries(categoryBreakdown)
    .filter(([category]) => subscriptionCategories.includes(category))
    .reduce((sum, [, amount]) => sum + amount, 0);

  if (subscriptionSpending > 50) {
    insights.push({
      type: "opportunity" as const,
      title: "Subscription Optimization",
      description: `You're spending $${subscriptionSpending.toFixed(
        0
      )} on subscriptions and recurring services. There's likely room for optimization.`,
      impact: "medium" as const,
      actionItems: [
        "Audit all subscription services",
        "Cancel services you rarely use",
        "Look for annual discounts on kept services",
        "Share family plans with household members",
      ],
      potentialSavings: Math.floor(subscriptionSpending * 0.3),
      timeframe: "This month",
    });
  }

  // Dining optimization if high food spending
  const foodSpending = categoryBreakdown["Food & Dining"] || 0;
  if (foodSpending > totalExpenses * 0.25) {
    insights.push({
      type: "opportunity" as const,
      title: "Food Spending Optimization",
      description: `Food expenses represent ${Math.round(
        (foodSpending / totalExpenses) * 100
      )}% of your spending. Consider meal planning to reduce costs.`,
      impact: "medium" as const,
      actionItems: [
        "Plan meals for the week ahead",
        "Cook at home 3 more times per week",
        "Use grocery lists to avoid impulse buys",
        "Try batch cooking on weekends",
      ],
      potentialSavings: Math.floor(foodSpending * 0.25),
      timeframe: "Next 2 weeks",
    });
  }

  // Positive savings achievement
  if (savingsRate > 0.2) {
    insights.push({
      type: "achievement" as const,
      title: "Great Savings Rate!",
      description: `You're saving ${Math.round(
        savingsRate * 100
      )}% of your income. This puts you ahead of most people your age.`,
      impact: "low" as const,
      actionItems: [
        "Consider investing excess savings",
        "Explore high-yield savings accounts",
        "Research retirement account contributions",
        "Set up automatic investment transfers",
      ],
      timeframe: "Next month",
    });
  }

  // Spending prediction
  const avgMonthlyExpenses = totalExpenses;
  insights.push({
    type: "prediction" as const,
    title: "Next Month Projection",
    description: `Based on current patterns, you're projected to spend $${Math.round(
      avgMonthlyExpenses * 1.05
    )} next month.`,
    impact: "medium" as const,
    actionItems: [
      "Set daily spending alerts",
      "Review largest expense categories",
      "Plan major purchases in advance",
      "Track expenses in real-time",
    ],
    timeframe: "Next month",
  });

  return {
    insights,
    financialHealthScore: Math.round(financialHealthScore),
    nextMonthPrediction: {
      expectedExpenses: Math.round(totalExpenses * 1.02),
      savingsPotential: Math.max(0, totalIncome - totalExpenses * 1.1),
      riskFactors: [
        "Seasonal spending variations",
        "Subscription renewals",
        "Unexpected expenses",
        "Economic uncertainty",
      ],
    },
  };
}

// Smart savings recommendations
export async function generateSavingsStrategy(
  income: number,
  expenses: number,
  goals: string[]
): Promise<{
  strategies: Array<{
    title: string;
    description: string;
    potentialSavings: number;
    difficulty: "easy" | "medium" | "hard";
    timeframe: string;
    steps: string[];
  }>;
  priorityOrder: number[];
}> {
  const surplus = income - expenses;
  const savingsRate = income > 0 ? surplus / income : 0;

  const strategies = [];

  // Easy automation strategy
  if (surplus > 0) {
    strategies.push({
      title: "Automate Your Savings",
      description:
        "Set up automatic transfers to build wealth without thinking about it.",
      potentialSavings: Math.floor(surplus * 0.5),
      difficulty: "easy" as const,
      timeframe: "1 week to setup",
      steps: [
        "Open a high-yield savings account (2.5%+ APY)",
        `Set up automatic transfer of $${Math.floor(surplus * 0.2)} weekly`,
        "Schedule transfers for day after payday",
        "Increase amount by $25 every month",
      ],
    });
  }

  // Service optimization strategy
  strategies.push({
    title: "Service & Subscription Audit",
    description:
      "Review and optimize all recurring payments for maximum savings.",
    potentialSavings: Math.floor(expenses * 0.08),
    difficulty: "medium" as const,
    timeframe: "2-3 hours total",
    steps: [
      "List all monthly recurring charges",
      "Cancel unused services immediately",
      "Call providers to negotiate better rates",
      "Bundle services for multi-service discounts",
    ],
  });

  // If low savings rate, add emergency cuts
  if (savingsRate < 0.1) {
    strategies.unshift({
      title: "Emergency Expense Reduction",
      description:
        "Your savings rate is low. Focus on cutting expenses immediately.",
      potentialSavings: Math.floor(expenses * 0.15),
      difficulty: "hard" as const,
      timeframe: "This month",
      steps: [
        "Track every expense for one week",
        "Eliminate all non-essential spending",
        "Cook all meals at home for 2 weeks",
        "Use public transport instead of rideshares",
        "Cancel all entertainment subscriptions temporarily",
      ],
    });
  }

  // High earner investment strategy
  if (surplus > 2000) {
    strategies.push({
      title: "Investment Acceleration",
      description:
        "You have significant surplus income. Time to make your money work harder.",
      potentialSavings: Math.floor(surplus * 0.3),
      difficulty: "medium" as const,
      timeframe: "2-4 weeks",
      steps: [
        "Maximize 401(k) employer match",
        "Open Roth IRA and contribute monthly",
        "Research low-cost index funds",
        "Consider tax-loss harvesting strategies",
      ],
    });
  }

  return {
    strategies,
    priorityOrder: Array.from({ length: strategies.length }, (_, i) => i),
  };
}

// Fixed anomaly detection - EXCLUDES INCOME TRANSACTIONS
export async function detectSpendingAnomalies(
  transactions: Transaction[]
): Promise<{
  anomalies: Array<{
    transaction: Transaction;
    reason: string;
    severity: "low" | "medium" | "high";
    recommendation: string;
  }>;
  trustScore: number;
}> {
  try {
    // IMPORTANT: Only analyze EXPENSE transactions (negative amounts)
    const expenseTransactions = transactions.filter((t) => t.amount < 0);

    if (expenseTransactions.length < 3) {
      return {
        anomalies: [],
        trustScore: 95,
      };
    }

    const amounts = expenseTransactions
      .map((t) => Math.abs(t.amount))
      .sort((a, b) => a - b);
    const median = amounts[Math.floor(amounts.length / 2)] || 50;

    // Use median-based threshold to detect outliers
    const threshold = median * 3; // Only flag expenses 3x higher than median

    const anomalies = expenseTransactions
      .filter((t) => Math.abs(t.amount) > threshold)
      .map((transaction) => {
        const multiplier = Math.round(Math.abs(transaction.amount) / median);
        return {
          transaction,
          reason: `This $${Math.abs(
            transaction.amount
          )} expense is ${multiplier}x your typical spending amount`,
          severity:
            Math.abs(transaction.amount) > threshold * 2
              ? ("high" as const)
              : ("medium" as const),
          recommendation:
            Math.abs(transaction.amount) > 500
              ? "Large expense detected. Verify this is legitimate and budget for similar future expenses."
              : "Monitor this spending category to ensure it doesn't become a pattern.",
        };
      });

    // Higher trust score with fewer anomalies
    const trustScore = Math.max(60, 100 - anomalies.length * 10);

    return {
      anomalies,
      trustScore,
    };
  } catch (error) {
    console.error("Error detecting anomalies:", error);
    return {
      anomalies: [],
      trustScore: 90,
    };
  }
}
