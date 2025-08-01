// Sample transaction data for testing AI insights
export const sampleTransactions = [
  // Current month (August 2025) transactions
  {
    id: "current-1",
    date: "2025-08-01",
    amount: 5000.0,
    description: "Monthly Salary",
    category: "Salary",
    type: "income" as const,
    merchant: "TechCorp Inc",
    account: "Main Checking",
  },
  {
    id: "current-2",
    date: "2025-08-01",
    amount: -1200.0,
    description: "Monthly Rent",
    category: "Housing",
    type: "expense" as const,
    merchant: "Property Management",
    account: "Main Checking",
  },
  {
    id: "current-3",
    date: "2025-08-02",
    amount: -300.0,
    description: "Grocery Shopping",
    category: "Food & Dining",
    type: "expense" as const,
    merchant: "Whole Foods",
    account: "Main Checking",
  },
  {
    id: "current-4",
    date: "2025-08-03",
    amount: -150.0,
    description: "Gas Station",
    category: "Transportation",
    type: "expense" as const,
    merchant: "Shell",
    account: "Main Checking",
  },
  {
    id: "current-5",
    date: "2025-08-05",
    amount: -89.99,
    description: "Amazon Purchase",
    category: "Shopping",
    type: "expense" as const,
    merchant: "Amazon",
    account: "Credit Card",
  },
  {
    id: "current-6",
    date: "2025-08-07",
    amount: 500.0,
    description: "Freelance Project",
    category: "Freelance",
    type: "income" as const,
    merchant: "Client ABC",
    account: "Main Checking",
  },
  {
    id: "current-7",
    date: "2025-08-10",
    amount: -200.0,
    description: "Dinner Out",
    category: "Food & Dining",
    type: "expense" as const,
    merchant: "Italian Restaurant",
    account: "Credit Card",
  },

  // Previous month (July 2025) for growth calculations
  {
    id: "prev-1",
    date: "2025-07-01",
    amount: 4800.0,
    description: "Monthly Salary",
    category: "Salary",
    type: "income" as const,
    merchant: "TechCorp Inc",
    account: "Main Checking",
  },
  {
    id: "prev-2",
    date: "2025-07-01",
    amount: -1200.0,
    description: "Monthly Rent",
    category: "Housing",
    type: "expense" as const,
    merchant: "Property Management",
    account: "Main Checking",
  },
  {
    id: "prev-3",
    date: "2025-07-03",
    amount: -250.0,
    description: "Grocery Shopping",
    category: "Food & Dining",
    type: "expense" as const,
    merchant: "Safeway",
    account: "Main Checking",
  },

  // Older sample data for historical patterns
  {
    id: "1",
    date: "2024-01-15",
    amount: -125.5,
    description: "Whole Foods Market",
    category: "groceries",
    type: "expense" as const,
    merchant: "Whole Foods",
    account: "Chase Checking",
  },
  {
    id: "2",
    date: "2024-01-14",
    amount: -45.0,
    description: "Shell Gas Station",
    category: "transportation",
    type: "expense" as const,
    merchant: "Shell",
    account: "Chase Checking",
  },
  {
    id: "3",
    date: "2024-01-13",
    amount: -89.99,
    description: "Amazon Purchase",
    category: "shopping",
    type: "expense" as const,
    merchant: "Amazon",
    account: "Chase Credit Card",
  },
  {
    id: "4",
    date: "2024-01-12",
    amount: 3500.0,
    description: "Salary Deposit",
    category: "income",
    type: "income" as const,
    merchant: "Employer",
    account: "Chase Checking",
  },
  {
    id: "5",
    date: "2024-01-11",
    amount: -1200.0,
    description: "Monthly Rent",
    category: "housing",
    type: "expense" as const,
    merchant: "Property Management",
    account: "Chase Checking",
  },
  {
    id: "6",
    date: "2024-01-10",
    amount: -75.32,
    description: "Safeway Groceries",
    category: "groceries",
    type: "expense" as const,
    merchant: "Safeway",
    account: "Chase Checking",
  },
  {
    id: "7",
    date: "2024-01-09",
    amount: -25.99,
    description: "Netflix Subscription",
    category: "entertainment",
    type: "expense" as const,
    merchant: "Netflix",
    account: "Chase Credit Card",
  },
  {
    id: "8",
    date: "2024-01-08",
    amount: -350.0,
    description: "Emergency Car Repair",
    category: "transportation",
    type: "expense" as const,
    merchant: "Auto Shop",
    account: "Chase Checking",
  },
  {
    id: "9",
    date: "2024-01-07",
    amount: -12.5,
    description: "Coffee Shop",
    category: "dining",
    type: "expense" as const,
    merchant: "Starbucks",
    account: "Chase Checking",
  },
  {
    id: "10",
    date: "2024-01-06",
    amount: -180.0,
    description: "Electric Bill",
    category: "utilities",
    type: "expense" as const,
    merchant: "Electric Company",
    account: "Chase Checking",
  },
];

// Categories for transaction organization
export const transactionCategories = [
  "groceries",
  "transportation",
  "shopping",
  "income",
  "housing",
  "entertainment",
  "dining",
  "utilities",
  "healthcare",
  "education",
  "travel",
  "other",
];

// Budget data
export const sampleBudgets = [
  {
    id: "1",
    category: "groceries",
    limit: 400,
    spent: 200.82,
    period: "monthly",
  },
  {
    id: "2",
    category: "transportation",
    limit: 300,
    spent: 395.0,
    period: "monthly",
  },
  {
    id: "3",
    category: "entertainment",
    limit: 150,
    spent: 25.99,
    period: "monthly",
  },
  {
    id: "4",
    category: "dining",
    limit: 200,
    spent: 12.5,
    period: "monthly",
  },
];

// Function to initialize empty data structure (no sample data)
export function initializeSampleData(): void {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    const existingTransactions = localStorage.getItem(
      "finance-ai-transactions"
    );

    // Only initialize empty array if no data exists at all
    if (!existingTransactions) {
      localStorage.setItem("finance-ai-transactions", JSON.stringify([]));
      console.log(
        "✅ Initialized with empty transaction data - ready for user input"
      );
    }
  }
}

// Get current month sample transactions for demo
export function getCurrentMonthSamples() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return sampleTransactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getFullYear() === currentYear && date.getMonth() + 1 === currentMonth
    );
  });
}
