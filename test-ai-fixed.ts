// Test script to verify AI analytics functionality
// Run this file with: npx tsx test-ai-analytics.ts

import {
  generateAdvancedInsights,
  detectSpendingAnomalies,
  generateSavingsStrategy,
} from "./src/lib/openai";
import { Transaction, FinancialProfile } from "./src/types/finance";

async function testAIAnalytics() {
  console.log("🧪 Testing AI Analytics Functionality...\n");

  const monthlyIncome = 3500;
  const financialGoals = [
    "Build emergency fund",
    "Save for vacation",
    "Pay off credit card debt"
  ];

  // Create a test profile
  const testProfile: FinancialProfile = {
    userId: "user-1",
    monthlyIncome: 3500,
    monthlyExpenses: 2800,
    savingsGoal: 1000,
    riskTolerance: "moderate",
    financialGoals: [],
    preferences: {
      currency: 'USD',
      timezone: 'America/New_York',
      fiscalYearStart: 1,
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  };

  // Create proper Transaction objects
  const testTransactions: Transaction[] = [
    {
      id: "1",
      userId: "user-1",
      name: "Grocery Shopping",
      amount: -125.50,
      category: "groceries",
      date: "2024-01-15",
      type: "expense",
      merchant: "Whole Foods",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isVerified: true
    },
    {
      id: "2",
      userId: "user-1",
      name: "Gas Station",
      amount: -45.00,
      category: "transportation",
      date: "2024-01-14",
      type: "expense",
      merchant: "Shell",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isVerified: true
    },
    {
      id: "3",
      userId: "user-1",
      name: "Salary",
      amount: 3500.00,
      category: "salary",
      date: "2024-01-01",
      type: "income",
      merchant: "Company Inc",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isVerified: true
    }
  ];

  try {
    console.log("📊 Testing Advanced Insights Generation...");
    const insights = await generateAdvancedInsights(testTransactions, testProfile);
    console.log("✅ Advanced Insights:", insights);
    console.log("");

    console.log("🔍 Testing Anomaly Detection...");
    const anomalies = await detectSpendingAnomalies(testTransactions);
    console.log("✅ Detected Anomalies:", anomalies);
    console.log("");

    console.log("💰 Testing Savings Strategy Generation...");
    const savingsStrategy = await generateSavingsStrategy(
      testTransactions,
      monthlyIncome,
      financialGoals
    );
    console.log("✅ Savings Strategy:", savingsStrategy);
    console.log("");

    console.log("🎉 All AI analytics tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during testing:", error);
  }
}

testAIAnalytics().catch(console.error);
