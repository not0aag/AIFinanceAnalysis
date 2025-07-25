'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  message?: string
}

export default function ErrorState({ message = 'Something went wrong' }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Error</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
