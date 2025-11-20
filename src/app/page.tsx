'use client'

import { motion } from 'framer-motion'
import {
  DollarSignIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletIcon,
} from 'lucide-react'

import { useAuth } from '@/components/auth-provider'
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown'
import { ExpenseChart } from '@/components/dashboard/expense-chart'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentTransactions } from '@/components/dashboard/recent-transactions'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserNav } from '@/components/user-nav'

// Mock data - will be replaced with real data from backend
const mockChartData = [
  { month: 'Jan', expenses: 2400, income: 4000 },
  { month: 'Feb', expenses: 1398, income: 3000 },
  { month: 'Mar', expenses: 9800, income: 12000 },
  { month: 'Apr', expenses: 3908, income: 5000 },
  { month: 'May', expenses: 4800, income: 6000 },
  { month: 'Jun', expenses: 3800, income: 5500 },
]

const mockTransactions = [
  {
    id: '1',
    description: 'Grocery Shopping',
    amount: -125.5,
    category: 'Food',
    date: 'Nov 19, 2024',
    type: 'expense' as const,
  },
  {
    id: '2',
    description: 'Salary',
    amount: 5000,
    category: 'Income',
    date: 'Nov 18, 2024',
    type: 'income' as const,
  },
  {
    id: '3',
    description: 'Electricity Bill',
    amount: -80,
    category: 'Utilities',
    date: 'Nov 17, 2024',
    type: 'expense' as const,
  },
  {
    id: '4',
    description: 'Freelance Project',
    amount: 1200,
    category: 'Income',
    date: 'Nov 16, 2024',
    type: 'income' as const,
  },
  {
    id: '5',
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    date: 'Nov 15, 2024',
    type: 'expense' as const,
  },
]

const mockCategoryData = [
  { name: 'Food', value: 1250, color: '#3b82f6' },
  { name: 'Transport', value: 450, color: '#10b981' },
  { name: 'Utilities', value: 380, color: '#f59e0b' },
  { name: 'Entertainment', value: 220, color: '#ef4444' },
  { name: 'Shopping', value: 890, color: '#8b5cf6' },
  { name: 'Health', value: 150, color: '#ec4899' },
]

function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Finance Dashboard
          </motion.h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {user && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                Welcome back, {user.user_metadata.name || user.email}!
              </h2>
              <p className="text-sm text-muted-foreground">
                Here&apos;s your financial overview
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Balance"
              value="$12,450.00"
              icon={WalletIcon}
              trend={{ value: 12.5, isPositive: true }}
              delay={0}
            />
            <StatsCard
              title="Total Income"
              value="$6,200.00"
              icon={TrendingUpIcon}
              trend={{ value: 8.2, isPositive: true }}
              delay={0.1}
            />
            <StatsCard
              title="Total Expenses"
              value="$3,340.00"
              icon={TrendingDownIcon}
              trend={{ value: 4.1, isPositive: false }}
              delay={0.2}
            />
            <StatsCard
              title="Savings"
              value="$2,860.00"
              icon={DollarSignIcon}
              trend={{ value: 15.3, isPositive: true }}
              delay={0.3}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ExpenseChart data={mockChartData} />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <RecentTransactions transactions={mockTransactions} />
            <CategoryBreakdown data={mockCategoryData} />
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export { Dashboard as default }
