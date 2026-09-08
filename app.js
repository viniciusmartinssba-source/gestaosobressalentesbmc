const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos gerados no build
app.use(express.static(path.join(__dirname, '.output/public')));

// Rota coringa para aplicações de página única (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.output/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});