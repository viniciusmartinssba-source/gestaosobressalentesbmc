import { createServerFn } from "@tanstack/react-start";

// Mock data based on the requirements
export const getInitialData = createServerFn({ method: "GET" }).handler(async () => {
  return {
    parques: [
      { id: "MA", nome: "Macaúbas", aeros: Array.from({ length: 21 }, (_, i) => i + 1) },
      { id: "NH", nome: "Novo Horizonte", aeros: Array.from({ length: 18 }, (_, i) => i + 1) },
      { id: "SE", nome: "Seabra", aeros: Array.from({ length: 17 }, (_, i) => i + 1).filter(a => a !== 11) },
    ],
    estoques: ["1670", "1673"],
    tecnicos: [
      { nome: "Bruno Terras", matricula: "U57097" },
      { nome: "Leonardo Martins", matricula: "U61986" },
      { nome: "Marcos Vinicius", matricula: "U39920" },
      { nome: "José Fagner", matricula: "U63108" },
      { nome: "Luiz Gustavo", matricula: "U60582" },
      { nome: "Vinicius Amaral", matricula: "U57122" },
      { nome: "Fábio Trigueiro", matricula: "U56683" },
      { nome: "Phillipe Oliveira", matricula: "U63270" },
      { nome: "Hiago Lopes", matricula: "U62963" },
      { nome: "José Pedro", matricula: "U39919" },
      { nome: "Robson Correia", matricula: "U52648" },
    ],
    catalogo: [
      { sap: "1001", descricao: "Rolamento Principal" },
      { sap: "1002", descricao: "Sensor de Vibração" },
      { sap: "1003", descricao: "Placa de Potência" },
      { sap: "1004", descricao: "Cabo de Dados Blindado" },
      { sap: "1005", descricao: "Filtro de Óleo" },
    ],
  };
});
