## 📦 App Giacenze Birrificio

Applicazione Next.js 16 con TypeScript, Prisma e PostgreSQL per la gestione delle giacenze. Include autenticazione con NextAuth, modelli `Product` e `StockMovement`, **scanner barcode con fotocamera** per mobile/desktop, e API pronte per la scansione dei codici a barre e la registrazione dei movimenti di magazzino.

### ✨ Funzionalità Principali

- 🔐 **Autenticazione sicura** con NextAuth v5
- 📷 **Scanner barcode con fotocamera** (supporta EAN-13, Code 128, QR, etc.)
- 📦 **Gestione prodotti** con SKU, barcode e quantità
- 📊 **Movimenti di magazzino** (IN/OUT/ADJUST)
- 📱 **PWA Ready** - Installabile su mobile
- 🚀 **Deploy-ready** per Vercel + Neon

### Requisiti

- Node.js 20+
- PostgreSQL raggiungibile tramite `DATABASE_URL`
- Prisma CLI (`npx prisma`)

### Configurazione

1. Copia il file `.env.example` in `.env` e imposta:
   - `DATABASE_URL` → stringa di connessione PostgreSQL
   - `AUTH_SECRET` → stringa casuale generata (ad es. `openssl rand -hex 32`)
2. Installa le dipendenze:

   ```bash
   npm install
   ```

3. Esegui la migrazione Prisma ed eventuale seeding:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

L’app sarà disponibile su [http://localhost:3000](http://localhost:3000).

### Autenticazione

- È configurato NextAuth con provider `Credentials` e Prisma Adapter.
- Il primo utente può essere creato con una richiesta `POST /api/auth/register` (senza autenticazione se non esistono utenti). In seguito, la stessa API richiede un utente autenticato.
- Login tramite pagina `/login`.

### API principali

- `POST /api/barcode` → riceve `{ barcode }` e restituisce il prodotto trovato.
- `GET/POST /api/products` → elenco e creazione prodotti.
- `GET/POST /api/stock-movements` → elenca e registra i movimenti (IN/OUT/ADJUST).
- `POST /api/auth/register` → registrazione utenti.

Tutte le API (tranne il bootstrap dell’utente iniziale) richiedono sessione autenticata.

### Struttura UI

- Dashboard `/` con:
  - Form per scansione barcode
  - Form per nuova anagrafica prodotto
  - Form per movimenti di magazzino
  - Tabella prodotti e lista movimenti recenti
- Pagina di login separata `/login`

### Script utili

- `npm run dev` → avvia Next.js in sviluppo
- `npm run build` → build produzione
- `npm start` → avvia build prodotta
- `npm run lint` → esegue ESLint

### Deploy su Vercel + Neon

Per deployare l'applicazione in produzione, consulta la guida completa:

📖 **[DEPLOY.md](./DEPLOY.md)** - Guida passo-passo per:
- Creare database su Neon
- Deploy su Vercel
- Configurare variabili d'ambiente
- Eseguire migrazioni
- Testare la fotocamera su mobile

### Note

- Prisma è configurato per PostgreSQL; per altri DB modifica `prisma/schema.prisma`.
- Ricorda di generare il client con `npx prisma generate` dopo ogni cambio allo schema.
- La fotocamera funziona **solo su HTTPS** (Vercel lo fornisce automaticamente).
- Supporta tutti i formati barcode standard: EAN-13, UPC-A, Code 128, QR Code, etc.
