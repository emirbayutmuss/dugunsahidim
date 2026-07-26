import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
