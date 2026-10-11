import { useEffect, useState } from 'react'
import { APPROFONDIMENTI } from '../data/approfondimenti.js'

export default function BookModal({ onClose }) {
  const [tab, setTab] = useState(APPROFONDIMENTI[0].id)
  const page = APPROFONDIMENTI.find((a) => a.id === tab)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Il libro" onClick={onClose}>
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>Il libro</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Chiudi">
            ✕
          </button>
        </header>
        <div className="modal__layout">
          <nav className="modal__tabs">
            {APPROFONDIMENTI.map((a) => (
              <button key={a.id} className={a.id === tab ? 'is-on' : ''} onClick={() => setTab(a.id)}>
                {a.title}
              </button>
            ))}
          </nav>
          <section className="modal__page">
            <h3>{page.title}</h3>
            {page.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <a className="source" href={page.source} target="_blank" rel="noreferrer">
              Sito originale ↗
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
