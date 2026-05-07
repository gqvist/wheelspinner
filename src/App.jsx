import { useEffect, useMemo, useRef, useState } from 'react'
import PageHeader from './components/PageHeader/PageHeader.jsx'
import SpinnerWheel from './components/SpinnerWheel/SpinnerWheel.jsx'
import StatusRow from './components/StatusRow/StatusRow.jsx'
import phrasesData from './data/phrases.json'

const SPIN_DURATION_MS = 5000
const EXTRA_SPINS = 6

const INITIAL_ENTRIES = phrasesData.map((text, index) => ({
  id: `${index + 1}`,
  text,
}))

const SEGMENT_COLORS = [
  'var(--color-segment-1)',
  'var(--color-segment-2)',
  'var(--color-segment-3)',
  'var(--color-segment-4)',
  'var(--color-segment-5)',
]

const normalizeRotation = (value) => {
  const remainder = value % 360
  return remainder < 0 ? remainder + 360 : remainder
}

function App() {
  const timeoutRef = useRef(null)
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const [visibleEntries, setVisibleEntries] = useState(INITIAL_ENTRIES)
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const segmentAngle = useMemo(
    () => (visibleEntries.length > 0 ? 360 / visibleEntries.length : 360),
    [visibleEntries.length],
  )

  const wheelStyle = useMemo(() => {
    if (!visibleEntries.length) {
      return {
        background:
          'radial-gradient(circle at center, var(--color-panel-bottom) 0 34%, var(--color-wheel-center-bottom) 35% 68%, var(--color-wheel-center-text) 69% 100%)',
      }
    }

    // Keep the wheel slices stable until the result card is dismissed.
    const segments = visibleEntries
      .map((_, index) => {
        const start = index * segmentAngle
        const end = start + segmentAngle
        const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length]
        return `${color} ${start}deg ${end}deg`
      })
      .join(', ')

    return {
      background: `conic-gradient(${segments})`,
    }
  }, [visibleEntries, segmentAngle])

  const handleSpin = () => {
    if (isSpinning || entries.length === 0) {
      return
    }

    const winnerIndex = Math.floor(Math.random() * entries.length)
    const winner = entries[winnerIndex]
    const centerAngle = winnerIndex * segmentAngle + segmentAngle / 2
    const currentRotation = normalizeRotation(rotation)
    const targetDelta = normalizeRotation(360 - centerAngle - currentRotation)
    const finalRotation = rotation + EXTRA_SPINS * 360 + targetDelta

    setIsSpinning(true)
    setSelectedEntry(null)
    setRotation(finalRotation)

    timeoutRef.current = setTimeout(() => {
      const remainingEntries = entries.filter((entry) => entry.id !== winner.id)

      setEntries(remainingEntries)
      setSelectedEntry(winner)
      setIsSpinning(false)
      timeoutRef.current = null
    }, SPIN_DURATION_MS)
  }

  const handleCloseSelected = () => {
    setSelectedEntry(null)
    setVisibleEntries(entries)
  }

  return (
    <main className="app-shell">
      <section className="app-panel">
        <PageHeader title="För att få en öl:" />

        <SpinnerWheel
          entries={visibleEntries}
          isSpinning={isSpinning}
          onSpin={handleSpin}
          onCloseSelected={handleCloseSelected}
          rotation={rotation}
          selectedEntry={selectedEntry}
          segmentAngle={segmentAngle}
          wheelStyle={wheelStyle}
        />

        <StatusRow remaining={entries.length} isSpinning={isSpinning} />
      </section>
    </main>
  )
}

export default App
