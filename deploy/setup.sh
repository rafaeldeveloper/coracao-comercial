#!/bin/bash
# Script de configuração inicial da EC2 (Ubuntu 22.04)
# Execute: bash setup.sh

set -e

echo "=== Atualizando sistema ==="
sudo apt update && sudo apt upgrade -y

echo "=== Instalando Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "=== Instalando nginx e PM2 ==="
sudo apt install -y nginx
sudo npm install -g pm2

echo "=== Clonando repositório ==="
git clone https://github.com/rafaeldeveloper/coracao-comercial.git /home/ubuntu/app
cd /home/ubuntu/app

echo "=== Build do frontend ==="
npm install
VITE_API_URL="" npm run build   # deixa vazio: nginx faz proxy /api → backend

echo "=== Instalando dependências do backend ==="
cd backend
npm install
npm run build
cd ..

echo "=== Configurando nginx ==="
sudo cp deploy/nginx.conf /etc/nginx/sites-available/coracao
sudo ln -sf /etc/nginx/sites-available/coracao /etc/nginx/sites-enabled/coracao
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "=== Iniciando backend com PM2 ==="
sudo mkdir -p /data
pm2 start deploy/ecosystem.config.js
pm2 startup | tail -1 | sudo bash
pm2 save

echo ""
echo "✅ Deploy concluído!"
echo "   Acesse: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
