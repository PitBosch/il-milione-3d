import { useEffect, useRef } from 'react'

const PLACEMENT = {
  rotta: null,
  descritto: 'Luogo descritto nel libro, fuori dal percorso probabile',
  missione: 'Missione al servizio del Gran Cane',
}

export default function ChapterPanel({ chapter: c, index, total, onClose, onNext, onPrev, tour }) {
  const body = useRef()
  useEffect(() => {
    body.current?.scrollTo({ top: 0 })
  }, [c.id])

  return (
    <article className="panel" key={c.id} aria-live="polite">
      <header className="panel__head">
        <div className="panel__meta">
          <span className={`badge ${c.kind === 'capitolo' ? 'badge--site' : 'badge--res'}`}>
            {c.kind === 'capitolo' ? 'Capitolo del sito originale' : 'Tappa dalla ricerca storica'}
          </span>
          <span className="panel__count">
            {index + 1} / {total}
          </span>
          <button className="icon-btn" onClick={onClose} aria-label="Chiudi il capitolo">
            ✕
          </button>
        </div>
        <h2>{c.title}</h2>
        <p className="panel__sub">
          {c.modern} · <strong>{c.yearLabel}</strong>
        </p>
        {PLACEMENT[c.placement] && <p className={`panel__place place-${c.placement}`}>{PLACEMENT[c.placement]}</p>}
      </header>

      <div className="panel__body" ref={body}>
        <p className="epigraph">{c.epigraph}</p>
        <section className="narrative">
          {c.narrative.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <section className="from-book">
          <h3>Dal Milione</h3>
          <p className="from-book__ref">{c.chapter}</p>
          {c.fromBook.quote && (
            <blockquote>
              «{c.fromBook.quote.text}»
              <cite>{c.fromBook.quote.ref}</cite>
            </blockquote>
          )}
          <ul>
            {c.fromBook.summary.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
          {c.source ? (
            <a className="source" href={c.source} target="_blank" rel="noreferrer">
              Pagina originale su milionemarcopolo.altervista.org ↗
            </a>
          ) : (
            <p className="source source--none">Tappa assente dal sito originale: contenuto basato sul testo del Milione e sulla ricerca storica.</p>
          )}
        </section>

        <section className="history">
          <h3>Nella storia</h3>
          <ul>
            {c.history.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="panel__foot">
        <button onClick={onPrev} disabled={!onPrev}>
          ← Tappa precedente
        </button>
        {tour && <span className="tour-hint">viaggio guidato in corso</span>}
        <button onClick={onNext} disabled={!onNext} className="primary">
          Prossima tappa →
        </button>
      </footer>
    </article>
  )
}
