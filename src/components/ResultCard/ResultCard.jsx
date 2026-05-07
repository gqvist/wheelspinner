import './ResultCard.css'

function ResultCard({ entry, onClose }) {
  if (!entry) {
    return null
  }

  return (
    <button
      type="button"
      className="result-card"
      onClick={onClose}
      aria-label="Stäng vald text"
    >
      <p className="result-card__text">{entry.text}</p>
    </button>
  )
}

export default ResultCard
