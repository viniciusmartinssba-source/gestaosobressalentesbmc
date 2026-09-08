process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = 'production';

// Importa o servidor gerado pelo build do Lovable na pasta .output
import('./.output/server/index.mjs');