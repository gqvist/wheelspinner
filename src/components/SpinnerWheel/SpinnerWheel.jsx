import { PointerIcon } from '../../assets/icons.jsx'
import ResultCard from '../ResultCard/ResultCard.jsx'
import './SpinnerWheel.css'

const createPreview = (text) => {
  const cleaned = text.trim()
  return cleaned.length > 26 ? `${cleaned.slice(0, 26).trim()}...` : cleaned
}

function SpinnerWheel({
  entries,
  isSpinning,
  onSpin,
  onCloseSelected,
  rotation,
  selectedEntry,
  segmentAngle,
  wheelStyle,
}) {
  return (
    <div className="spinner-wheel">
      <div className="spinner-wheel__wheel-wrap">
        <div className="spinner-wheel__pointer" aria-hidden="true">
          <PointerIcon className="spinner-wheel__pointer-icon" />
        </div>

        <button
          type="button"
          className="spinner-wheel__button"
          onClick={onSpin}
          disabled={isSpinning || entries.length === 0}
          aria-label={
            entries.length > 0
              ? 'Snurra hjulet för att välja en text'
              : 'Alla texter är redan valda'
          }
        >
          <div
            className={`spinner-wheel__disc ${isSpinning ? 'spinner-wheel__disc--spinning' : ''}`}
            style={{
              ...wheelStyle,
              transform: `rotate(${rotation}deg)`,
            }}
        >
          <div className="spinner-wheel__center">Tryck</div>
          {entries.map((entry, index) => {
            const angle = index * segmentAngle + segmentAngle / 2
            // Match the label band to the slice width at the label radius.
            const labelRadius = 0.33
            const segmentBand = Math.max(
              6,
              Math.min(
                14,
                2 * labelRadius * Math.sin((segmentAngle * Math.PI) / 360) * 100,
              ),
            )

            return (
              <div
                key={entry.id}
                className="spinner-wheel__segment"
                style={{
                  '--segment-band': `${segmentBand}%`,
                  // CSS rotation starts at the right, while the wheel slices start at the top.
                  transform: `rotate(${angle - 90}deg)`,
                }}
              >
                <span className="spinner-wheel__segment-text">
                  {createPreview(entry.text)}
                </span>
              </div>
              )
            })}
          </div>
        </button>
      </div>

      {/* Result overlays the wheel so layout stays fixed while spinning ends. */}
      <div
        className={`spinner-wheel__result ${selectedEntry ? 'spinner-wheel__result--visible' : ''}`}
      >
        <ResultCard entry={selectedEntry} onClose={onCloseSelected} />
      </div>
    </div>
  )
}

export default SpinnerWheel
