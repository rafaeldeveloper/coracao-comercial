#!/bin/bash
# Atualiza o app após um git push
# Execute: bash deploy/update.sh

set -e
cd /home/ubuntu/app

echo "=== Puxando atualizações ==="
git pull origin main

echo "=== Rebuild frontend ==="
npm install
VITE_API_URL="" npm run build

echo "=== Rebuild backend ==="
cd backend && npm install && npm run build && cd ..

echo "=== Reiniciando backend ==="
pm2 restart coracao-backend

echo "✅ Atualização concluída!"
