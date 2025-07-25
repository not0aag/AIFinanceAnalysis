'use client'

import { useState } from 'react'

interface Transaction {
  id: number
  name: string
  amount: number
  category: string
  date: string
}

interface OnboardingProps {
  onTransactionsAdded: (transactions: Transaction[]) => void
}

export default function Onboarding({ onTransactionsAdded }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentTransaction, setCurrentTransaction] = useState({
    name: '',
    amount: '',
    category: 'expense',
    date: new Date().toISOString().split('T')[0]
  })

  // Declare addTransaction function BEFORE it's used
  const addTransaction = () => {
    if (!currentTransaction.name || !currentTransaction.amount) {
      alert('Please fill in all fields')
      return
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      name: currentTransaction.name,
      amount: parseFloat(currentTransaction.amount),
      category: currentTransaction.category,
      date: currentTransaction.date
    }

    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    
    // Reset form
    setCurrentTransaction({
      name: '',
      amount: '',
      category: 'expense',
      date: new Date().toISOString().split('T')[0]
    })

    // Move to next step if this is their first transaction
    if (transactions.length === 0) {
      setStep(2)
    }
  }

  const handleFinish = () => {
    if (transactions.length === 0) {
      alert('Please add at least one transaction to get started')
      return
    }
    onTransactionsAdded(transactions)
  }

  const addDemoData = () => {
    const demoTransactions: Transaction[] = [
      {
        id: 1,
        name: 'Salary',
        amount: 5000,
        category: 'income',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        name: 'Rent',
        amount: -1200,
        category: 'expense',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 3,
        name: 'Groceries',
        amount: -250,
        category: 'expense',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 4,
        name: 'Coffee Shop',
        amount: -45,
        category: 'expense',
        date: new Date().toISOString().split('T')[0]
      }
    ]
    
    setTransactions(demoTransactions)
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step >= stepNumber 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-0.5 transition-all duration-300 ${
                    step > stepNumber ? 'bg-blue-500' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-light text-white">
                Welcome to your
                <br />
                <span className="font-medium bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  Finance AI
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-md mx-auto leading-relaxed">
                Let's get started by adding your first transaction. This helps us understand your financial patterns.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-gray-800">
              <h2 className="text-2xl font-medium text-white mb-6">Add Your First Transaction</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Salary, Groceries, Coffee"
                    value={currentTransaction.name}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={currentTransaction.amount}
                      onChange={(e) => setCurrentTransaction({...currentTransaction, amount: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select
                      value={currentTransaction.category}
                      onChange={(e) => setCurrentTransaction({...currentTransaction, category: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={currentTransaction.date}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, date: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                onClick={addTransaction}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Add Transaction
              </button>

              <div className="text-center">
                <button
                  onClick={addDemoData}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Or try with demo data →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Add More */}
        {step === 2 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl font-light text-white">
                Great start!
              </h2>
              <p className="text-xl text-gray-400 max-w-md mx-auto">
                You've added {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}. Add a few more to get better AI insights.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-gray-800">
              <h3 className="text-xl font-medium text-white">Add Another Transaction</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Transaction description"
                  value={currentTransaction.name}
                  onChange={(e) => setCurrentTransaction({...currentTransaction, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={currentTransaction.amount}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, amount: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  />

                  <select
                    value={currentTransaction.category}
                    onChange={(e) => setCurrentTransaction({...currentTransaction, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addTransaction}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200"
                >
                  Add Another
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Current Transactions */}
            <div className="bg-gray-900/30 rounded-2xl p-6 space-y-3">
              <h4 className="text-lg font-medium text-white mb-4">Your Transactions</h4>
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2 px-4 bg-gray-800/30 rounded-xl">
                  <span className="text-white">{transaction.name}</span>
                  <span className={`font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Finish */}
        {step === 3 && (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-4xl font-light text-white">
                You're all set!
              </h2>
              <p className="text-xl text-gray-400 max-w-md mx-auto">
                Your Finance AI is ready to analyze your {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} and provide personalized insights.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 space-y-6 border border-gray-800">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {transactions.filter(t => t.amount > 0).length}
                  </div>
                  <div className="text-sm text-gray-400">Income Sources</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {transactions.filter(t => t.amount < 0).length}
                  </div>
                  <div className="text-sm text-gray-400">Expenses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    ${transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Net Balance</div>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Enter Your Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}