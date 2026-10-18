# Daoudi Barber Shop — sito web

Sito statico (HTML/CSS/JS, nessuna build necessaria) per il barbershop Daoudi, basato sul design
originale fornito (`Design sito barbershop italiano.zip`).

## File

- `index.html` — struttura della pagina (hero, servizi, team, galleria, prenotazione, recensioni, orari, contatti, Instagram)
- `style.css` — stile, tema chiaro/scuro, layout responsive
- `script.js` — toggle tema, menu mobile, form di prenotazione via WhatsApp, giorno corrente evidenziato negli orari
- `img/` — metti qui le foto reali (vedi sotto)

## Come vederlo in locale

Apri `index.html` con un server statico qualsiasi, ad esempio con Node:

```bash
npx http-server . -p 8099 -c-1
```

poi vai su `http://localhost:8099`.

(Aprire il file direttamente con doppio click può funzionare, ma alcuni browser bloccano `fetch`/font;
un piccolo server locale evita sorprese.)

## Foto da aggiungere

Metti le immagini in `img/` con questi nomi esatti (il sito le mostra automaticamente appena presenti,
finché mancano resta visibile un placeholder col segnaposto):

- `img/hero.jpg` — foto interno del locale (sfondo della prima sezione)
- `img/team-1.jpg`, `img/team-2.jpg`, `img/team-3.jpg` — foto dei tre barbieri
- `img/gal-1.jpg` … `img/gal-6.jpg` — foto galleria
- `img/ig-1.jpg` … `img/ig-6.jpg` — post Instagram

## Cosa personalizzare

Nel file `index.html`:
- Testi hero, servizi/prezzi, team, recensioni, orari, indirizzo/telefono/email
- Link Instagram reale (cerca `instagram.com/daoudibarber`)
- Il numero WhatsApp per le prenotazioni è in `script.js`, variabile `PHONE` in cima al file

## Prenotazioni

Il modulo "Prenota" non salva nulla online: apre WhatsApp con un messaggio già pronto
(nome, telefono, servizio, data, ora) che il cliente invia al negozio.
Se in futuro vuoi prenotazioni salvate su un database con un'area manager per modificare
prezzi/testi/foto dal sito stesso, si può aggiungere con Supabase — basta chiedere.

## Pubblicazione online

Essendo file statici, puoi pubblicarlo gratis su Netlify, Vercel o GitHub Pages trascinando
la cartella, oppure caricarlo su un hosting tradizionale via FTP.
