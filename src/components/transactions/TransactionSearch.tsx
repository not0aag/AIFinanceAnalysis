'use client'

interface TransactionSearchProps {
  value: string
  onChange: (value: string) => void
  resultCount: number
}

export default function TransactionSearch({ value, onChange, resultCount }: TransactionSearchProps) {
  return (
    <input
      type="text"
      placeholder="Search transactions..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input"
    />
  )
}