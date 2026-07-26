import { motion, useReducedMotion } from 'framer-motion'

/**
 * Ambient, low-opacity moving color blobs behind page content — our warm
 * (burgundy/gold/blush) take on the aurora-background pattern. Uses theme
 * tokens only, so it can never drift into off-brand purple/blue.
 */
export function AuroraBackground() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute bottom-[-30%] left-1/2 size-[70vw] -translate-x-1/2 rounded-full bg-deep/[0.07] blur-3xl"
        animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -top-1/3 left-[-15%] size-[55vw] rounded-full bg-primary/[0.14] blur-3xl"
        animate={shouldReduceMotion ? undefined : { x: [0, 40, -20, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/4 right-[-20%] size-[50vw] rounded-full bg-accent/[0.18] blur-3xl"
        animate={shouldReduceMotion ? undefined : { x: [0, -30, 20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-25%] left-1/4 size-[45vw] rounded-full bg-secondary/[0.22] blur-3xl"
        animate={shouldReduceMotion ? undefined : { x: [0, 25, -15, 0], y: [0, -15, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
