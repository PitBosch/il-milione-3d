import { useEffect, useRef } from 'react'
import { useTravel } from '../store.js'

export default function Timeline({ chapters, selectedId, stops, onSelect }) {
  const { progress } = useTravel()
  const list = useRef()
  useEffect(() => {
    const el = list.current?.querySelector('.is-selected')
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [selectedId])
  const uById = Object.fromEntries((stops || []).map((s) => [s.id, s.u]))
  return (
    <nav className="timeline" aria-label="Tappe del viaggio">
      <ol ref={list}>
        {chapters.map((c, i) => {
          const visited = uById[c.id] !== undefined && uById[c.id] <= progress + 1e-4
          return (
            <li key={c.id}>
              <button
                className={[
                  'tl-item',
                  selectedId === c.id && 'is-selected',
                  visited && 'is-visited',
                  `kind-${c.kind}`,
                  `place-${c.placement}`,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelect(c.id)}
              >
                <span className="tl-item__num">{i + 1}</span>
                <span className="tl-item__name">{c.title}</span>
                <span className="tl-item__year">{c.yearLabel}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
