# ⚡ QUICKSTART - Deploy in 5 Minuti

## 🎯 Setup Veloce Neon + Vercel

### 1. Database Neon (2 minuti)

```bash
# 1. Vai su https://console.neon.tech
# 2. Clicca "Create a project"
# 3. Nome: giacenze-birrificio
# 4. Region: Europe (Frankfurt)
# 5. Clicca "Create project"
# 6. COPIA la connection string che appare (tipo):
#    postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### 2. Deploy Vercel (3 minuti)

```bash
# 1. Vai su https://vercel.com/new
# 2. Importa questo repository GitHub
# 3. Aggiungi Environment Variables:

DATABASE_URL="la-connection-string-di-neon"
AUTH_SECRET="genera-con-openssl-rand-hex-32"

# 4. Clicca "Deploy"
# 5. Attendi 2-3 minuti
```

### 3. Migrazioni Database

```bash
# Nel tuo terminale locale:
DATABASE_URL="connection-string-neon" npx prisma migrate deploy
```

### 4. Crea Primo Utente

```bash
# Sostituisci YOUR-APP con il tuo URL Vercel
curl -X POST https://YOUR-APP.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.it",
    "password": "password123",
    "name": "Admin"
  }'
```

### 5. Accedi! 🎉

Vai su `https://YOUR-APP.vercel.app/login` e usa le credenziali appena create.

---

## 📱 Test Scanner Fotocamera

1. Apri il sito dal telefono
2. Vai alla Dashboard
3. Clicca **"📷 Fotocamera"**
4. Permetti accesso camera
5. Inquadra un barcode!

---

Per la guida completa: [DEPLOY.md](./DEPLOY.md)

