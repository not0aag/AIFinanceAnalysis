// Test script to verify AI analytics functionality
// Run this file with: npx tsx test-ai-analytics.ts

import {
  generateAdvancedInsights,
  detectSpendingAnomalies,
  generateSavingsStrategy,
} from "./src/lib/openai";
import { Transaction } from "./src/types/finance";

async function testAIAnalytics() {
  console.log("🧪 Testing AI Analytics Functionality...\n");

  const monthlyIncome = 3500;
  const financialGoals = [
    "Build emergency fund",
    "Save for vacation",
    "Pay off credit card debt"
  ];

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
    const insights = await generateAdvancedInsights(testTransactions);
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
    "Save for emergency fund",
    "Reduce dining expenses",
    "Build investment portfolio",
  ];

  try {
    console.log("📊 Testing Advanced Insights Generation...");
    const insights = await generateAdvancedInsights(
      sampleTransactions,
      monthlyIncome,
      financialGoals
    );
    console.log("✅ Advanced Insights:", insights);
    console.log("");

    console.log("🔍 Testing Anomaly Detection...");
    const anomalies = await detectSpendingAnomalies(sampleTransactions);
    console.log("✅ Detected Anomalies:", anomalies);
    console.log("");

    console.log("💰 Testing Savings Strategy Generation...");
    const savingsStrategy = await generateSavingsStrategy(
      sampleTransactions,
      monthlyIncome,
      financialGoals
    );
    console.log("✅ Savings Strategy:", savingsStrategy);
    console.log("");

    console.log("🎉 All AI Analytics tests completed successfully!");
  } catch (error) {
    console.error("❌ Error during testing:", error);

    // Test fallback functions
    console.log("\n🔄 Testing fallback functions...");

    const fallbackInsights = await generateAdvancedInsights(
      [],
      monthlyIncome,
      financialGoals
    );
    console.log("✅ Fallback Insights:", fallbackInsights);

    const fallbackAnomalies = await detectSpendingAnomalies([]);
    console.log("✅ Fallback Anomalies:", fallbackAnomalies);

    const fallbackStrategy = await generateSavingsStrategy(
      [],
      monthlyIncome,
      financialGoals
    );
    console.log("✅ Fallback Strategy:", fallbackStrategy);
  }
}

testAIAnalytics().catch(console.error);
