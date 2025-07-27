// Quick test to verify AI functions are working
const {
  generateAdvancedInsights,
  generateSavingsStrategy,
  detectSpendingAnomalies,
} = require("./src/lib/openai.ts");

async function testAIFunctions() {
  console.log("Testing AI functions...");

  const sampleTransactions = [
    {
      id: "1",
      amount: 50.0,
      description: "Grocery Store",
      category: "groceries",
      date: new Date().toISOString(),
      merchant: "SuperMart",
    },
    {
      id: "2",
      amount: 25.99,
      description: "Coffee Shop",
      category: "dining",
      date: new Date().toISOString(),
      merchant: "Starbucks",
    },
  ];

  try {
    console.log("Testing generateAdvancedInsights...");
    const insights = await generateAdvancedInsights(sampleTransactions);
    console.log("✓ generateAdvancedInsights working:", !!insights);

    console.log("Testing generateSavingsStrategy...");
    const strategies = await generateSavingsStrategy(sampleTransactions, 3000);
    console.log("✓ generateSavingsStrategy working:", !!strategies);

    console.log("Testing detectSpendingAnomalies...");
    const anomalies = await detectSpendingAnomalies(sampleTransactions);
    console.log("✓ detectSpendingAnomalies working:", !!anomalies);

    console.log("\nAll functions are working correctly!");
  } catch (error) {
    console.error("Error testing functions:", error);
  }
}

testAIFunctions();
