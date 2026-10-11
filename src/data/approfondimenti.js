// Sezioni tematiche del sito originale, rielaborate.
const SITE = 'http://milionemarcopolo.altervista.org/'

export const APPROFONDIMENTI = [
  {
    id: 'titolo',
    title: "Il titolo e l'opera",
    source: SITE + 'Titolo.html',
    body: [
      "Marco Polo dettò il racconto del suo viaggio tra il 1298 e il 1299, nelle carceri di Genova, a un compagno di prigionia: il pisano Rustichello, autore di romanzi arturiani. Il libro nacque in una lingua franco-italiana con il titolo Le Divisament dou monde, «la descrizione del mondo».",
      "Il nome Il Milione ha due spiegazioni. Secondo Giovanni Battista Ramusio, che lo scrisse nel Cinquecento, i veneziani chiamavano Marco «messer Marco Milioni» per le cifre enormi con cui descriveva le ricchezze del Gran Cane. Secondo un'altra ipotesi, il titolo viene da «Emilione», soprannome della famiglia Polo.",
      "L'opera alterna il resoconto del viaggio a lunghe descrizioni di città, province, mercati, usanze e religioni: un trattato geografico ed etnografico, scritto per mercanti e per lettori di corte.",
    ],
  },
  {
    id: 'tradizione',
    title: 'La tradizione del testo',
    source: SITE + 'tradizione.html',
    body: [
      "L'originale dettato a Rustichello è perduto. Il libro circolò in fretta e in molte lingue, e ogni copista lo adattò: il sito osserva che ogni trascrizione è un processo vivo, contaminato dalla fantasia.",
      "Le redazioni principali sono il testo franco-italiano (manoscritto F, conservato a Parigi), la versione toscana trecentesca detta «Ottimo», la redazione veneta, la traduzione latina del domenicano Francesco Pipino e l'edizione cinquecentesca di Ramusio.",
      "Anche la divisione in capitoli cambia da una redazione all'altra: per questo i numeri dei capitoli citati nelle tappe seguono quelli indicati dalle pagine del sito originale.",
    ],
  },
  {
    id: 'rustichello',
    title: 'Rustichello e il fantastico',
    source: SITE,
    body: [
      "Rustichello da Pisa portò nel libro il gusto del romanzo cavalleresco: battaglie narrate con ritmo epico, formule rivolte direttamente ai lettori, episodi meravigliosi.",
      "Il risultato è un testo a due voci. Accanto all'osservazione precisa del mercante (prezzi, merci, distanze in giornate di cammino) compaiono prodigi, miracoli e creature leggendarie, che spesso Marco riporta come cose udite da altri.",
    ],
  },
  {
    id: 'tolleranza',
    title: 'Il Gran Cane e le religioni',
    source: SITE,
    body: [
      "Nel Milione Qubilai appare come un sovrano curioso e tollerante verso tutte le fedi. Il primo viaggio dei fratelli Polo si chiude con una richiesta del Gran Cane al papa: cento savi della Chiesa capaci di spiegare la fede cristiana, e l'olio della lampada del Santo Sepolcro.",
      "Marco annota con cura la religione di ogni popolo incontrato: cristiani nestoriani, saraceni, idolatri buddhisti. Il suo sguardo resta quello di un cristiano del Duecento, eppure è capace di scrivere, del Buddha, che se fosse stato cristiano sarebbe stato un grande santo.",
    ],
  },
  {
    id: 'veroviaggio',
    title: 'Fu vero viaggio?',
    source: SITE + 'Veroviaggio.html',
    body: [
      "Nel 1995 Frances Wood, responsabile della sezione cinese della British Library, pubblicò Did Marco Polo Go to China?, sostenendo che Marco si fosse fermato in Persia o sul Mar Nero e avesse ricavato le notizie sulla Cina da fonti persiane.",
      "Gli argomenti di Wood: l'assenza di Marco nei documenti ufficiali cinesi; i silenzi del libro su elementi tipici come la Grande Muraglia, il tè, la scrittura cinese, i piedi fasciati; i toponimi in forma persiana.",
      "Molti studiosi hanno risposto. Una fonte cinese dell'epoca Yuan nomina i tre ambasciatori che il Milione indica come compagni della principessa Cocacin. Lo studio di Hans Ulrich Vogel (2013) mostra che le descrizioni di moneta, sale e rendite sono accurate in dettagli che nessuna fonte persiana conosceva. Oggi la maggior parte degli storici ritiene autentico il viaggio, pur riconoscendo nel libro esagerazioni e notizie raccolte per sentito dire.",
    ],
  },
  {
    id: 'oggi',
    title: 'Il Milione oggi',
    source: SITE + 'IlMilioneoggi.html',
    body: [
      "Il libro di Marco Polo ha accompagnato i navigatori (Cristoforo Colombo ne possedeva una copia latina annotata) e ha nutrito per secoli l'immaginario europeo sull'Oriente.",
      "Nel 1972 Italo Calvino lo trasforma in letteratura pura con Le città invisibili: Marco Polo descrive a Kublai Khan città immaginarie, ciascuna una variazione sulla memoria, il desiderio, i segni.",
      "Il cinema e la televisione hanno raccontato più volte il viaggio, dallo sceneggiato Marco Polo di Giuliano Montaldo (1982) alla serie Netflix del 2014.",
    ],
  },
  {
    id: 'sitografia',
    title: 'Sitografia e fonti',
    source: SITE + 'Sitografia.html',
    body: [
      "Il sito originale cita tra le sue fonti le edizioni Einaudi e Rizzoli (BUR) del Milione e diversi siti di approfondimento.",
      "Questa ricostruzione usa come base le pagine di milionemarcopolo.altervista.org e integra la geografia con studi storici moderni. Le tappe contrassegnate come «ricerca storica» sono assenti dal sito originale e si basano sul testo del Milione e su fonti di riferimento (Dizionario Biografico Treccani, studi di Hans Ulrich Vogel, Frances Wood e altri). L'elenco completo delle fonti consultate si trova nel file docs/FONTI.md del repository.",
    ],
  },
]
