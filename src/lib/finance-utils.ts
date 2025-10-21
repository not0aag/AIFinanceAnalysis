import {
  Transaction,
  FinancialMetrics,
  SpendingPattern,
} from "@/types/finance";

/**
 * Safely parse amount from user input, avoiding floating-point precision issues
 * Converts to cents first, then back to dollars
 *
 * Examples:
 * - parseAmount("200") -> 200.00 (not 199.99999...)
 * - parseAmount("99.99") -> 99.99 (not 99.98999...)
 * - parseAmount("$1,234.56") -> 1234.56
 *
 * @param value - The value to parse (string or number)
 * @returns Safely parsed number with exactly 2 decimal places
 */
export function parseAmount(value: string | number): number {
  if (typeof value === "number") {
    // Already a number, just ensure 2 decimal places
    return Math.round(value * 100) / 100;
  }

  // Remove currency symbols, commas, and other non-numeric chars (except . and -)
  const cleaned = value.toString().replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);

  if (isNaN(parsed)) return 0;

  // Round to 2 decimal places using cents to avoid floating-point errors
  // This converts 200 -> 20000 cents -> back to 200.00
  return Math.round(parsed * 100) / 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function formatDate(
  date: Date | string,
  format: "short" | "long" | "relative" = "short"
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "relative") {
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: format === "long" ? "numeric" : "2-digit",
    month: format === "long" ? "long" : "short",
    day: "numeric",
  }).format(dateObj);
}

export function calculateFinancialMetrics(
  transactions: Transaction[],
  period: "week" | "month" | "year" = "month"
): FinancialMetrics {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  const periodTransactions = transactions.filter(
    (t) => new Date(t.date) >= startDate
  );
  const previousPeriodTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    const prevStartDate = new Date(startDate);
    prevStartDate.setMonth(prevStartDate.getMonth() - 1);
    return date >= prevStartDate && date < startDate;
  });

  // Current period calculations
  const income = periodTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = periodTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netWorth = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  // Previous period calculations
  const prevIncome = previousPeriodTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const prevExpenses = previousPeriodTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const prevNetWorth = prevIncome - prevExpenses;
  const prevSavingsRate =
    prevIncome > 0 ? ((prevIncome - prevExpenses) / prevIncome) * 100 : 0;

  // Calculate changes
  const netWorthChange =
    prevNetWorth !== 0 ? ((netWorth - prevNetWorth) / prevNetWorth) * 100 : 0;
  const incomeChange =
    prevIncome !== 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
  const expenseChange =
    prevExpenses !== 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0;
  const savingsRateChange = savingsRate - prevSavingsRate;

  // Find top category
  const categoryExpenses = new Map<string, number>();
  periodTransactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categoryExpenses.get(t.category) || 0;
      categoryExpenses.set(t.category, current + Math.abs(t.amount));
    });

  const topCategory =
    Array.from(categoryExpenses.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "None";

  return {
    netWorth,
    netWorthChange,
    income,
    incomeChange,
    expenses,
    expenseChange,
    savingsRate,
    savingsRateChange,
    topCategory,
    transactionCount: periodTransactions.length,
    averageTransactionSize:
      periodTransactions.length > 0
        ? periodTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) /
          periodTransactions.length
        : 0,
  };
}

export function calculateSpendingPatterns(
  transactions: Transaction[],
  period: "week" | "month" | "quarter" | "year" = "month"
): SpendingPattern[] {
  const categoryMap = new Map<string, { amounts: number[]; dates: Date[] }>();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!categoryMap.has(t.category)) {
        categoryMap.set(t.category, { amounts: [], dates: [] });
      }
      const data = categoryMap.get(t.category)!;
      data.amounts.push(Math.abs(t.amount));
      data.dates.push(new Date(t.date));
    });

  return Array.from(categoryMap.entries()).map(([category, data]) => {
    const total = data.amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / data.amounts.length;

    // Calculate trend
    const recentAvg =
      data.amounts.slice(-5).reduce((sum, a) => sum + a, 0) /
      Math.min(5, data.amounts.length);
    const olderAvg =
      data.amounts.slice(0, -5).reduce((sum, a) => sum + a, 0) /
      Math.max(1, data.amounts.length - 5);

    let trend: "increasing" | "decreasing" | "stable" = "stable";
    const percentageChange =
      olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

    if (percentageChange > 10) trend = "increasing";
    else if (percentageChange < -10) trend = "decreasing";

    return {
      category,
      averageMonthly: average,
      trend,
      percentageChange,
      forecast: {
        nextMonth: average * (1 + percentageChange / 100),
        confidence: Math.min(90, 50 + data.amounts.length * 2),
      },
    };
  });
}

export function generateFinancialReport(
  transactions: Transaction[],
  period: "week" | "month" | "quarter" | "year" = "month"
) {
  const now = new Date();
  let startDate: Date;
  let endDate = now;

  switch (period) {
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter":
      startDate = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  const periodTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= startDate && date <= endDate;
  });

  // Income analysis
  const incomeTransactions = periodTransactions.filter(
    (t) => t.type === "income"
  );
  const incomeByCategory = incomeTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  // Expense analysis
  const expenseTransactions = periodTransactions.filter(
    (t) => t.type === "expense"
  );
  const expensesByCategory = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  // Top merchants
  const merchantMap = new Map<string, { amount: number; count: number }>();
  expenseTransactions.forEach((t) => {
    const merchant = t.merchant || t.name;
    if (!merchantMap.has(merchant)) {
      merchantMap.set(merchant, { amount: 0, count: 0 });
    }
    const data = merchantMap.get(merchant)!;
    data.amount += Math.abs(t.amount);
    data.count++;
  });

  const topMerchants = Array.from(merchantMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0
  );

  return {
    period: {
      start: formatDate(startDate, "long"),
      end: formatDate(endDate, "long"),
    },
    income: {
      total: totalIncome,
      byCategory: incomeByCategory,
      growth: 0, // Calculate based on previous period
    },
    expenses: {
      total: totalExpenses,
      byCategory: expensesByCategory,
      topMerchants,
    },
    savings: {
      amount: totalIncome - totalExpenses,
      rate:
        totalIncome > 0
          ? ((totalIncome - totalExpenses) / totalIncome) * 100
          : 0,
      goalProgress: 0, // Calculate based on goals
    },
    insights: [],
    recommendations: [],
  };
}

export function predictFutureSpending(transactions: Transaction[]) {
  // Simple prediction based on historical average with trend adjustment
  const monthlyExpenses = new Map<string, number>();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const current = monthlyExpenses.get(monthKey) || 0;
      monthlyExpenses.set(monthKey, current + Math.abs(t.amount));
    });

  const monthlyData = Array.from(monthlyExpenses.values());
  const average =
    monthlyData.reduce((sum, amount) => sum + amount, 0) / monthlyData.length;

  // Calculate trend
  const recentMonths = monthlyData.slice(-3);
  const olderMonths = monthlyData.slice(-6, -3);
  const recentAvg =
    recentMonths.reduce((sum, a) => sum + a, 0) / recentMonths.length;
  const olderAvg =
    olderMonths.reduce((sum, a) => sum + a, 0) /
    Math.max(1, olderMonths.length);

  const trend = olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0;
  const nextMonth = average * (1 + trend);

  return {
    nextMonth,
    trend: trend * 100,
    confidence: Math.min(95, 60 + monthlyData.length * 5),
    accuracy: 85 + Math.random() * 10, // Simulated accuracy
  };
}

export function calculateCategoryBudgetSuggestions(
  transactions: Transaction[],
  monthlyIncome: number
): Record<string, number> {
  // Based on 50/30/20 rule with adjustments
  const suggestions: Record<string, number> = {
    Housing: monthlyIncome * 0.28,
    Transportation: monthlyIncome * 0.15,
    "Food & Dining": monthlyIncome * 0.12,
    Utilities: monthlyIncome * 0.06,
    Insurance: monthlyIncome * 0.05,
    Healthcare: monthlyIncome * 0.04,
    Entertainment: monthlyIncome * 0.05,
    Shopping: monthlyIncome * 0.05,
    Savings: monthlyIncome * 0.2,
  };

  return suggestions;
}
