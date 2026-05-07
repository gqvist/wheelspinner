import './StatusRow.css'

function StatusRow({ remaining }) {
  return (
    <footer className="status-row">
      <span>{remaining} kvar</span>
    </footer>
  )
}

export default StatusRow
