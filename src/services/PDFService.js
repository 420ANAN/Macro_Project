import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const PDFService = {
  generatePurchaseOrder: (customer, items) => {
    const doc = new jsPDF();
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const date = new Date().toLocaleDateString();

    // Header
    doc.setFillColor(227, 122, 34); // Primary Orange
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text("MACO INDIA PVT. LTD.", 15, 25);
    
    doc.setFontSize(10);
    doc.text("Purchase Order Document", 15, 33);
    
    // Customer Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 15, 55);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${customer.username || 'N/A'}`, 15, 62);
    doc.text(`Email: ${customer.email || 'N/A'}`, 15, 69);
    doc.text(`Date: ${date}`, 150, 62);

    // Table
    const tableData = items.map((item, index) => [
      index + 1,
      item.name,
      item.size,
      item.qty,
      item.uom,
      `Rs. ${item.price}`,
      `Rs. ${item.total}`
    ]);

    doc.autoTable({
      startY: 80,
      head: [['Sr.', 'Item Name', 'Size', 'Qty', 'UOM', 'Rate', 'Total']],
      body: tableData,
      headStyles: { fillColor: [227, 122, 34] },
      margin: { left: 15, right: 15 },
      styles: { fontSize: 10 }
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total: Rs. ${totalAmount}`, 150, finalY, { align: 'right' });

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer generated Purchase Order and does not require a signature.", 15, 280);

    doc.save(`PO_${date.replace(/\//g, '-')}.pdf`);
  }
};
