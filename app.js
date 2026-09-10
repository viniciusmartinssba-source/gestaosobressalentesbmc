import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Recria as variáveis globais de diretório para o padrão ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";

// Garante que o Nitro receba as portas dinâmicas geradas pelo cPanel
process.env.PORT = String(port);
process.env.NITRO_PORT = String(port);
process.env.HOST = host;
process.env.NITRO_HOST = host;

const serverEntry = path.join(__dirname, ".output", "server", "index.mjs");

console.log("Iniciando servidor Nitro em modo ESM...");

// Carrega o build de produção do Nitro
import(pathToFileURL(serverEntry).href).catch((error) => {
  console.error("Falha ao iniciar o servidor Nitro:");
  console.error(error);
  process.exit(1);
});