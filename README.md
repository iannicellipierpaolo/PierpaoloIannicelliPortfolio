# BUILT DIFFERENT.

Portfolio di Pierpaolo Iannicelli, Web Developer. Prima versione React funzionante basata sui quattro riferimenti approvati. Le schermate non sono usate come sfondi: testi, layout, archi, cornici, pannelli e interazioni sono componenti reali.

## Avvio su Mac e Visual Studio Code

Serve Node.js **22.12 o superiore**. È consigliato Node 22 LTS o Node 24 LTS.

1. Estrai lo ZIP.
2. Apri la cartella `built-different` in VS Code.
3. Apri il terminale integrato nella stessa cartella.
4. Esegui:

```bash
npm ci
npm run dev
```

Apri l’indirizzo locale indicato nel terminale. Per fermare il server: `Ctrl+C`.

Non aprire `index.html` con un doppio clic: JSX e moduli richiedono Vite.

## Comandi

```bash
npm run dev
npm run check
npm run format:check
npm run build
npm run preview
```

- `dev`: sviluppo con aggiornamento automatico.
- `check`: nove test dei dati, selezione featured, archivio e URL.
- `format:check`: controllo della formattazione.
- `format`: riordina il codice con Prettier, mantenendo la struttura leggibile.
- `build`: genera il sito statico in `dist/`.
- `preview`: serve la build localmente.

Il lockfile fissa le versioni effettivamente installate e collaudate. Usa `npm ci` per riprodurre la stessa installazione.

## Stack e struttura

React 19, Vite 7, Tailwind CSS 4 con plugin Vite, GSAP 3 e ScrollTrigger, React Router 7 in modalità HashRouter. CSS personalizzato per il design e Tailwind disponibile per utility ed estensioni.

| Percorso                               | Cosa modificare                            |
| -------------------------------------- | ------------------------------------------ |
| `src/config/site.js`                   | Nome, ruolo, email, ritratto e navigazione |
| `src/data/projects.json`               | Tutti i contenuti dei progetti             |
| `src/data/project-utils.js`            | Selezione featured, ordinamento, URL       |
| `src/sections/`                        | Le quattro sezioni principali              |
| `src/components/`                      | Header, footer, grafica, mini-demo e card  |
| `src/pages/ProjectArchive.jsx`         | Archivio con filtri e ordinamento          |
| `src/animations/usePortfolioMotion.js` | Reveal e transizioni GSAP                  |
| `src/styles/global.css`                | Palette, font e componenti globali         |
| `src/styles/sections.css`              | Impaginazione delle sezioni                |
| `src/styles/responsive.css`            | Adattamenti e reduced motion               |
| `public/assets/`                       | Ritratto, favicon, future anteprime        |
| `.github/workflows/deploy.yml`         | Build e pubblicazione GitHub Pages         |

## Contenuti da completare

L’email e i quattro progetti definitivi non sono stati forniti. Nessun indirizzo, cliente o URL è stato inventato.

In `src/config/site.js`, imposta `email` con il tuo vero indirizzo. Il collegamento `mailto:` comparirà automaticamente. Con stringa vuota è mostrato un avviso non cliccabile.

In `src/data/projects.json`, sostituisci i quattro elementi segnaposto con nome, categoria, screenshot, URL e stato corretti. Vedi **GUIDA_PROGETTI.md**.

Il ritratto provvisorio è un ritaglio dello sguardo nello screenshot fornito. Per un risultato migliore, sostituisci `public/assets/portrait.webp` con una foto originale, conservando un rapporto vicino a 10:3. Aggiorna il testo alternativo se cambia il taglio.

## X-RAY MODE

La mini-demo usa vero stato React condiviso con il pannello System:

- Menu: `menuOpen`, aggiornato dal pulsante e dalle voci del menu.
- Vista: `view`, aggiornata dal pulsante e dalla navigazione della mini-demo.
- X-RAY: guide, modulo attivo, connessione e stato dell’ultima azione.

Entrambi i controlli X-RAY sono pulsanti con `aria-pressed`. La mini-demo resta funzionante anche con X-RAY disattivato. Non vengono effettuate richieste API, né simulate risposte da server. La mappa dei componenti è una sintesi didattica; i valori di stato provengono dalla demo reale.

## Motion e accessibilità

Le animazioni iniziali sono sovrapposte e non bloccano input o scroll. Lo scroll è nativo; non c’è scroll-jacking. Su desktop le forme e i pannelli si spostano lungo transizioni collegate allo scroll, mentre su mobile il movimento è ridotto.

`prefers-reduced-motion: reduce` disattiva timeline, parallax, movimento atmosferico, transizioni CSS e smooth scroll. Il sito mantiene tutte le funzioni. GSAP viene ripulito allo smontaggio e al cambio di media query.

Sono presenti landmark semantici, skip link, focus visibile, gestione Escape e ciclo Tab nel menu, focus della destinazione, etichette dei pulsanti e stato live della demo. I font sono serviti localmente; non ci sono analytics, cookie applicativi o font da CDN.

## Pubblicare su GitHub Pages

1. Crea un nuovo repository GitHub per il portfolio.
2. Carica **il contenuto di questa cartella** alla radice del repository: `package.json` deve essere nella radice, non in una sottocartella aggiuntiva.
3. In GitHub apri **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Il workflow incluso pubblica a ogni push su `main`. Se hai attivato Pages dopo il primo push, avvialo da **Actions → Deploy portfolio to GitHub Pages → Run workflow**.

Da una cartella nuova, non collegata ad altri repository:

```bash
git init -b main
git add .
git commit -m "Prima versione BUILT DIFFERENT"
```

Poi aggiungi l’URL reale del tuo nuovo repository con `git remote add origin`, e invia:

```bash
git push -u origin main
```

Non usare questi comandi per sovrascrivere un repository esistente senza prima verificarne contenuto e branch.

`base: './'` permette di ospitare gli asset anche in una sottocartella GitHub Pages. HashRouter produce la rotta `#/archive`, quindi un aggiornamento dell’archivio non richiede un fallback server e non produce un 404 del percorso. Non è necessario modificare il nome del repository in Vite.

## Pubblicare su Vercel

Importa il repository, seleziona **Vite**, comando build `npm run build`, directory di output `dist`, Node 22 o superiore. Non servono backend, variabili segrete o regole di rewrite per HashRouter. In alternativa, carica la build `dist/` su un hosting statico compatibile.

La pubblicazione reale su GitHub/Vercel non è stata eseguita: il pacchetto è pronto per essere configurato e caricato sul tuo account.

## Verifiche e limiti

Il dettaglio dei controlli eseguiti e delle differenze rispetto ai riferimenti è in **COLLAUDO.md**.

Font e texture sono ricostruzioni compatibili con il riferimento, non gli originali della composizione. La transizione Surface → Work è una ricomposizione coordinata dei pannelli e della griglia, non un morph esatto dello stesso nodo DOM. Prima della pubblicazione definitiva vanno inseriti i contenuti reali e verificati i relativi link.

## Documentazione tecnica consultata

- [Vite: build di produzione](https://vite.dev/guide/build)
- [Tailwind: integrazione con Vite](https://tailwindcss.com/docs/installation/using-vite)
- [React Router: HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter)
- [GSAP: matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/)
- [GSAP: context e cleanup](https://gsap.com/docs/v3/GSAP/gsap.context/)

Le licenze dei font sono incluse in `public/assets/licenses/`.
