import { NextResponse } from "next/server";
import OpenAI from "openai";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
    });
  }
  return openaiClient;
}

export async function POST(request: Request) {
  try {
    const { message, transactions, metrics } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Prepare financial context for AI
    const totalIncome =
      transactions
        ?.filter((t: any) => t.type === "income")
        .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;

    const totalExpenses =
      transactions
        ?.filter((t: any) => t.type === "expense")
        .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0) || 0;

    const categoryBreakdown =
      transactions?.reduce((acc: any, t: any) => {
        if (t.type === "expense") {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        }
        return acc;
      }, {}) || {};

    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a]: any, [, b]: any) => b - a)
      .slice(0, 5)
      .map(([cat, amount]) => `${cat}: $${(amount as number).toFixed(2)}`);

    const financialContext = `
Financial Summary:
- Total Transactions: ${transactions?.length || 0}
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpenses.toFixed(2)}
- Net: $${(totalIncome - totalExpenses).toFixed(2)}
- Top Spending Categories: ${topCategories.join(", ") || "None"}
- Savings Rate: ${
      totalIncome > 0
        ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
        : 0
    }%

Additional Metrics:
${
  metrics
    ? `
- Net Worth: $${metrics.netWorth?.toFixed(2) || 0}
- Net Worth Change: ${metrics.netWorthChange?.toFixed(1) || 0}%
- Income Change: ${metrics.incomeChange?.toFixed(1) || 0}%
- Expense Change: ${metrics.expenseChange?.toFixed(1) || 0}%
- Average Transaction: $${metrics.averageTransactionSize?.toFixed(2) || 0}
`
    : "Not available"
}
`;

    // Call OpenAI with financial context
    const completion = await getOpenAIClient().chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert financial advisor AI assistant. You help users understand their finances, provide actionable insights, and answer questions about their spending, income, budgets, and financial goals.

Be conversational, friendly, and helpful. Provide specific, actionable advice based on the user's actual financial data. Use numbers and percentages to make your advice concrete.

When analyzing spending:
- Identify patterns and trends
- Suggest areas for improvement
- Highlight positive financial behaviors
- Give specific, realistic recommendations

Keep responses concise (2-4 sentences for simple questions, longer for complex analysis).`,
        },
        {
          role: "user",
          content: `${financialContext}\n\nUser question: ${message}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I apologize, but I couldn't generate a response. Please try again.";

    return NextResponse.json({
      response: aiResponse,
      success: true,
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      {
        error: "Failed to process your question. Please try again.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
