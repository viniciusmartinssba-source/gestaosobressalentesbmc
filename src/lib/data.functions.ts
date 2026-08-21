import { createServerFn } from "@tanstack/react-start";

// Mock data based on the requirements
export const getInitialData = createServerFn({ method: "GET" }).handler(async () => {
  return {
    parques: [
      { id: "MA", nome: "Macaúbas", aeros: Array.from({ length: 21 }, (_, i) => i + 1) },
      { id: "NH", nome: "Novo Horizonte", aeros: Array.from({ length: 18 }, (_, i) => i + 1) },
      { id: "SE", nome: "Seabra", aeros: Array.from({ length: 18 }, (_, i) => i + 1).filter(a => a !== 11) },
    ],
    estoques: ["1670", "1673"],
    tecnicos: [
      { nome: "Bruno Terras", matricula: "U57097", email: "bruno.terras@empresa.com" },
      { nome: "Leonardo Martins", matricula: "U61986", email: "leonardo.martins@empresa.com" },
      { nome: "Marcos Vinicius", matricula: "U39920", email: "marcos.vinicius@empresa.com" },
      { nome: "José Fagner", matricula: "U63108", email: "jose.fagner@empresa.com" },
      { nome: "Luiz Gustavo", matricula: "U60582", email: "luiz.gustavo@empresa.com" },
      { nome: "Vinicius Amaral", matricula: "U57122", email: "vinicius.amaral@empresa.com" },
      { nome: "Fábio Trigueiro", matricula: "U56683", email: "fabio.trigueiro@empresa.com" },
      { nome: "Phillipe Oliveira", matricula: "U63270", email: "phillipe.oliveira@empresa.com" },
      { nome: "Hiago Lopes", matricula: "U62963", email: "hiago.lopes@empresa.com" },
      { nome: "José Pedro", matricula: "U39919", email: "jose.pedro@empresa.com" },
      { nome: "Robson Correia", matricula: "U52648", email: "robson.correia@empresa.com" },
    ],
    catalogo: [
      { sap: "1001", descricao: "Rolamento Principal" },
      { sap: "1002", descricao: "Sensor de Vibração" },
      { sap: "1003", descricao: "Placa de Potência" },
      { sap: "1004", descricao: "Cabo de Dados Blindado" },
      { sap: "1005", descricao: "Filtro de Óleo" },
      { sap: "2001", descricao: "Gerador de Energia" },
      { sap: "2002", descricao: "Pá Eólica (Fragmento)" },
      { sap: "2003", descricao: "Freio Hidráulico" },
      { sap: "2004", descricao: "Inversor de Frequência" },
      { sap: "2005", descricao: "Transformador de Corrente" },
      { sap: "3001", descricao: "Anemômetro" },
      { sap: "3002", descricao: "Biruta Digital" },
      { sap: "3003", descricao: "Controlador Lógico" },
      { sap: "3004", descricao: "Válvula Solenoide" },
      { sap: "3005", descricao: "Bomba de Arrefecimento" },
    ],
  };
});
