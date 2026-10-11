# Il Milione · mappa 3D del viaggio di Marco Polo

Ricostruzione del sito [milionemarcopolo.altervista.org](http://milionemarcopolo.altervista.org/) come
applicazione **React + Three.js**: una carta nautica in rilievo, navigabile, dove una nave veneziana e una
carovana con Marco, Niccolò e Maffeo Polo percorrono la rotta storica del viaggio (1271–1295).

Ogni sigillo sulla carta apre un capitolo del Milione, articolato in tre livelli:

1. **Il racconto**: riscrittura narrativa e immersiva, come se il lettore viaggiasse con i Polo;
2. **Dal Milione**: ciò che il capitolo racconta secondo la pagina corrispondente del sito originale, con link;
3. **Nella storia**: note da studi moderni che danno coerenza geografica e segnalano le discrepanze.

## Tappe

23 tappe in ordine cronologico: 15 capitoli del sito originale (Venezia, Gerusalemme, Acri, Grande Armenia,
Baudac, Mulehet, Samarcanda, Ciandù, Cambaluc/Pechino, Tebet, Liaodong, Chinsai, Giava la Minore/Indonesia,
Isola di Seilan/Ceylon, Genova) e 8 tappe aggiunte dalla ricerca storica (Laiazzo, Cormos/Hormuz, Balascian,
Pamier, Deserto di Lop, Zaiton, Trebisonda, Ritorno a Venezia), contrassegnate in oro.

Sulla carta:

- **linea oro**: tratto già percorso; **rosso tratteggiato**: tratto da percorrere;
- **viola tratteggiato**: luoghi descritti nel libro e fuori dal percorso probabile (Baudac, Mulehet, Samarcanda);
- **verde tratteggiato**: missioni al servizio del Gran Cane (Tebet, Liaodong).

## Funzioni

- carta 3D con coste reali (Natural Earth) e rilievo delle catene montuose attraversate;
- mare animato con linee di costa incise, nuvole, toponimi medievali del Milione (Catai, Mangi, Mare Maggiore…);
- nave con vela gonfia nei tratti di mare, carovana di cammelli nei tratti di terra, con passaggio automatico nei porti;
- **viaggio guidato** automatico, modalità **segui i Polo**, linea del tempo, navigazione da tastiera (← →);
- finestra **Il libro** con le sezioni tematiche del sito (titolo, tradizione, Rustichello, «Fu vero viaggio?», Il Milione oggi, sitografia);
- layout adattivo per mobile.

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output in dist/
npm run preview
```

Richiede Node 18 o superiore.

## Deploy

Il build è statico con percorsi relativi (`base: './'`), quindi funziona su qualunque hosting.

- **GitHub Pages**: il workflow `.github/workflows/deploy.yml` pubblica a ogni push su `main`.
  Nelle impostazioni del repository: *Settings → Pages → Source: GitHub Actions*.
- **Netlify**: `netlify.toml` incluso.
- **Vercel**: importa il repository; Vercel riconosce Vite automaticamente.

## Struttura

```
src/
  data/
    chapters.js         contenuti delle tappe
    approfondimenti.js  sezioni tematiche del sito originale
    route.js            rotta storica, diramazioni, toponimi
    geo.js              proiezione geografica
  three/
    heightfield.js      maschera delle terre emerse, rilievo, texture dipinta
    Terrain.jsx Water.jsx Route.jsx Markers.jsx Travelers.jsx CameraRig.jsx Clouds.jsx Scene.jsx
  components/           pannello, linea del tempo, introduzione, finestra «Il libro»
docs/
  CRAWL.md              come è stato acquisito il sito originale e mappa delle pagine
  FONTI.md              fonti storiche e discrepanze
```

## Nota sui contenuti

I contenuti storici seguono le pagine del sito originale e il testo del Milione. Le parti narrative sono
riscritture artistiche: dialoghi e sensazioni sono immaginati, gli eventi e i dettagli descrittivi vengono
dal libro. Dove il Milione diverge dagli studi moderni, la sezione «Nella storia» lo segnala.
Vedi [docs/CRAWL.md](docs/CRAWL.md) per i limiti dell'acquisizione del sito originale.
