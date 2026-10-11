import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CHAPTERS, CHAPTER_BY_ID } from './data/chapters.js'
import ChapterPanel from './components/ChapterPanel.jsx'
import Timeline from './components/Timeline.jsx'
import Intro from './components/Intro.jsx'
import BookModal from './components/BookModal.jsx'
import Compass from './components/Compass.jsx'
import StatusBar from './components/StatusBar.jsx'

const Scene = lazy(() => import('./three/Scene.jsx'))
const TOUR_PAUSE = 14000

export default function App() {
  const [world, setWorld] = useState(null)
  const [started, setStarted] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [targetU, setTargetU] = useState(0)
  const [focus, setFocus] = useState(null)
  const [focusKey, setFocusKey] = useState(0)
  const [follow, setFollow] = useState(false)
  const [tour, setTour] = useState(false)
  const [bookOpen, setBookOpen] = useState(false)
  const [showLabels, setShowLabels] = useState(true)
  const tourTimer = useRef(null)

  // la costruzione del terreno è pesante: la si avvia dopo il primo disegno della pagina
  useEffect(() => {
    let cancelled = false
    const id = setTimeout(async () => {
      const { buildWorld } = await import('./three/world.js')
      if (!cancelled) setWorld(buildWorld())
    }, 60)
    return () => {
      cancelled = true
      clearTimeout(id)
    }
  }, [])

  const stopById = useMemo(() => (world ? Object.fromEntries(world.stops.map((s) => [s.id, s])) : {}), [world])

  const select = useCallback(
    (id) => {
      const s = stopById[id]
      if (!s) return
      setSelectedId(id)
      setPanelOpen(true)
      setTargetU(s.u)
      setFocus(s.branch ? s.pos.clone().lerp(s.branch.line.points[0], 0.25) : s.pos.clone())
      setFocusKey((k) => k + 1)
    },
    [stopById]
  )

  const index = selectedId ? CHAPTERS.findIndex((c) => c.id === selectedId) : -1
  const goNext = useCallback(() => {
    const next = CHAPTERS[index + 1]
    if (next) select(next.id)
    else setTour(false)
  }, [index, select])
  const goPrev = useCallback(() => {
    const prev = CHAPTERS[index - 1]
    if (prev) select(prev.id)
  }, [index, select])

  const onArrive = useCallback(() => {
    clearTimeout(tourTimer.current)
    if (tour) tourTimer.current = setTimeout(goNext, TOUR_PAUSE)
  }, [tour, goNext])

  useEffect(() => {
    if (!tour) clearTimeout(tourTimer.current)
    return () => clearTimeout(tourTimer.current)
  }, [tour])

  useEffect(() => {
    const onKey = (e) => {
      if (!started || bookOpen) return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') setPanelOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, bookOpen, goNext, goPrev])

  const begin = (withTour) => {
    setStarted(true)
    setTour(withTour)
    select('venezia')
  }

  const toggleTour = () => {
    if (tour) return setTour(false)
    setTour(true)
    if (!selectedId) select('venezia')
    else tourTimer.current = setTimeout(goNext, 1500)
  }

  return (
    <div className="app">
      <div className="scene">
        {world && (
          <Suspense fallback={null}>
            <Scene
              world={world}
              selectedId={selectedId}
              onSelect={(id) => {
                setTour(false)
                select(id)
              }}
              targetU={targetU}
              onArrive={onArrive}
              focus={focus}
              focusKey={focusKey}
              follow={follow}
              showLabels={showLabels}
            />
          </Suspense>
        )}
      </div>
      <div className="vignette" aria-hidden />

      {started && (
        <>
          <header className="cartouche">
            <div className="cartouche__title">
              <h1>Il Milione</h1>
              <p>Il viaggio di Marco Polo · 1271–1295</p>
            </div>
            <nav className="toolbar">
              <button className={tour ? 'is-on' : ''} onClick={toggleTour} title="Avanza da solo di tappa in tappa">
                {tour ? '❚❚ Ferma il viaggio' : '▶ Viaggio guidato'}
              </button>
              <button className={follow ? 'is-on' : ''} onClick={() => setFollow((f) => !f)} title="La camera segue nave e carovana">
                ⌖ Segui i Polo
              </button>
              <button className={showLabels ? 'is-on' : ''} onClick={() => setShowLabels((v) => !v)} title="Mostra i nomi medievali delle regioni">
                ✎ Toponimi
              </button>
              <button onClick={() => setBookOpen(true)}>❧ Il libro</button>
            </nav>
          </header>
          <StatusBar />
          <Compass />
          <Legend />
          <Timeline
            chapters={CHAPTERS}
            selectedId={selectedId}
            stops={world?.stops}
            onSelect={(id) => {
              setTour(false)
              select(id)
            }}
          />
          {panelOpen && selectedId && (
            <ChapterPanel
              chapter={CHAPTER_BY_ID[selectedId]}
              index={index}
              total={CHAPTERS.length}
              onClose={() => setPanelOpen(false)}
              onNext={index < CHAPTERS.length - 1 ? () => { setTour(false); goNext() } : null}
              onPrev={index > 0 ? () => { setTour(false); goPrev() } : null}
              tour={tour}
            />
          )}
          {!panelOpen && selectedId && (
            <button className="reopen" onClick={() => setPanelOpen(true)}>
              Apri il capitolo: {CHAPTER_BY_ID[selectedId].title}
            </button>
          )}
        </>
      )}

      {!started && <Intro ready={!!world} onStart={begin} onBook={() => setBookOpen(true)} />}
      {bookOpen && <BookModal onClose={() => setBookOpen(false)} />}
    </div>
  )
}

function Legend() {
  return (
    <aside className="legend" aria-label="Legenda">
      <div><i className="sw sw--done" /> rotta percorsa</div>
      <div><i className="sw sw--todo" /> rotta da percorrere</div>
      <div><i className="sw sw--desc" /> luogo descritto nel libro</div>
      <div><i className="sw sw--miss" /> missione per il Gran Cane</div>
      <div><i className="dot dot--site" /> capitolo del sito originale</div>
      <div><i className="dot dot--res" /> tappa dalla ricerca storica</div>
    </aside>
  )
}
