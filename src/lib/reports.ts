import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx-js-style";
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
  doc.setTextColor(primaryColor[0]!, primaryColor[1]!, primaryColor[2]!);
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
  // Paleta alinhada ao dashboard (sky/slate)
  const dark = "FF0F172A";      // slate-900
  const primary = "FF0369A1";   // sky-700
  const primaryLight = "FF0EA5E9"; // sky-500
  const rowAlt = "FFF0F9FF";    // sky-50
  const rowBase = "FFFFFFFF";
  const borderColor = "FF94A3B8"; // slate-400

  const headers = ['Data', 'Técnico', 'Parque', 'Aerogerador', 'Código SAP', 'Descrição da Peça', 'Quantidade', 'Work Order', 'Estoque'];

  const border = {
    top: { style: "thin", color: { rgb: borderColor } },
    bottom: { style: "thin", color: { rgb: borderColor } },
    left: { style: "thin", color: { rgb: borderColor } },
    right: { style: "thin", color: { rgb: borderColor } },
  };

  const titleCell = {
    font: { bold: true, sz: 16, color: { rgb: primaryLight }, name: "Calibri" },
    fill: { patternType: "solid", fgColor: { rgb: dark } },
    alignment: { horizontal: "center", vertical: "center" },
  };
  const subtitleCell = {
    font: { sz: 10, color: { rgb: "FFCBD5E1" }, name: "Calibri" },
    fill: { patternType: "solid", fgColor: { rgb: dark } },
    alignment: { horizontal: "center", vertical: "center" },
  };
  const headerCell = {
    font: { bold: true, sz: 11, color: { rgb: "FFFFFFFF" }, name: "Calibri" },
    fill: { patternType: "solid", fgColor: { rgb: primary } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border,
  };
  const bodyCell = (alt: boolean, numeric = false) => ({
    font: { sz: 11, color: { rgb: dark }, name: "Calibri" },
    fill: { patternType: "solid", fgColor: { rgb: alt ? rowAlt : rowBase } },
    alignment: { horizontal: numeric ? "center" : "left", vertical: "center" },
    border,
  });

  const aoa: any[][] = [
    [`GESTÃO DE SOBRESSALENTES — RELATÓRIO DE MOVIMENTAÇÃO`],
    [`Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}  •  ${data.length} registros`],
    headers,
    ...data.map(item => [
      item.data,
      item.tecnico,
      item.parque,
      item.aero,
      item.sap,
      item.peca,
      item.quantidade,
      item.wo || '-',
      item.estoque || '-',
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const totalCols = headers.length;
  // Estiliza título e subtítulo (todas as células do merge)
  for (let c = 0; c < totalCols; c++) {
    ws[XLSX.utils.encode_cell({ r: 0, c })] = { ...(ws[XLSX.utils.encode_cell({ r: 0, c })] || { v: "" }), ...titleCell, v: c === 0 ? aoa[0][0] : "", t: "s" };
    ws[XLSX.utils.encode_cell({ r: 1, c })] = { ...(ws[XLSX.utils.encode_cell({ r: 1, c })] || { v: "" }), ...subtitleCell, v: c === 0 ? aoa[1][0] : "", t: "s" };
  }
  // Cabeçalho
  for (let c = 0; c < totalCols; c++) {
    const ref = XLSX.utils.encode_cell({ r: 2, c });
    ws[ref] = { v: headers[c], t: "s", ...headerCell };
  }
  // Corpo
  data.forEach((item, i) => {
    const r = i + 3;
    const alt = i % 2 === 1;
    const row = aoa[r];
    for (let c = 0; c < totalCols; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      const numeric = c === 3 || c === 6; // Aerogerador e Quantidade centralizados
      const isNum = c === 6;
      ws[ref] = { v: row[c], t: isNum ? "n" : "s", ...bodyCell(alt, numeric) };
    }
  });

  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
  ];
  ws['!cols'] = [
    { wch: 18 }, // Data
    { wch: 24 }, // Técnico
    { wch: 18 }, // Parque
    { wch: 12 }, // Aerogerador
    { wch: 14 }, // SAP
    { wch: 42 }, // Descrição
    { wch: 12 }, // Quantidade
    { wch: 14 }, // WO
    { wch: 14 }, // Estoque
  ];
  ws['!rows'] = [
    { hpt: 30 }, // título
    { hpt: 18 }, // subtítulo
    { hpt: 24 }, // cabeçalho
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Movimentações");

  XLSX.writeFile(wb, `relatorio-movimentacao-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
};
