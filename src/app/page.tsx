'use client'

import { motion } from 'framer-motion'

import { ThemeToggle } from '@/components/theme-toggle'
import { UserNav } from '@/components/user-nav'

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center justify-between border-b px-6">
        <div className="text-xl font-bold">Finance App</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center p-24">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold"
        >
          Finance Dashboard
        </motion.h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Track your expenses with style.
        </p>
      </main>
    </div>
  )
}

export { Dashboard as default }
