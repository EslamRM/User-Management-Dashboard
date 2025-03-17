import { saveAs } from "file-saver";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function useExport() {
  const exportToCSV = (data: any[], filename = "export.csv") => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  const exportToPDF = (
    data: any[],
    columns: string[],
    filename = "export.pdf"
  ) => {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [columns],
      body: data.map((row) => columns.map((col) => row[col])),
    });

    doc.save(filename);
  };

  return { exportToCSV, exportToPDF };
}
