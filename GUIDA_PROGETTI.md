# Aggiornare i progetti

Tutta la galleria nasce da `src/data/projects.json`. Non devi modificare componenti o HTML per aggiungere un sito.

## Sostituire uno dei quattro segnaposto

1. Salva l’anteprima in `public/assets/projects/`, per esempio `anteprima-01.webp`.
2. Modifica il record corrispondente in `projects.json`.
3. Inserisci il vero URL del sito pubblicato. Non usare URL del repository al posto del sito.
4. Scegli `demo` se è una proposta/concept, oppure `real` per un incarico reale.
5. Lascia `featured: true` e `visible: true`.

Esempio di struttura da compilare (nome, URL e immagine sono segnaposto):

```json
{
  "id": "progetto-005",
  "name": "Nome del tuo progetto",
  "category": "Categoria del sito",
  "screenshot": "assets/projects/anteprima-05.webp",
  "url": "",
  "status": "demo",
  "featured": false,
  "order": 5,
  "visible": true
}
```

Incolla il record nell’array, aggiungendo una virgola fra gli oggetti. JSON non accetta commenti né la virgola dopo l’ultimo elemento.

## Significato dei campi

| Campo        | Uso                                                     |
| ------------ | ------------------------------------------------------- |
| `id`         | Identificativo stabile e univoco; non riutilizzarlo     |
| `name`       | Nome mostrato nella galleria                            |
| `category`   | Categoria mostrata e usata nei filtri                   |
| `screenshot` | Percorso relativo a `public/`, senza scrivere `public/` |
| `url`        | URL completo `https://…`; vuoto significa nessun link   |
| `status`     | `demo`, `real` oppure `placeholder`                     |
| `featured`   | `true` per candidarlo ai quattro in evidenza            |
| `order`      | Numero crescente per l’ordine editoriale                |
| `visible`    | `false` nasconde il progetto in tutte le viste          |

## Aggiungere una demo all’archivio

Aggiungi un record con un nuovo ID, `featured: false` e `visible: true`. Comparirà nell’archivio e il conteggio nella homepage si aggiornerà. Le categorie dei filtri sono ricavate automaticamente dai progetti presenti.

Non devi aggiungere un quinto componente o modificare la griglia.

## Sostituire un featured

- Imposta `featured: false` sul progetto che vuoi togliere dalla selezione.
- Imposta `featured: true` sul progetto che vuoi promuovere.
- Mantieni esattamente quattro progetti visibili con `featured: true`.

Il progetto rimosso dalla selezione rimane nell’archivio. Per nasconderlo del tutto, imposta `visible: false`.

Se vengono marcati più di quattro featured, vengono scelti i primi quattro per `order`; a parità si usa l’ID in ordine alfabetico. Gli altri finiscono nell’archivio. Nessun progetto viene duplicato fra selezione e archivio.

Se i featured visibili sono meno di quattro, il sito mostra quelli disponibili senza inventare altri lavori. Puoi conservare i segnaposto finché non hai quattro progetti definitivi.

## Anteprime e collegamenti

Preferisci immagini WebP larghe circa 1400–1800 px, con rapporto intorno a 16:10. I ritagli partono dall’alto. Evita immagini verticali eccessivamente lunghe o pesanti.

Le anteprime vengono caricate in lazy loading. Se un’immagine manca o non si carica, compare un segnaposto. Un URL vuoto o non valido non genera un collegamento cliccabile. I link configurati aprono una nuova scheda con `noopener noreferrer`.

## Controllo prima del push

```bash
npm run check
npm run build
npm run preview
```

Visita la homepage e `#/archive`, controlla il ritaglio di ogni anteprima e apri tutti i link reali. I test verificano anche la struttura dei dati configurati e non richiedono modifiche quando aggiungi progetti.

Se pubblichi con il workflow incluso, il push su `main` esegue controlli, build e deploy.
