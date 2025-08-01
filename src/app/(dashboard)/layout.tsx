import DashboardLayoutClient from './layout-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Finance AI',
  description: 'AI-powered personal finance dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}