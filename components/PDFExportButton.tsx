'use client';

import React from 'react';

// Uses html2canvas + jsPDF (install them: npm i html2canvas jspdf)
export default function PDFExportButton({ elementId = 'note-content', filename = 'note.pdf' }: { elementId?: string; filename?: string }) {
  const handleExport = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const el = document.getElementById(elementId);
      if (!el) {
        alert('Note content element not found.');
        return;
      }
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (err) {
      console.error(err);
      alert('Failed to export PDF.');
    }
  };

  return (
    <button onClick={handleExport} className="px-3 py-1 rounded bg-blue-600 text-white">
      Export PDF
    </button>
  );
}
