import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve os arquivos gerados no build da pasta .output/public
app.use(express.static(path.join(__dirname, '.output/public')));

// Para qualquer rota do sistema, devolve o index.html principal do app (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.output/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});