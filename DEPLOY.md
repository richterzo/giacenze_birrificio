# 🚀 GUIDA AL DEPLOY - App Giacenze Birrificio

Guida completa per deployare l'applicazione su **Vercel** con database **Neon PostgreSQL**.

---

## 📋 PREREQUISITI

- Account GitHub (con il repository pushato)
- Account Vercel (gratuito): https://vercel.com
- Account Neon (gratuito): https://neon.tech

---

## 1️⃣ SETUP DATABASE NEON

### Passo 1: Crea il Database

1. Vai su https://console.neon.tech
2. Clicca **"Create a project"**
3. Compila:
   - **Project name**: `giacenze-birrificio` (o il nome che preferisci)
   - **Region**: Scegli la più vicina (es. `Europe (Frankfurt)`)
   - **Postgres version**: Lascia l'ultima versione
4. Clicca **"Create project"**

### Passo 2: Ottieni la Connection String

1. Nella dashboard del progetto, vai su **"Dashboard"**
2. Troverai la **Connection String** che inizia con:
   ```
   postgresql://user:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **COPIA** questa stringa (la useremo su Vercel)

### Passo 3: Esegui le Migrazioni (Opzionale - può essere fatto dopo il deploy)

Se vuoi testare localmente prima del deploy:

```bash
# Crea un file .env nella root del progetto
echo 'DATABASE_URL="la-tua-connection-string-neon"' > .env
echo 'AUTH_SECRET="'$(openssl rand -hex 32)'"' >> .env

# Esegui le migrazioni
npx prisma migrate deploy

# Genera il client Prisma
npx prisma generate
```

---

## 2️⃣ DEPLOY SU VERCEL

### Passo 1: Importa il Progetto

1. Vai su https://vercel.com
2. Clicca **"Add New..."** → **"Project"**
3. Importa il repository GitHub `giacenze_birrificio`
4. Vercel rileverà automaticamente Next.js

### Passo 2: Configura le Variabili d'Ambiente

Prima di fare il deploy, clicca su **"Environment Variables"** e aggiungi:

#### `DATABASE_URL`
- **Value**: La connection string di Neon (quella copiata prima)
- Esempio: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

#### `AUTH_SECRET`
- **Value**: Genera un secret sicuro con:
  ```bash
  openssl rand -hex 32
  ```
- Esempio: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

#### `NEXTAUTH_URL` (Opzionale per Vercel)
- Vercel lo rileva automaticamente, ma se vuoi specificarlo:
- **Value**: Lascia vuoto per ora (Vercel lo imposterà dopo il primo deploy)

### Passo 3: Deploy

1. Clicca **"Deploy"**
2. Attendi 2-3 minuti (Vercel farà):
   - Build del progetto
   - Esecuzione `npm install`
   - Esecuzione `postinstall` (genera Prisma client)
   - Deploy automatico

### Passo 4: Esegui le Migrazioni su Production

Dopo il primo deploy:

1. Vai nella dashboard Vercel del tuo progetto
2. Vai su **"Settings"** → **"General"**
3. Copia l'URL del progetto (es. `https://giacenze-birrificio.vercel.app`)
4. Vai su **"Settings"** → **"Environment Variables"**
5. Modifica `NEXTAUTH_URL` e imposta l'URL completo del tuo sito

Ora esegui le migrazioni dal tuo terminale locale:

```bash
# Usa la stessa DATABASE_URL di Vercel
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

**OPPURE** usa la Vercel CLI:

```bash
# Installa Vercel CLI (se non l'hai già)
npm i -g vercel

# Login
vercel login

# Link al progetto
vercel link

# Esegui le migrazioni
vercel env pull .env.production
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

---

## 3️⃣ CREA IL PRIMO UTENTE

Una volta deployato:

1. Vai all'URL del tuo sito (es. `https://giacenze-birrificio.vercel.app`)
2. Fai una richiesta POST a `/api/auth/register`:

```bash
curl -X POST https://giacenze-birrificio.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@birrificio.it",
    "password": "password-sicura-123",
    "name": "Admin Birrificio"
  }'
```

**OPPURE** usa Postman / Insomnia / browser DevTools:

- URL: `https://giacenze-birrificio.vercel.app/api/auth/register`
- Method: `POST`
- Body (JSON):
  ```json
  {
    "email": "admin@birrificio.it",
    "password": "password-sicura-123",
    "name": "Admin Birrificio"
  }
  ```

3. Vai su `/login` e accedi con le credenziali appena create

---

## 4️⃣ VERIFICA FUNZIONALITÀ

### ✅ Checklist Post-Deploy

- [ ] Sito raggiungibile all'URL Vercel
- [ ] Login funzionante
- [ ] Dashboard carica correttamente
- [ ] Creazione prodotto funziona
- [ ] Scanner barcode (manuale) funziona
- [ ] **Scanner con fotocamera** funziona su mobile (richiede HTTPS ✓)
- [ ] Movimenti di magazzino funzionanti
- [ ] Database Neon connesso

### 📱 Test Fotocamera su Mobile

1. Apri il sito dal telefono (Safari/Chrome mobile)
2. Vai alla dashboard
3. Clicca **"📷 Fotocamera"**
4. Il browser chiederà permesso di accedere alla camera
5. Inquadra un codice a barre (EAN-13, Code 128, etc.)
6. Il prodotto verrà trovato automaticamente!

**Nota**: La fotocamera funziona **SOLO** su HTTPS (Vercel lo fornisce automaticamente)

---

## 5️⃣ CONFIGURAZIONI AVANZATE (Opzionale)

### Custom Domain

1. In Vercel, vai su **Settings** → **Domains**
2. Aggiungi il tuo dominio (es. `giacenze.birrificio.it`)
3. Configura i DNS come indicato da Vercel
4. Aggiorna `NEXTAUTH_URL` con il nuovo dominio

### Monitoraggio Database

1. In Neon, vai su **Monitoring**
2. Controlla:
   - Query performance
   - Connection pool
   - Storage usage

### Auto-Deploy da GitHub

Vercel è già configurato per auto-deploy:
- Ogni push su `main` → deploy automatico in production
- Ogni pull request → preview deployment

---

## 🐛 TROUBLESHOOTING

### Errore "Prisma Client not initialized"

```bash
# Nel progetto Vercel, vai su Settings → General → Build & Development Settings
# Assicurati che Build Command sia:
npm run build

# E che Install Command includa:
npm install
```

### Errore "Database connection failed"

- Verifica che `DATABASE_URL` su Vercel sia corretto
- Controlla che includa `?sslmode=require` alla fine
- Verifica che il database Neon sia attivo (free tier può andare in sleep)

### Fotocamera non funziona

- Verifica che il sito sia su HTTPS (Vercel lo fa automaticamente)
- Controlla i permessi del browser (Settings → Privacy → Camera)
- Su iOS Safari, assicurati di avere iOS 14.3+

### Errore 401 Unauthorized

- Verifica che l'utente sia stato creato correttamente
- Controlla che `AUTH_SECRET` sia impostato su Vercel
- Prova a fare logout e re-login

---

## 📚 RISORSE UTILI

- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org

---

## 🎉 FATTO!

La tua app è ora live su Vercel con database Neon! 🚀

Per domande o problemi, consulta la documentazione o apri una issue su GitHub.

