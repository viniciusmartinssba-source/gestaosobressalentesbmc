const path = require("node:path");
const { pathToFileURL } = require("node:url");

const port = process.env.PORT || "3000";
const host = process.env.HOST || "0.0.0.0";

process.env.PORT = String(port);
process.env.NITRO_PORT = String(port);
process.env.HOST = host;
process.env.NITRO_HOST = host;

const serverEntry = path.join(__dirname, ".output", "server", "index.mjs");

console.log("Iniciando servidor Nitro...");
console.log("Arquivo do servidor:", serverEntry);
console.log("Porta:", process.env.PORT);
console.log("Host:", process.env.HOST);

import(pathToFileURL(serverEntry).href).catch((error) => {
  console.error("Falha ao iniciar o servidor Nitro:");
  console.error(error);
  process.exit(1);
});
