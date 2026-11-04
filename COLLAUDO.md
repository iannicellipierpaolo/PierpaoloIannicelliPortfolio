# Collaudo della prima versione

Data: 4 novembre 2026.

## Controlli eseguiti

| Controllo                      | Risultato                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Installazione npm e lockfile   | Completata                                                                                                                           |
| Avvio server Vite              | Verificato                                                                                                                           |
| Build di produzione            | Completata senza errori                                                                                                              |
| Test Node                      | 9 test superati: dati, selezione, archivio, ordinamento e URL                                                                        |
| Formattazione                  | Verificata con Prettier                                                                                                              |
| Apertura homepage e reveal     | Verificati nel browser Chromium desktop                                                                                              |
| Navigazione fra sezioni        | Verificata con offset dell’header e cambio di voce attiva                                                                            |
| X-RAY on/off                   | Verificato con pulsante centrale e tastiera                                                                                          |
| Mini-demo: menu e cambio vista | Verificati; lo stato System rispecchia l’azione reale                                                                                |
| Menu responsive                | Apertura, destinazione, chiusura, Escape e ritorno del focus verificati                                                              |
| Progetti iniziali              | Quattro segnaposto, nessun link esterno inventato                                                                                    |
| Archivio                       | Stato vuoto, accesso dalla home e ricaricamento diretto di `#/archive` verificati                                                    |
| Layout responsive              | Verificato in viewport iframe da 320, 390, 768 e 1024 px; nessun overflow orizzontale del documento                                  |
| Desktop                        | Ispezione visiva a circa 1363 px; verifica del layout ampio a 1440 px                                                                |
| Screenshot di controllo        | Homepage, processo, lavori, contatti e mobile osservati durante il collaudo                                                          |
| Console applicativa            | Nessun errore runtime dell’app dopo le correzioni; il browser di prova riporta errori della propria estensione, estranei al progetto |

## Verifiche implementate ma non collaudate su dispositivi reali

- Reduced motion: tutte le timeline sono vincolate a `prefers-reduced-motion: no-preference`; CSS e scroll hanno il fallback. Verificato nel codice, senza emulazione della preferenza di sistema nel browser disponibile.
- Nessun test su iPhone fisico, Safari, Firefox o lettore di schermo.
- Nessun audit Lighthouse, profilazione GPU o misura dei Core Web Vitals su hosting reale.
- Email: il ramo `mailto:` è implementato; manca l’indirizzo e non è stato avviato un client di posta.
- Link ai siti dei progetti: validazione URL coperta dai test, ma i collegamenti definitivi non sono stati forniti e non sono stati visitati.
- Filtri e ordinamento dell’archivio sono implementati; con l’archivio vuoto l’interfaccia dei filtri non è mostrata. La selezione dei dati è testata con record di prova.
- Workflow GitHub Pages e configurazione Vercel preparati, ma nessun deploy su account esterno eseguito.

## Fedeltà visiva e differenze dichiarate

- Palette, gerarchie, quattro sezioni, cornici, archi, ritratto, struttura Surface/System e contatti arancioni seguono i riferimenti.
- Inter e IBM Plex Mono sono font locali equivalenti di progetto: gli originali dei mockup non erano specificati. Le metriche tipografiche non sono identiche al pixel.
- La superficie orbitale è ricostruita con CSS e SVG: ha grana e movimento lento, ma non la stessa texture fotografica del riferimento.
- Il ritratto è provvisoriamente ricavato dal riquadro dello sguardo del riferimento, come consentito dal brief.
- Le anteprime reali non sono disponibili: quattro segnaposto numerati le rendono sostituibili senza mostrare lavori o clienti inventati.
- La mini-demo è funzionante. Il diagramma privilegia Menu, View, Events e Deploy per collegare lo stato effettivo alle azioni; non simula backend o API.
- Le transizioni sono strutturali, senza scroll-jacking. Surface → Work ricompone i pannelli e introduce la griglia: non trasforma geometricamente la mini-demo nello stesso elemento DOM della prima anteprima.
- Il layout mobile è una composizione verticale dedicata; su desktop le sezioni possono superare l’altezza della finestra per mantenere contenuti leggibili.

## Prima della pubblicazione definitiva

1. Inserire email, nomi, categorie, quattro anteprime e URL reali.
2. Sostituire il ritaglio provvisorio con una foto originale, se disponibile.
3. Eseguire `npm ci`, `npm run check`, `npm run build`.
4. Controllare sul telefono e sul browser che userai abitualmente.
5. Configurare GitHub Pages o Vercel e verificare i link sul dominio finale.
