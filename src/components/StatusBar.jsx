import { useTravel } from '../store.js'

export default function StatusBar() {
  const { year, mode, moving } = useTravel()
  return (
    <div className="status">
      <span className="status__year">Anno del Signore {year}</span>
      <span className="status__mode">
        {mode === 'sea' ? '⛵ per mare' : '🐫 per terra'}
        {moving ? ' · in viaggio' : ' · sosta'}
      </span>
    </div>
  )
}
