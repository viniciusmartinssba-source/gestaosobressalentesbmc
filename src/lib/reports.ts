import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";

interface Movimentacao {
  data: string;
  tecnico: string;
  parque: string;
  aero: string;
  peca: string;
  sap: string;
  quantidade: number;
  wo?: string;
  estoque?: string;
}

export const exportToPDF = (data: Movimentacao[]) => {
  const doc = new jsPDF();
  
  // Header colors (sky-700 equivalent)
  const primaryColor = [3, 105, 161];
  
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Relatório de Movimentação de Peças", 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);
  
  autoTable(doc, {
    startY: 40,
    head: [['Data', 'Técnico', 'Local', 'SAP', 'Peça', 'Qtd', 'WO']],
    body: data.map(item => [
      item.data,
      item.tecnico,
      `${item.parque} - ${item.aero}`,
      item.sap,
      item.peca,
      item.quantidade.toString(),
      item.wo || '-'
    ]),
    headStyles: {
      fillColor: primaryColor as any,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { top: 40 }
  });
  
  doc.save(`relatorio-movimentacao-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const exportToXLSX = (data: Movimentacao[]) => {
  const ws = XLSX.utils.json_to_sheet(data.map(item => ({
    'Data': item.data,
    'Técnico': item.tecnico,
    'Parque': item.parque,
    'Aerogerador': item.aero,
    'Código SAP': item.sap,
    'Descrição da Peça': item.peca,
    'Quantidade': item.quantidade,
    'Work Order': item.wo || '',
    'Estoque': item.estoque || ''
  })));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Movimentações");
  
  XLSX.writeFile(wb, `relatorio-movimentacao-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
};
