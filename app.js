const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Aponta para a pasta onde o projeto real foi construído
app.use(express.static(path.join(__dirname, '.output', 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.output', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});