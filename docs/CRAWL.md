# Acquisizione del sito originale

Sito di partenza: <http://milionemarcopolo.altervista.org/>

## Come è stato acquisito

L'ambiente di lavoro in cui è stato costruito il progetto ha una politica di rete che blocca il dominio
`milionemarcopolo.altervista.org` (connessione rifiutata dal proxy), insieme a Wayback Machine, archive.today
e Wikisource. Per questo motivo **non è stato possibile fare screenshot né scaricare l'HTML delle pagine**.

La struttura e i contenuti sono stati ricostruiti attraverso l'indice di un motore di ricerca, interrogando
pagina per pagina il sito (titoli, estratti e riassunti indicizzati). I testi delle tappe nel campo
`fromBook` di `src/data/chapters.js` derivano da questi estratti, riformulati.

Per un controllo puntuale dei testi, conviene aprire le pagine originali (ogni tappa ha il link nel pannello)
e confrontarle con `src/data/chapters.js`.

## Mappa delle pagine individuate

| Pagina | URL | Contenuto indicizzato |
| --- | --- | --- |
| Home | `/` | Menu per luoghi: Venezia, Acri, Gerusalemme, Armenia, Baudac, Mulehet, Samarcanda, Tibet, Pechino, Ciandù, Liaodong, Chinsai, Indonesia, Isola di Ceylon, Genova; sezioni tematiche |
| Venezia | `/Venezia.html` | Proemio del Milione con parafrasi |
| Acri | `/Acri.html` | Lettere del papa, i due frati (Niccolò da Vicenza, Guglielmo da Tripoli) che tornano indietro |
| Gerusalemme | `/Gerusalemme.html` | Partenza da Venezia, legato di Acri, olio della lampada del Santo Sepolcro |
| Armenia | `/Armenia.html` | Cap. XVI «Della grande Erminia»: arca di Noè, fontana d'olio |
| Baudac | `/Baudac.html` | Presa di Baudac da parte di Alau, avidità del califfo, miracolo della montagna |
| Mulehet | `/Mulehet.html` | Il Veglio della Montagna, il giardino, gli assassini, la distruzione per mano di Alau |
| Samarcanda | `/Samarcanda.html` | Chiesa di san Giovanni Battista e miracolo della colonna |
| Tibet | `/Tibet.html` | Cap. XCIX: usanze matrimoniali, carattere etnologico del Milione |
| Pechino | `/Pechino.html` | La carta moneta del Gran Cane e la zecca di Cambaluc |
| Ciandù | `/Ciandu.html` | Rapporti dei Polo con la corte, tavole d'oro, congedo |
| Liaodong | `/Liaodong.html` | Cap. LXV: battaglia del Gran Cane contro Naian |
| Chinsai | `/Chinsai.html` | Cap. CXXXII: rendita del sale (80 tomani d'oro) |
| Indonesia | `/Lambri.html` | Reame di Lambri (uomini con la coda, unicorni) e cap. CXLIII su Giava |
| Isola di Ceylon | `/IsoladiCeylon.html` | Cap. CLV: Sagamoni Borcan, la montagna di Adamo |
| Genova | `/Genova.html` | Prigionia di Marco e Rustichello, dettatura del libro |
| Il titolo e l'opera | `/Titolo.html` | Origine del titolo e struttura dell'opera |
| Tradizione | `/tradizione.html` | Tradizione manoscritta |
| Fu vero viaggio? | `/Veroviaggio.html` | Le tesi di Frances Wood |
| Il Milione oggi | `/IlMilioneoggi.html` | Calvino, cinema |
| Sitografia | `/Sitografia.html` | Fonti del sito (edizioni Einaudi e Rizzoli) |

## Struttura visiva

Non essendo stato possibile visualizzare il sito, la nuova interfaccia mantiene l'organizzazione dei contenuti
(un capitolo per tappa geografica, più le sezioni tematiche raccolte nella finestra «Il libro») e adotta
un'estetica da carta nautica medievale.
