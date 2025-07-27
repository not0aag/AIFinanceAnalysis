import { Transaction } from "@/types/finance";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTransaction(
  transaction: Partial<Transaction>
): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!transaction.name || transaction.name.trim().length === 0) {
    errors.push("Transaction name is required");
  }

  if (transaction.amount === undefined || transaction.amount === null) {
    errors.push("Amount is required");
  } else if (transaction.amount === 0) {
    errors.push("Amount cannot be zero");
  } else if (Math.abs(transaction.amount) > 1000000) {
    errors.push("Amount seems unusually high. Please verify.");
  }

  if (!transaction.category) {
    errors.push("Category is required");
  }

  if (!transaction.date) {
    errors.push("Date is required");
  } else {
    const date = new Date(transaction.date);
    if (isNaN(date.getTime())) {
      errors.push("Invalid date format");
    } else if (date > new Date()) {
      errors.push("Transaction date cannot be in the future");
    }
  }

  // Optional field validation
  if (transaction.notes && transaction.notes.length > 500) {
    errors.push("Notes cannot exceed 500 characters");
  }

  if (transaction.tags && transaction.tags.length > 10) {
    errors.push("Cannot have more than 10 tags");
  }

  if (transaction.merchant && transaction.merchant.length > 100) {
    errors.push("Merchant name too long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateBudget(budget: any): ValidationResult {
  const errors: string[] = [];

  if (!budget.category) {
    errors.push("Budget category is required");
  }

  if (budget.allocated === undefined || budget.allocated <= 0) {
    errors.push("Budget amount must be greater than 0");
  }

  if (budget.allocated > 100000) {
    errors.push("Budget amount seems unusually high");
  }

  if (!budget.period) {
    errors.push("Budget period is required");
  }

  if (budget.notifications?.threshold !== undefined) {
    if (
      budget.notifications.threshold < 0 ||
      budget.notifications.threshold > 100
    ) {
      errors.push("Notification threshold must be between 0 and 100");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateGoal(goal: any): ValidationResult {
  const errors: string[] = [];

  if (!goal.name || goal.name.trim().length === 0) {
    errors.push("Goal name is required");
  }

  if (goal.targetAmount === undefined || goal.targetAmount <= 0) {
    errors.push("Target amount must be greater than 0");
  }

  if (goal.currentAmount < 0) {
    errors.push("Current amount cannot be negative");
  }

  if (goal.currentAmount > goal.targetAmount) {
    errors.push("Current amount cannot exceed target amount");
  }

  if (!goal.deadline) {
    errors.push("Goal deadline is required");
  } else {
    const deadline = new Date(goal.deadline);
    if (deadline <= new Date()) {
      errors.push("Deadline must be in the future");
    }
  }

  if (!goal.category) {
    errors.push("Goal category is required");
  }

  if (!goal.priority) {
    errors.push("Goal priority is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  // Remove any potentially harmful characters
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/[^\w\s\-.,!?$€£¥₹@#%&()\[\]{}:;'"]/gi, "") // Keep only safe characters
    .slice(0, 1000); // Limit length
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
