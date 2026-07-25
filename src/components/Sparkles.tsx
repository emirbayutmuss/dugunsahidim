import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface SparklesProps {
  count?: number
  className?: string
}

interface SparkleParticle {
  id: number
  top: string
  left: string
  size: number
  duration: number
  delay: number
}

function generateSparkles(count: number): SparkleParticle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 3,
    duration: 2 + Math.random() * 2.5,
    delay: Math.random() * 4,
  }))
}

/** Sparse, elegant gold twinkles — purely decorative, so it disappears entirely under reduced-motion. */
export function Sparkles({ count = 14, className }: SparklesProps) {
  const shouldReduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)')
    setIsMobile(mql.matches)
    const handleChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  const effectiveCount = isMobile ? Math.ceil(count / 2) : count
  const sparkles = useMemo(() => generateSparkles(effectiveCount), [effectiveCount])

  if (shouldReduceMotion) {
    return null
  }

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute rounded-full bg-accent"
          style={{ top: sparkle.top, left: sparkle.left, width: sparkle.size, height: sparkle.size }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1, 0.4] }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
