import { NextResponse } from "next/server";

export async function GET() {
  const testData = {
    transactions: [
      {
        id: "1",
        userId: "user-1",
        name: "Grocery Store",
        amount: -150.5,
        category: "Groceries",
        date: new Date().toISOString(),
        type: "expense",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId: "user-1",
        name: "Salary",
        amount: 5000,
        category: "Income",
        date: new Date().toISOString(),
        type: "income",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    monthlyIncome: 5000,
    financialGoals: ["Save for vacation", "Emergency fund"],
  };

  try {
    // Test the financial analysis endpoint
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? `https://${process.env.VERCEL_URL}/api/ai/financial-analysis`
        : "http://localhost:3000/api/ai/financial-analysis";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `API returned ${response.status}: ${errorText}`,
      });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
