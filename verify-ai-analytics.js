#!/usr/bin/env node

// Quick verification script for AI Analytics
const fs = require("fs");
const path = require("path");

console.log("🔍 Verifying AI Analytics Implementation...\n");

// Check if required files exist
const requiredFiles = [
  "src/lib/openai.ts",
  "src/app/api/ai/financial-analysis/route.ts",
  "src/components/AIFinancialAnalyst.tsx",
  "src/lib/sample-data.ts",
  ".env.local",
];

let allFilesExist = true;

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

console.log(
  "\n📁 File Structure Check:",
  allFilesExist ? "✅ PASSED" : "❌ FAILED"
);

// Check for TypeScript syntax issues
console.log("\n🔧 TypeScript Syntax Check...");
try {
  const openaiContent = fs.readFileSync("src/lib/openai.ts", "utf8");

  // Basic syntax checks
  const hasExportedFunctions =
    openaiContent.includes("export async function generateAdvancedInsights") &&
    openaiContent.includes("export async function detectSpendingAnomalies") &&
    openaiContent.includes("export async function generateSavingsStrategy");

  if (hasExportedFunctions) {
    console.log("✅ All required AI functions exported");
  } else {
    console.log("❌ Missing required AI functions");
  }

  // Check for unclosed braces (basic check)
  const openBraces = (openaiContent.match(/{/g) || []).length;
  const closeBraces = (openaiContent.match(/}/g) || []).length;

  if (openBraces === closeBraces) {
    console.log("✅ Balanced braces in openai.ts");
  } else {
    console.log(
      `❌ Unbalanced braces: ${openBraces} open, ${closeBraces} close`
    );
  }
} catch (error) {
  console.log("❌ Error reading openai.ts:", error.message);
}

// Check environment configuration
console.log("\n🔑 Environment Configuration...");
try {
  const envContent = fs.readFileSync(".env.local", "utf8");
  if (envContent.includes("OPENAI_API_KEY=")) {
    console.log("✅ OpenAI API key configured");
  } else {
    console.log("⚠️  OpenAI API key not found - AI features may use fallbacks");
  }
} catch (error) {
  console.log("⚠️  .env.local not found - create one with OPENAI_API_KEY");
}

console.log("\n🎉 AI Analytics Verification Complete!");
console.log("\n📋 Next Steps:");
console.log("   1. Run: npm run dev");
console.log("   2. Open: http://localhost:3000/dashboard/insights");
console.log("   3. Test AI insights functionality");
console.log(
  "\n💡 If you see any issues, check the browser console for detailed error messages."
);
