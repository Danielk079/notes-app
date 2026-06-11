import { useEffect } from 'react'
import confetti from 'canvas-confetti'

function Confetti({ trigger }) {
  useEffect(() => {
    if (!trigger) return

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#FFEAA7', '#DDA0DD', '#96CEB4'
      ],
    })
  }, [trigger])

  return null
}

export default Confetti