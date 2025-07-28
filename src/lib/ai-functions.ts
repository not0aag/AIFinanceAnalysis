import { Transaction, FinancialProfile } from "@/types/finance";

export async function categorizeTransaction(
  description: string
): Promise<string> {
  // Simple rule-based categorization for now
  const lowerDesc = description.toLowerCase();

  if (
    lowerDesc.includes("grocery") ||
    lowerDesc.includes("safeway") ||
    lowerDesc.includes("whole foods")
  ) {
    return "Groceries";
  } else if (
    lowerDesc.includes("gas") ||
    lowerDesc.includes("shell") ||
    lowerDesc.includes("chevron")
  ) {
    return "Transportation";
  } else if (lowerDesc.includes("rent") || lowerDesc.includes("mortgage")) {
    return "Housing";
  } else if (
    lowerDesc.includes("restaurant") ||
    lowerDesc.includes("cafe") ||
    lowerDesc.includes("coffee")
  ) {
    return "Food & Dining";
  } else if (lowerDesc.includes("amazon") || lowerDesc.includes("walmart")) {
    return "Shopping";
  } else if (lowerDesc.includes("netflix") || lowerDesc.includes("spotify")) {
    return "Entertainment";
  } else if (
    lowerDesc.includes("electric") ||
    lowerDesc.includes("water") ||
    lowerDesc.includes("internet")
  ) {
    return "Utilities";
  }

  return "Miscellaneous";
}

export async function generateInsight(
  transactions: Transaction[]
): Promise<string> {
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const avgExpense = totalExpenses / transactions.length;

  return `Based on your recent ${
    transactions.length
  } transactions, you're averaging $${avgExpense.toFixed(
    2
  )} per transaction. Consider setting spending limits for better budget control.`;
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
  nextMonthPrediction: {
    expectedExpenses: number;
    savingsPotential: number;
  };
}> {
  // Calculate financial metrics
  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const monthlyIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate =
    monthlyIncome > 0
      ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
      : 0;

  // Calculate health score (0-100)
  let healthScore = 50; // Base score

  // Adjust based on savings rate
  if (savingsRate >= 20) healthScore += 30;
  else if (savingsRate >= 10) healthScore += 20;
  else if (savingsRate >= 5) healthScore += 10;
  else if (savingsRate < 0) healthScore -= 20;

  // Adjust based on expense to income ratio
  const expenseRatio = monthlyIncome > 0 ? monthlyExpenses / monthlyIncome : 1;
  if (expenseRatio < 0.7) healthScore += 10;
  else if (expenseRatio > 0.9) healthScore -= 10;

  // Ensure score is within bounds
  healthScore = Math.max(0, Math.min(100, healthScore));

  // Generate insights based on spending patterns
  const insights = [];

  // Category analysis
  const categoryExpenses = new Map<string, number>();
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categoryExpenses.get(t.category) || 0;
      categoryExpenses.set(t.category, current + Math.abs(t.amount));
    });

  // Find highest spending category
  let highestCategory = "";
  let highestAmount = 0;
  categoryExpenses.forEach((amount, category) => {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestCategory = category;
    }
  });

  // Generate category insight
  if (highestCategory) {
    const categoryPercentage = (highestAmount / monthlyExpenses) * 100;
    if (categoryPercentage > 30) {
      insights.push({
        type: "warning",
        title: `High ${highestCategory} Spending`,
        description: `You're spending ${categoryPercentage.toFixed(
          0
        )}% of your budget on ${highestCategory}. This category represents your highest expense.`,
        impact: "high" as const,
        actionItems: [
          `Review all ${highestCategory} transactions for potential cuts`,
          `Set a monthly budget limit for ${highestCategory}`,
          `Look for cheaper alternatives or discounts`,
          `Track daily spending in this category`,
        ],
        potentialSavings: highestAmount * 0.2, // Assume 20% reduction possible
        timeframe: "Next 30 days",
      });
    }
  }

  // Savings insight
  if (savingsRate < 10) {
    insights.push({
      type: "opportunity",
      title: "Boost Your Savings Rate",
      description: `Your current savings rate is ${savingsRate.toFixed(
        1
      )}%. Financial experts recommend saving at least 20% of income.`,
      impact: "high" as const,
      actionItems: [
        "Set up automatic transfers to savings",
        "Review and reduce non-essential expenses",
        "Create a zero-based budget",
        "Find additional income sources",
      ],
      potentialSavings: monthlyIncome * 0.1,
      timeframe: "Next 60 days",
    });
  } else if (savingsRate >= 20) {
    insights.push({
      type: "achievement",
      title: "Excellent Savings Rate!",
      description: `You're saving ${savingsRate.toFixed(
        1
      )}% of your income, which is above the recommended 20%. Keep up the great work!`,
      impact: "low" as const,
      actionItems: [
        "Consider investing surplus savings",
        "Review investment portfolio allocation",
        "Explore tax-advantaged accounts",
        "Plan for long-term financial goals",
      ],
      timeframe: "Ongoing",
    });
  }

  // Spending trend insight
  const recentExpenses = transactions
    .filter((t) => t.type === "expense")
    .slice(0, 10)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const avgRecentExpense = recentExpenses / Math.min(10, transactions.length);
  const overallAvgExpense =
    monthlyExpenses / transactions.filter((t) => t.type === "expense").length;

  if (avgRecentExpense > overallAvgExpense * 1.2) {
    insights.push({
      type: "warning",
      title: "Spending Increase Detected",
      description:
        "Your recent spending is 20% higher than your average. This could impact your budget goals.",
      impact: "medium" as const,
      actionItems: [
        "Review recent purchases for necessity",
        "Implement a 24-hour rule for non-essential purchases",
        "Use cash for discretionary spending",
        "Set daily spending limits",
      ],
      potentialSavings: (avgRecentExpense - overallAvgExpense) * 30,
      timeframe: "Next 7 days",
    });
  }

  // Add a prediction insight
  insights.push({
    type: "prediction",
    title: "Next Month Forecast",
    description: `Based on your spending patterns, we predict you'll spend approximately $${(
      monthlyExpenses * 1.05
    ).toFixed(0)} next month.`,
    impact: "medium" as const,
    actionItems: [
      "Prepare budget for predicted expenses",
      "Identify areas for potential reduction",
      "Set aside emergency fund buffer",
      "Monitor spending weekly",
    ],
    timeframe: "Next 30 days",
  });

  return {
    financialHealthScore: healthScore,
    insights: insights,
    nextMonthPrediction: {
      expectedExpenses: monthlyExpenses * 1.05, // 5% increase prediction
      savingsPotential: monthlyExpenses * 0.15, // 15% potential savings
    },
  };
}

// Define the anomaly type
interface Anomaly {
  transaction: Transaction;
  reason: string;
  severity: "high" | "medium" | "low";
  recommendation: string;
}

export async function detectSpendingAnomalies(
  transactions: Transaction[]
): Promise<{
  anomalies: Anomaly[];
  trustScore: number;
}> {
  const anomalies: Anomaly[] = [];

  // Calculate average transaction amount by category
  const categoryAverages = new Map<string, { total: number; count: number }>();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const cat = categoryAverages.get(t.category) || { total: 0, count: 0 };
      cat.total += Math.abs(t.amount);
      cat.count += 1;
      categoryAverages.set(t.category, cat);
    });

  // Detect anomalies
  transactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      const catData = categoryAverages.get(transaction.category);
      if (!catData) return;

      const avgAmount = catData.total / catData.count;
      const amount = Math.abs(transaction.amount);

      // Check for unusually high amounts
      if (amount > avgAmount * 3) {
        anomalies.push({
          transaction,
          reason: `This ${transaction.category} expense is ${(
            amount / avgAmount
          ).toFixed(1)}x higher than your average`,
          severity: "high",
          recommendation:
            "Review this transaction to ensure it's legitimate. Consider setting alerts for large expenses.",
        });
      } else if (amount > avgAmount * 2) {
        anomalies.push({
          transaction,
          reason: `This ${transaction.category} expense is significantly above your typical spending`,
          severity: "medium",
          recommendation: "Monitor similar expenses to avoid budget overruns.",
        });
      }

      // Check for duplicate transactions
      const similarTransactions = transactions.filter(
        (t) =>
          t.id !== transaction.id &&
          Math.abs(t.amount) === amount &&
          t.merchant === transaction.merchant &&
          new Date(t.date).toDateString() ===
            new Date(transaction.date).toDateString()
      );

      if (similarTransactions.length > 0) {
        anomalies.push({
          transaction,
          reason: "Possible duplicate transaction detected",
          severity: "medium",
          recommendation:
            "Verify this isn't a duplicate charge. Contact merchant if necessary.",
        });
      }
    });

  // Calculate trust score based on anomaly rate
  const anomalyRate = anomalies.length / Math.max(transactions.length, 1);
  const trustScore = Math.max(0, Math.min(100, 100 - anomalyRate * 200));

  return {
    anomalies: anomalies.slice(0, 5), // Return top 5 anomalies
    trustScore,
  };
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
  const strategies = [];

  // Calculate current expenses by category
  const categoryExpenses = new Map<string, number>();
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categoryExpenses.get(t.category) || 0;
      categoryExpenses.set(t.category, current + Math.abs(t.amount));
    });

  // Strategy 1: Reduce highest category
  let highestCategory = "";
  let highestAmount = 0;
  categoryExpenses.forEach((amount, category) => {
    if (amount > highestAmount) {
      highestAmount = amount;
      highestCategory = category;
    }
  });

  if (highestCategory) {
    strategies.push({
      title: `Optimize ${highestCategory} Spending`,
      description: `Your ${highestCategory} expenses are your highest at $${highestAmount.toFixed(
        0
      )}/month. Reducing this by 20% would significantly impact your savings.`,
      potentialSavings: highestAmount * 0.2,
      difficulty: "medium" as const,
      timeframe: "30 days",
      steps: [
        `Track all ${highestCategory} expenses daily`,
        "Compare prices before making purchases",
        "Look for discounts, coupons, or bulk buying options",
        "Consider alternatives or substitutes",
        "Set a weekly spending limit and stick to it",
      ],
    });
  }

  // Strategy 2: Eliminate small recurring expenses
  const smallExpenses = transactions
    .filter((t) => t.type === "expense" && Math.abs(t.amount) < 50)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (smallExpenses > 100) {
    strategies.push({
      title: "Cut Small Recurring Expenses",
      description:
        "Small purchases add up. You're spending over $100/month on transactions under $50.",
      potentialSavings: smallExpenses * 0.3,
      difficulty: "easy" as const,
      timeframe: "Immediate",
      steps: [
        "Review all subscriptions and cancel unused ones",
        "Bring lunch instead of buying",
        "Make coffee at home",
        "Use a spending tracker app",
        "Implement the 24-hour rule for small purchases",
      ],
    });
  }

  // Strategy 3: Income optimization
  const totalExpenses = Array.from(categoryExpenses.values()).reduce(
    (a, b) => a + b,
    0
  );
  const savingsRate = ((monthlyIncome - totalExpenses) / monthlyIncome) * 100;

  if (savingsRate < 20) {
    strategies.push({
      title: "Boost Your Income",
      description:
        "Increasing income is often easier than cutting expenses. Even a 10% increase would significantly improve your savings rate.",
      potentialSavings: monthlyIncome * 0.1,
      difficulty: "hard" as const,
      timeframe: "3-6 months",
      steps: [
        "Update your resume and LinkedIn profile",
        "Research market rates for your position",
        "Develop a new skill through online courses",
        "Start a side hustle or freelance work",
        "Negotiate a raise with concrete achievements",
      ],
    });
  }

  // Strategy 4: Automate savings
  strategies.push({
    title: "Automate Your Savings",
    description:
      "Pay yourself first. Automating savings ensures you save before you have a chance to spend.",
    potentialSavings: monthlyIncome * 0.1,
    difficulty: "easy" as const,
    timeframe: "This week",
    steps: [
      "Set up automatic transfer on payday",
      "Start with 10% of income",
      "Use a high-yield savings account",
      "Increase by 1% every 3 months",
      "Treat savings like a non-negotiable bill",
    ],
  });

  return { strategies };
}
