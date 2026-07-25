import { motion, useReducedMotion } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  delayStart?: number
  /** Delay added per word, in seconds. */
  wordDelay?: number
  /** Duration of each word's own fade/rise, in seconds. */
  wordDuration?: number
}

/** Returns how long the full reveal takes to finish, in seconds — use this to sequence what comes after. */
export function getTextRevealDuration(
  text: string,
  { delayStart = 0, wordDelay = 0.09, wordDuration = 0.6 }: Omit<TextRevealProps, 'text' | 'className'> = {},
): number {
  const wordCount = text.split(' ').length
  return delayStart + Math.max(wordCount - 1, 0) * wordDelay + wordDuration
}

/** Word-by-word blur+rise entrance for a heading, once on mount. */
export function TextReveal({
  text,
  className,
  delayStart = 0,
  wordDelay = 0.09,
  wordDuration = 0.6,
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const words = text.split(' ')

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {words.map((word, index) => (
        // The space is a sibling text node, not nested inside the inline-block —
        // a trailing space *inside* an inline-block gets collapsed by the browser,
        // which was silently swallowing every space between words.
        <span key={`${word}-${index}`}>
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: wordDuration,
              delay: delayStart + index * wordDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
