'use client'

import { motion } from 'framer-motion'

function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
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
    </div>
  )
}

export default Dashboard
