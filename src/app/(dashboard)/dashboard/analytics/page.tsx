'use client'

import { useState } from 'react'

export default function AnalyticsPage() {
  // Sample data for the chart
  const spendingData = [
    { category: 'Bills', amount: 1200, percentage: 38, color: '#ef4444' },
    { category: 'Food', amount: 650, percentage: 21, color: '#f59e0b' },
    { category: 'Transportation', amount: 480, percentage: 15, color: '#3b82f6' },
    { category: 'Entertainment', amount: 320, percentage: 10, color: '#10b981' },
    { category: 'Shopping', amount: 280, percentage: 9, color: '#8b5cf6' },
    { category: 'Other', amount: 220, percentage: 7, color: '#6b7280' }
  ]

  const total = spendingData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1>Analytics</h1>
        <p style={{ color: '#94a3b8' }}>Analyze your spending patterns and financial trends</p>
      </div>
      
      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Average Monthly Spending</div>
          <div className="stat-value">${total.toLocaleString()}</div>
          <div className="stat-change positive">↓ 5% from last month</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Top Category</div>
          <div className="stat-value">Bills</div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            38% of total spending
          </p>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value">24%</div>
          <div className="stat-change positive">↑ 2% from last month</div>
        </div>
      </div>
      
      {/* Working Chart */}
      <div className="stat-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Spending by Category</h3>
        
        {/* Chart Container */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Pie Chart (CSS-based) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              background: `conic-gradient(
                ${spendingData[0].color} 0deg ${spendingData[0].percentage * 3.6}deg,
                ${spendingData[1].color} ${spendingData[0].percentage * 3.6}deg ${(spendingData[0].percentage + spendingData[1].percentage) * 3.6}deg,
                ${spendingData[2].color} ${(spendingData[0].percentage + spendingData[1].percentage) * 3.6}deg ${(spendingData[0].percentage + spendingData[1].percentage + spendingData[2].percentage) * 3.6}deg,
                ${spendingData[3].color} ${(spendingData[0].percentage + spendingData[1].percentage + spendingData[2].percentage) * 3.6}deg ${(spendingData[0].percentage + spendingData[1].percentage + spendingData[2].percentage + spendingData[3].percentage) * 3.6}deg,
                ${spendingData[4].color} ${(spendingData[0].percentage + spendingData[1].percentage + spendingData[2].percentage + spendingData[3].percentage) * 3.6}deg ${(spendingData[0].percentage + spendingData[1].percentage + spendingData[2].percentage + spendingData[3].percentage + spendingData[4].percentage) * 3.6}deg,
                ${spendingData[5].color} ${(spendingData[0].percentage + spendingData[1].percentage + spendingData[2].percentage + spendingData[3].percentage + spendingData[4].percentage) * 3.6}deg 360deg
              )`,
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              {/* Center circle */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                backgroundColor: '#1e293b',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #334155'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                  ${total.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Total Spent
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {spendingData.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: '#374151',
                borderRadius: '0.5rem',
                border: '1px solid #4b5563'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: item.color,
                    borderRadius: '2px'
                  }} />
                  <span style={{ color: 'white', fontWeight: '500' }}>{item.category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'white', fontWeight: '600' }}>
                    ${item.amount.toLocaleString()}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bar Chart */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #374151' }}>
          <h4 style={{ marginBottom: '1rem' }}>Monthly Spending Trend</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', alignItems: 'end', height: '200px' }}>
            {[
              { month: 'Jan', amount: 2800 },
              { month: 'Feb', amount: 3200 },
              { month: 'Mar', amount: 2900 },
              { month: 'Apr', amount: 3400 },
              { month: 'May', amount: 3100 },
              { month: 'Jun', amount: 3150 }
            ].map((data, index) => {
              const maxAmount = 3400
              const height = (data.amount / maxAmount) * 160
              
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    ${(data.amount / 1000).toFixed(1)}k
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${height}px`,
                    backgroundColor: '#3b82f6',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6'
                  }}
                  />
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    {data.month}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}