// Debug script to test if functions can be imported
const path = require("path");

async function testImports() {
  try {
    console.log("Current directory:", process.cwd());
    console.log("Testing import resolution...");

    // Test if the file exists
    const fs = require("fs");
    const openaiPath = path.join(process.cwd(), "src", "lib", "openai.ts");

    if (fs.existsSync(openaiPath)) {
      console.log("✅ openai.ts file exists at:", openaiPath);

      // Read the file content
      const content = fs.readFileSync(openaiPath, "utf8");
      console.log("File size:", content.length, "characters");

      // Check for function exports
      const functions = [
        "generateAdvancedInsights",
        "detectSpendingAnomalies",
        "generateSavingsStrategy",
      ];

      functions.forEach((func) => {
        if (content.includes(`export async function ${func}`)) {
          console.log(`✅ Found export: ${func}`);
        } else {
          console.log(`❌ Missing export: ${func}`);
        }
      });
    } else {
      console.log("❌ openai.ts file does not exist at:", openaiPath);
    }
  } catch (error) {
    console.error("Error during test:", error);
  }
}

testImports();
