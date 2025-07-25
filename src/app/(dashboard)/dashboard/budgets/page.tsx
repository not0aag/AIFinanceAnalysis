export default function BudgetsPage() {
  const budgets = [
    { category: 'Food', allocated: 800, spent: 650 },
    { category: 'Transportation', allocated: 300, spent: 280 },
    { category: 'Entertainment', allocated: 400, spent: 320 },
    { category: 'Shopping', allocated: 500, spent: 750 },
  ]

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Budgets</h1>
        <p style={{ color: '#94a3b8' }}>Set and track your spending limits</p>
      </div>
      
      {/* Budget Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Budgeted</div>
          <div className="stat-value">$2,000</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value">$1,700</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Remaining</div>
          <div className="stat-value">$300</div>
        </div>
      </div>
      
      {/* Budget List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {budgets.map((budget, index) => {
          const percentage = (budget.spent / budget.allocated) * 100
          const isOverBudget = percentage > 100
          
          return (
            <div key={index} className="stat-card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{budget.category}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Monthly Budget</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600' }}>
                    ${budget.spent} / ${budget.allocated}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: isOverBudget ? '#ef4444' : '#94a3b8'
                  }}>
                    {percentage.toFixed(0)}% used
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#374151',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(percentage, 100)}%`,
                  height: '100%',
                  backgroundColor: isOverBudget ? '#ef4444' : '#10b981',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              
              {isOverBudget && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  ⚠️ Over budget by ${(budget.spent - budget.allocated).toFixed(2)}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}