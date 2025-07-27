console.log("🔧 Testing AI Analytics Functions...\n");

// Test with sample data
const sampleTransactions = [
  {
    id: "1",
    date: "2024-01-15",
    amount: -125.5,
    description: "Whole Foods Market",
    category: "groceries",
    type: "expense",
    merchant: "Whole Foods",
    account: "Chase Checking",
  },
  {
    id: "2",
    date: "2024-01-14",
    amount: 3500.0,
    description: "Salary Deposit",
    category: "income",
    type: "income",
    merchant: "Employer",
    account: "Chase Checking",
  },
];

const profile = {
  monthlyIncome: 3500,
  savingsGoal: 1000,
  riskTolerance: "moderate",
};

// Import the functions
import("./src/lib/openai.js")
  .then(async (module) => {
    try {
      console.log("✅ Successfully imported AI functions");

      // Test generateAdvancedInsights
      console.log("🧠 Testing generateAdvancedInsights...");
      const insights = await module.generateAdvancedInsights(
        sampleTransactions,
        profile
      );
      console.log(
        "✅ Insights generated:",
        insights.insights.length,
        "insights"
      );
      console.log("   Financial Health Score:", insights.financialHealthScore);

      // Test generateSavingsStrategy
      console.log("💰 Testing generateSavingsStrategy...");
      const strategies = await module.generateSavingsStrategy(
        sampleTransactions,
        3500,
        ["Emergency fund"]
      );
      console.log(
        "✅ Strategies generated:",
        strategies.strategies.length,
        "strategies"
      );

      // Test detectSpendingAnomalies
      console.log("🔍 Testing detectSpendingAnomalies...");
      const anomalies = await module.detectSpendingAnomalies(
        sampleTransactions
      );
      console.log(
        "✅ Anomalies detected:",
        anomalies.anomalies.length,
        "anomalies"
      );
      console.log("   Risk Level:", anomalies.riskLevel);

      console.log("\n🎉 All AI functions are working correctly!");
      console.log("\n📋 Next Steps:");
      console.log("   1. Start the dev server: npm run dev");
      console.log(
        "   2. Navigate to: http://localhost:3000/dashboard/insights"
      );
      console.log("   3. The AI insights should now work without errors!");
    } catch (error) {
      console.error("❌ Error testing functions:", error);
    }
  })
  .catch((error) => {
    console.error("❌ Failed to import functions:", error);
  });
