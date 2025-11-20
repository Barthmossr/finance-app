'use client'

import { motion } from 'framer-motion'
import { BarChart3Icon, PlusCircleIcon, TrendingUpIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button className="w-full justify-start" variant="outline">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <TrendingUpIcon className="mr-2 h-4 w-4" />
            Add Income
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <BarChart3Icon className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { QuickActions }
