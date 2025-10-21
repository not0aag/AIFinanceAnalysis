import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function categorizeTransaction(
  description: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a financial categorization assistant. Categorize transactions into one of these categories: Food & Dining, Shopping, Transportation, Entertainment, Bills & Utilities, Healthcare, Travel, Education, Income, Other. Respond with only the category name.",
        },
        {
          role: "user",
          content: `Categorize this transaction: "${description}"`,
        },
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    return response.choices[0]?.message?.content?.trim() || "Other";
  } catch (error) {
    console.error("Error categorizing transaction:", error);
    return "Other";
  }
}

export async function generateInsight(
  transactions: any[],
  userProfile: any
): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor AI. Analyze the user's transactions and provide personalized financial insights. Respond in JSON format with: { type: string, content: string, priority: 'high' | 'medium' | 'low' }",
        },
        {
          role: "user",
          content: `Analyze these transactions and profile:\n\nTransactions: ${JSON.stringify(
            transactions.slice(0, 50)
          )}\n\nProfile: ${JSON.stringify(userProfile)}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Error generating insight:", error);
    return null;
  }
}

export async function generateAdvancedInsights(
  transactions: any[],
  profile: any
): Promise<any[]> {
  try {
    const totalExpenses = transactions
      .filter((t) => t.amount < 0 || t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert financial analyst. Provide 3-5 specific, actionable financial insights based on actual transaction data. Focus on real patterns, not assumptions. Respond in JSON array format with: { type: 'warning' | 'opportunity' | 'achievement' | 'recommendation', title: string, description: string, impact: 'high' | 'medium' | 'low', actionItems: string[], potentialSavings: number, timeframe: string }",
        },
        {
          role: "user",
          content: `Analyze this financial data:\n\nRecent Transactions (${
            transactions.length
          } total):\n${JSON.stringify(
            transactions.slice(-10)
          )}\n\nFinancial Summary:\n- Monthly Income: $${
            profile.monthlyIncome
          }\n- Monthly Expenses: $${
            profile.monthlyExpenses
          }\n- Total Spent: $${totalExpenses}\n- Savings Rate: ${
            profile.monthlyIncome > 0
              ? (
                  ((profile.monthlyIncome - profile.monthlyExpenses) /
                    profile.monthlyIncome) *
                  100
                ).toFixed(1)
              : 0
          }%`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error("Error generating advanced insights:", error);
    return [];
  }
}

export async function detectSpendingAnomalies(
  transactions: any[]
): Promise<any[]> {
  try {
    // If less than 2 transactions, no anomalies to detect
    if (transactions.length < 2) {
      return [];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a financial anomaly detection system. Identify genuinely unusual spending patterns (not regular expenses). Only flag true anomalies like unusually large purchases, suspicious charges, or significant deviations from normal spending. Respond in JSON array format with: { transactionId: string, reason: string, severity: 'high' | 'medium' | 'low', recommendation: string }. If no real anomalies exist, return empty array [].",
        },
        {
          role: "user",
          content: `Analyze these transactions for TRUE anomalies only (ignore regular expenses):\n\n${JSON.stringify(
            transactions.slice(-50)
          )}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    // Handle case where AI returns a message instead of JSON
    if (content.trim().startsWith("[")) {
      const anomalies = JSON.parse(content);

      // Map transaction IDs to actual transaction objects
      return anomalies.map((anomaly: any) => {
        const transaction =
          transactions.find((t) => t.id === anomaly.transactionId) ||
          transactions[0];
        return {
          ...anomaly,
          transaction,
        };
      });
    }

    // No anomalies found
    return [];
  } catch (error) {
    console.error("Error detecting anomalies:", error);
    return [];
  }
}

export async function generateSavingsStrategy(
  monthlyIncome: number,
  monthlyExpenses: number,
  goals: any[]
): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a savings strategist. Create a personalized savings plan. Respond in JSON format with: { strategy: string, monthlySavings: number, timeline: string, tips: string[] }",
        },
        {
          role: "user",
          content: `Create a savings strategy:\n\nMonthly Income: $${monthlyIncome}\nMonthly Expenses: $${monthlyExpenses}\nGoals: ${JSON.stringify(
            goals
          )}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Error generating savings strategy:", error);
    return null;
  }
}
