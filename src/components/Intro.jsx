export default function Intro({ ready, onStart, onBook }) {
  return (
    <div className="intro">
      <div className="intro__card">
        <p className="intro__kicker">Venezia, anno del Signore 1271</p>
        <h1>Il Milione</h1>
        <p className="intro__lede">
          Un ragazzo di diciassette anni sale su una galea con il padre e lo zio. Torneranno ventiquattro anni dopo, e
          porteranno con sé il racconto del mondo.
        </p>
        <p>
          Questa carta segue la rotta storica di Marco, Niccolò e Maffeo Polo: il Mediterraneo, l'Armenia, la Persia, il
          tetto del Pamir, i deserti dell'Asia centrale, il Catai del Gran Cane, e il ritorno per mare attraverso
          Sumatra, Ceylon e l'India. Ogni sigillo sulla carta apre un capitolo del Milione.
        </p>
        <div className="intro__actions">
          <button className="primary" disabled={!ready} onClick={() => onStart(false)}>
            {ready ? 'Salpa da Venezia' : 'Si disegna la carta…'}
          </button>
          <button disabled={!ready} onClick={() => onStart(true)}>
            ▶ Viaggio guidato
          </button>
          <button className="link" onClick={onBook}>
            Il libro e le fonti
          </button>
        </div>
        <p className="intro__hint">Trascina per ruotare · rotella o pizzico per lo zoom · frecce ← → per cambiare tappa</p>
      </div>
    </div>
  )
}
