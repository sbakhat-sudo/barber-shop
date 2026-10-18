# Daoudi Barber Shop — sito web

Sito statico (HTML/CSS/JS, nessuna build necessaria) per il barbershop Daoudi, basato sul design
originale fornito (`Design sito barbershop italiano.zip`).

## File

- `index.html` — struttura della pagina (hero, servizi, team, galleria, contatti/prenotazione, recensioni, orari)
- `style.css` — stile moderno (tema scuro), animazioni scroll-reveal, hover, layout responsive
- `script.js` — dati del sito, rendering dinamico, menu mobile, area manager
- `img/` — foto di default (placeholder finché non carichi le tue, vedi sotto)

## Come vederlo in locale

Apri `index.html` con un server statico qualsiasi, ad esempio con Node:

```bash
npx http-server . -p 8099 -c-1
```

poi vai su `http://localhost:8099`.

(Aprire il file direttamente con doppio click può funzionare, ma alcuni browser bloccano `fetch`/font;
un piccolo server locale evita sorprese.)

## Prenotazioni

Niente modulo da compilare: nella sezione "Prenota il tuo posto" ci sono tre pulsanti
**Chiama ora**, **Scrivi un'email** e **WhatsApp** che aprono direttamente l'app giusta
con il numero/indirizzo del negozio.

## Area manager (modifica contenuti dal sito)

In fondo alla pagina c'è il link **"⚙ Area manager"**. Inserendo la password si entra in
modalità modifica e si può cambiare: testo hero, servizi e prezzi, team (nome/ruolo/foto),
foto della galleria, recensioni, orari e dati di contatto.

- **Password attuale:** `Daoudi2026` — modificabile nel file `script.js`, costante `ADMIN_PASSWORD`
  in cima al file. Va cambiata prima di rendere il sito pubblico.
- **Importante — limite di questa modalità:** essendo un sito statico senza database, le
  modifiche fatte in "Area manager" si salvano **solo nel browser/dispositivo** su cui sono
  state fatte (localStorage). Gli altri visitatori del sito pubblico **non le vedono**.
  È utile per provare rapidamente come apparirebbe una modifica, ma per aggiornare il sito
  "vero" bisogna poi riportare i nuovi testi/prezzi/foto direttamente nel codice (`script.js`,
  oggetto `DEFAULTS`) e ripubblicare. Se vuoi che le modifiche del manager siano visibili a
  tutti in tempo reale, serve collegare un database (es. Supabase) — basta chiedere.
- La password è visibile a chiunque legga il codice sorgente: non è una vera misura di
  sicurezza, serve solo a evitare modifiche accidentali di un visitatore curioso.

## Foto da aggiungere

Metti le immagini in `img/` con questi nomi esatti (il sito le mostra automaticamente appena presenti,
finché mancano resta visibile un placeholder col segnaposto). In alternativa puoi caricarle
direttamente dall'Area manager (vengono salvate solo nel tuo browser, vedi sopra).

- `img/hero.jpg` — foto interno del locale (sfondo della prima sezione)
- `img/team-1.jpg`, `img/team-2.jpg`, `img/team-3.jpg` — foto dei tre barbieri
- `img/gal-1.jpg` … `img/gal-6.jpg` — foto galleria

## Cosa personalizzare nel codice

- Testi hero, servizi/prezzi, team, recensioni, orari, contatti → `script.js`, oggetto `DEFAULTS`
- Numero di telefono/WhatsApp ed email → `script.js`, oggetto `DEFAULTS.contact`
  (aggiornano automaticamente tutti i pulsanti "Chiama", "Email", "WhatsApp" del sito)

## Pubblicazione online

Essendo file statici, puoi pubblicarlo gratis su Netlify, Vercel o GitHub Pages trascinando
la cartella, oppure caricarlo su un hosting tradizionale via FTP.
