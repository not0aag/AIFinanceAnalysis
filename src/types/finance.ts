// Comprehensive type definitions for the entire app
export interface Transaction {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  type: "income" | "expense";
  recurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  tags?: string[];
  notes?: string;
  merchant?: string;
  paymentMethod?: "cash" | "credit" | "debit" | "bank_transfer" | "other";
  isVerified?: boolean;
  attachments?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  allocated: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string;
  notifications: {
    enabled: boolean;
    threshold: number; // percentage
  };
  rollover?: boolean;
  color?: string;
  icon?: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: "savings" | "debt" | "investment" | "purchase" | "other";
  priority: "low" | "medium" | "high";
  autoContribute?: {
    enabled: boolean;
    amount: number;
    frequency: "weekly" | "monthly";
  };
  milestones?: {
    percentage: number;
    reached: boolean;
    reachedDate?: string;
  }[];
  notes?: string;
}

export interface AIInsight {
  id: string;
  type:
    | "warning"
    | "opportunity"
    | "achievement"
    | "prediction"
    | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  actionItems: string[];
  potentialSavings?: number;
  timeframe: string;
  confidence: number; // 0-100
  dismissed?: boolean;
  createdAt: string;
}

export interface FinancialProfile {
  userId: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  netWorth?: number;
  savingsGoal: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
  creditScore?: number;
  financialGoals?: FinancialGoal[];
  preferences: {
    currency: string;
    timezone: string;
    fiscalYearStart: number; // month (1-12)
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
}

export interface SpendingPattern {
  category: string;
  averageMonthly: number;
  trend: "increasing" | "decreasing" | "stable";
  percentageChange: number;
  forecast: {
    nextMonth: number;
    confidence: number;
  };
}

export interface FinancialReport {
  period: {
    start: string;
    end: string;
  };
  income: {
    total: number;
    byCategory: Record<string, number>;
    growth: number;
  };
  expenses: {
    total: number;
    byCategory: Record<string, number>;
    topMerchants: Array<{
      name: string;
      amount: number;
      count: number;
    }>;
  };
  savings: {
    amount: number;
    rate: number;
    goalProgress: number;
  };
  insights: AIInsight[];
  recommendations: string[];
}
// Add FinancialMetrics to the existing types
export interface FinancialMetrics {
  netWorth: number;
  netWorthChange: number;
  income: number;
  incomeChange: number;
  expenses: number;
  expenseChange: number;
  savingsRate: number;
  savingsRateChange: number;
  topCategory: string;
  transactionCount: number;
  averageTransactionSize: number;
}
