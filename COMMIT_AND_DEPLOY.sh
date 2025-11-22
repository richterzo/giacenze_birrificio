#!/bin/bash

# ============================================
# Script per commit e push delle modifiche
# ============================================

echo "📦 Preparazione commit..."

# Stage tutti i file modificati
git add .

# Commit con messaggio descrittivo
git commit -m "feat: Aggiungi scanner barcode con fotocamera e configurazioni deploy

- Implementato scanner barcode con fotocamera (html5-qrcode)
- Aggiunto supporto PWA (manifest.json, viewport config)
- Configurato per deploy Vercel + Neon
- Aggiunto script postinstall per Prisma
- Creata documentazione completa (DEPLOY.md, QUICKSTART.md)
- Fix warnings Next.js viewport
- Pronto per production deploy"

echo "✅ Commit creato!"
echo ""
echo "🚀 Push al repository..."

# Push al repository
git push origin main

echo ""
echo "✅ Push completato!"
echo ""
echo "================================================"
echo "📋 PROSSIMI PASSI:"
echo "================================================"
echo ""
echo "1. 🗄️  CREA DATABASE NEON:"
echo "   → Vai su: https://console.neon.tech"
echo "   → Crea progetto 'giacenze-birrificio'"
echo "   → Copia la connection string"
echo ""
echo "2. 🚀 DEPLOY SU VERCEL:"
echo "   → Vai su: https://vercel.com/new"
echo "   → Importa il repository appena pushato"
echo "   → Aggiungi variabili d'ambiente:"
echo "     DATABASE_URL=<neon-connection-string>"
echo "     AUTH_SECRET=\$(openssl rand -hex 32)"
echo "   → Click Deploy!"
echo ""
echo "3. 📚 Leggi la guida completa:"
echo "   → QUICKSTART.md (5 minuti)"
echo "   → DEPLOY.md (guida dettagliata)"
echo ""
echo "================================================"

