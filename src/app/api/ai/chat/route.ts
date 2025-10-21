import { NextResponse } from "next/server";
import OpenAI from "openai";

// Force dynamic rendering
export const dynamic = "force-dynamic";

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
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

    // Check if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "dummy-key-for-build") {
      console.warn("OpenAI API key not configured, using fallback response");

      // Provide intelligent fallback based on the question
      const question = message.toLowerCase();
      let fallbackResponse = "";

      // Check for last transaction query
      if (question.includes("last") && question.includes("transaction")) {
        if (transactions && transactions.length > 0) {
          const lastTx = transactions[transactions.length - 1];
          const type = lastTx.type === 'income' ? 'income' : 'expense';
          const sign = type === 'income' ? '+' : '-';
          fallbackResponse = `Your last transaction was ${sign}$${Math.abs(lastTx.amount).toFixed(2)} for ${lastTx.name || lastTx.description || 'Unknown'} in the ${lastTx.category} category on ${new Date(lastTx.date).toLocaleDateString()}.`;
        } else {
          fallbackResponse = "You don't have any transactions yet. Add your first transaction to get started!";
        }
      }
      // Check for improvement/savings queries
      else if (
        question.includes("improv") ||
        question.includes("better") ||
        question.includes("save more")
      ) {
        const totalExpenses =
          transactions
            ?.filter((t: any) => t.type === "expense")
            .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0) || 0;
        
        const categoryBreakdown = transactions
          ?.filter((t: any) => t.type === "expense")
          .reduce((acc: any, t: any) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
            return acc;
          }, {}) || {};
        
        const topCategory = Object.entries(categoryBreakdown)
          .sort(([, a]: any, [, b]: any) => (b as number) - (a as number))[0];
        
        if (topCategory) {
          fallbackResponse = `To improve your finances: Your highest spending is in ${topCategory[0]} ($${(topCategory[1] as number).toFixed(2)}). Consider: 1) Set a budget for this category, 2) Track each ${topCategory[0]} expense for a week, 3) Look for cheaper alternatives, 4) Reduce frequency by 20%. This could save you $${((topCategory[1] as number) * 0.2).toFixed(2)}/month!`;
        } else {
          fallbackResponse = "To improve your finances: 1) Track all expenses daily, 2) Create category budgets, 3) Aim for 20% savings rate, 4) Review spending weekly, 5) Automate savings transfers.";
        }
      }
      // Check for spending queries
      else if (
        question.includes("expend") ||
        question.includes("spending") ||
        question.includes("spend")
      ) {
        const totalExpenses =
          transactions
            ?.filter((t: any) => t.type === "expense")
            .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0) || 0;

        fallbackResponse = `Based on your data, your total expenses are $${totalExpenses.toFixed(
          2
        )}. To improve your spending, focus on tracking your largest expense categories and look for areas where you can cut back without impacting your quality of life.`;
      } 
      // Check for savings queries
      else if (question.includes("save") || question.includes("saving")) {
        const income =
          transactions
            ?.filter((t: any) => t.type === "income")
            .reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
        const expenses =
          transactions
            ?.filter((t: any) => t.type === "expense")
            .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0) || 0;
        const savings = income - expenses;

        fallbackResponse = `You're currently saving $${savings.toFixed(
          2
        )} per period. Try to aim for saving 20-30% of your income. Consider automating your savings and reducing discretionary expenses.`;
      }
      // Check for working/status queries
      else if (question.includes("working") || question.includes("are you")) {
        fallbackResponse = `Yes, I'm working! I'm your AI financial assistant analyzing your ${transactions?.length || 0} transaction${transactions?.length === 1 ? '' : 's'}. I can help you understand your spending, find savings opportunities, and answer specific questions about your finances. Try asking: "What was my last transaction?" or "How can I improve my spending?"`;
      }
      // Generic helpful response
      else {
        const txCount = transactions?.length || 0;
        const totalIncome = transactions?.filter((t: any) => t.type === "income").reduce((sum: number, t: any) => sum + t.amount, 0) || 0;
        const totalExpenses = transactions?.filter((t: any) => t.type === "expense").reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0) || 0;
        
        fallbackResponse = `I have ${txCount} transaction${txCount === 1 ? '' : 's'} to analyze. Your totals: Income $${totalIncome.toFixed(2)}, Expenses $${totalExpenses.toFixed(2)}. I can help you with: 📊 Spending analysis, 💰 Savings tips, 📈 Budget recommendations, or ❓ Answer specific questions about your transactions. What would you like to know?`;
      }

      return NextResponse.json({
        response: fallbackResponse,
        success: true,
        fallback: true,
      });
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
