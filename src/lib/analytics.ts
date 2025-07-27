import { Transaction, SpendingPattern } from "@/types/finance";
import {
  calculateSpendingPatterns as calculatePatterns,
  generateFinancialReport as generateReport,
  predictFutureSpending as predictSpending,
} from "./finance-utils";

// Re-export the functions from finance-utils
export const calculateSpendingPatterns = calculatePatterns;
export const generateFinancialReport = generateReport;
export const predictFutureSpending = predictSpending;
