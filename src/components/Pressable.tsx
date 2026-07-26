import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PressableProps {
  children: ReactNode
  className?: string
}

const PRESS_SPRING = { type: 'spring', stiffness: 400, damping: 17 } as const

/** Spring-based hover/tap wrapper for any clickable child (Link, button, a). */
export function Pressable({ children, className }: PressableProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={cn('inline-block', className)}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={PRESS_SPRING}
    >
      {children}
    </motion.div>
  )
}
