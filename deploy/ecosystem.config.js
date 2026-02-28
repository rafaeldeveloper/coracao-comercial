module.exports = {
  apps: [{
    name: 'coracao-backend',
    script: '/home/ubuntu/app/backend/dist/main.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DB_PATH: '/data/coracao.sqlite',
      JWT_SECRET: 'TROQUE_POR_UMA_CHAVE_SECRETA_FORTE',
    },
    restart_delay: 3000,
    max_restarts: 10,
  }],
};
