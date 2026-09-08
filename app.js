const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Define o caminho absoluto exato onde o app.js está rodando no servidor
const publicPath = path.join(__dirname, '.output/public');

// Serve os arquivos estáticos
app.use(express.static(publicPath));

// Rota coringa para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});