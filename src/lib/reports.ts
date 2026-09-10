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

// Paleta alinhada ao dashboard (dark slate + sky)
const DARK: [number, number, number] = [15, 23, 42]; // slate-900
const DARK_SOFT: [number, number, number] = [30, 41, 59]; // slate-800
const SKY: [number, number, number] = [14, 165, 233]; // sky-500
const SKY_DEEP: [number, number, number] = [3, 105, 161]; // sky-700
const LIGHT: [number, number, number] = [241, 245, 249]; // slate-100
const ROW_ALT: [number, number, number] = [240, 249, 255]; // sky-50
const MUTED: [number, number, number] = [100, 116, 139]; // slate-500

export const exportToPDF = (data: Movimentacao[]) => {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const drawHeader = () => {
    doc.setFillColor(...DARK);
    doc.rect(0, 0, pageWidth, 34, "F");
    doc.setFillColor(...SKY);
    doc.rect(0, 34, pageWidth, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...LIGHT);
    doc.text("GESTÃO DE SOBRESSALENTES", 14, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("Relatório de Movimentação de Peças", 14, 23);

    doc.setFontSize(9);
    doc.setTextColor(...SKY);
    doc.text(
      `Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}  •  ${data.length} registros`,
      pageWidth - 14,
      23,
      { align: "right" },
    );
  };

  const totalPecas = data.reduce((acc, i) => acc + (Number(i.quantidade) || 0), 0);

  autoTable(doc, {
    startY: 48,
    margin: { top: 44, left: 14, right: 14, bottom: 18 },
    head: [
      ["Data", "Técnico", "Parque", "Aero", "SAP", "Descrição da Peça", "Qtd", "WO", "Estoque"],
    ],
    body: data.map((item) => [
      item.data,
      item.tecnico,
      item.parque,
      item.aero,
      item.sap,
      item.peca,
      String(item.quantidade),
      item.wo || "-",
      item.estoque || "-",
    ]),
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      cellPadding: 3,
      textColor: DARK,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
      valign: "middle",
    },
    headStyles: {
      fillColor: SKY_DEEP,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: { fillColor: ROW_ALT },
    columnStyles: {
      0: { cellWidth: 32 },
      1: { cellWidth: 38 },
      2: { cellWidth: 30 },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 22, halign: "center", fontStyle: "bold", textColor: SKY_DEEP },
      5: { cellWidth: "auto" },
      6: { cellWidth: 14, halign: "center", fontStyle: "bold" },
      7: { cellWidth: 24, halign: "center" },
      8: { cellWidth: 22, halign: "center" },
    },
    didDrawPage: () => {
      drawHeader();

      const page = doc.getNumberOfPages();
      doc.setFillColor(...DARK_SOFT);
      doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
      doc.setFontSize(8);
      doc.setTextColor(203, 213, 225);
      doc.text(`Total de peças retiradas: ${totalPecas}`, 14, pageHeight - 4.5);
      doc.text(`Página ${page}`, pageWidth - 14, pageHeight - 4.5, { align: "right" });
    },
  });

  doc.save(`relatorio-movimentacao-${format(new Date(), "yyyy-MM-dd")}.pdf`);
};

export const exportToXLSX = (data: Movimentacao[]) => {
  const dark = "FF0F172A"; // slate-900
  const darkSoft = "FF1E293B"; // slate-800
  const primary = "FF0369A1"; // sky-700
  const primaryLight = "FF38BDF8"; // sky-400
  const rowAlt = "FFF0F9FF"; // sky-50
  const rowBase = "FFFFFFFF";
  const borderColor = "FFCBD5E1"; // slate-300

  const headers = [
    "Data",
    "Técnico",
    "Parque",
    "Aerogerador",
    "Código SAP",
    "Descrição da Peça",
    "Quantidade",
    "Work Order",
    "Estoque",
  ];

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
    fill: { patternType: "solid", fgColor: { rgb: darkSoft } },
    alignment: { horizontal: "center", vertical: "center" },
  };
  const headerCell = {
    font: { bold: true, sz: 11, color: { rgb: "FFFFFFFF" }, name: "Calibri" },
    fill: { patternType: "solid", fgColor: { rgb: primary } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border,
  };
  const bodyCell = (alt: boolean, align: "left" | "center", bold = false, color = dark) => ({
    font: { sz: 11, bold, color: { rgb: color }, name: "Calibri" },
    fill: { patternType: "solid", fgColor: { rgb: alt ? rowAlt : rowBase } },
    alignment: { horizontal: align, vertical: "center", wrapText: false },
    border,
  });
  const totalCellStyle = (align: "left" | "center") => ({
    font: { bold: true, sz: 11, color: { rgb: primaryLight }, name: "Calibri" },
    fill: { patternType: "solid", fgColor: { rgb: dark } },
    alignment: { horizontal: align, vertical: "center" },
    border,
  });

  const totalPecas = data.reduce((acc, i) => acc + (Number(i.quantidade) || 0), 0);

  const aoa: (string | number)[][] = [
    ["GESTÃO DE SOBRESSALENTES — RELATÓRIO DE MOVIMENTAÇÃO"],
    [`Gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}  •  ${data.length} registros`],
    headers,
    ...data.map((item) => [
      item.data,
      item.tecnico,
      item.parque,
      item.aero,
      item.sap,
      item.peca,
      Number(item.quantidade) || 0,
      item.wo || "-",
      item.estoque || "-",
    ]),
    ["TOTAL", "", "", "", "", "", totalPecas, "", ""],
  ];

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  const totalCols = headers.length;
  const totalRowIdx = data.length + 3;

  for (let c = 0; c < totalCols; c++) {
    ws[XLSX.utils.encode_cell({ r: 0, c })] = {
      ...titleCell,
      v: c === 0 ? aoa[0]![0] : "",
      t: "s",
    };
    ws[XLSX.utils.encode_cell({ r: 1, c })] = {
      ...subtitleCell,
      v: c === 0 ? aoa[1]![0] : "",
      t: "s",
    };
    ws[XLSX.utils.encode_cell({ r: 2, c })] = { v: headers[c], t: "s", ...headerCell };
  }

  data.forEach((_, i) => {
    const r = i + 3;
    const alt = i % 2 === 1;
    const row = aoa[r]!;
    for (let c = 0; c < totalCols; c++) {
      const centered = c === 3 || c === 4 || c === 6 || c === 7 || c === 8;
      const isNum = c === 6;
      const isSap = c === 4;
      ws[XLSX.utils.encode_cell({ r, c })] = {
        v: row[c],
        t: isNum ? "n" : "s",
        ...bodyCell(alt, centered ? "center" : "left", isSap || isNum, isSap ? primary : dark),
      };
    }
  });

  for (let c = 0; c < totalCols; c++) {
    ws[XLSX.utils.encode_cell({ r: totalRowIdx, c })] = {
      v: c === 0 ? "TOTAL DE PEÇAS" : c === 6 ? totalPecas : "",
      t: c === 6 ? "n" : "s",
      ...totalCellStyle(c === 6 ? "center" : "left"),
    };
  }

  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
    { s: { r: totalRowIdx, c: 0 }, e: { r: totalRowIdx, c: 5 } },
  ];
  ws["!cols"] = [
    { wch: 20 },
    { wch: 26 },
    { wch: 20 },
    { wch: 13 },
    { wch: 14 },
    { wch: 46 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
  ];
  ws["!rows"] = [{ hpt: 32 }, { hpt: 20 }, { hpt: 26 }];
  ws["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { r: 2, c: 0 },
      e: { r: totalRowIdx - 1, c: totalCols - 1 },
    }),
  };
  ws["!freeze"] = { xSplit: 0, ySplit: 3 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Movimentações");

  XLSX.writeFile(wb, `relatorio-movimentacao-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
};
