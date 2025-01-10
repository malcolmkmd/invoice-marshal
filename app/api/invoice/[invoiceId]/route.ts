import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { NextResponse } from 'next/server';
import { standardDateTime } from '../../../utils/dateFormatter';
import prisma from '../../../utils/db';

// Example placeholder logo in Base64 (replace with your actual logo)
// const LOGO_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...';

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
  });

  if (!data) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  }) as jsPDFCustom;

  // Add logo in the top-right corner
  //   pdf.addImage(LOGO_BASE64, 'PNG', 160, 10, 40, 15);

  // Invoice header (top-left corner)
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.text('INVOICE', 10, 20);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice Number: ${data.invoiceNumber}`, 10, 30);
  pdf.text(`Invoice Date: ${standardDateTime(data.date)}`, 10, 35);

  // FROM Section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FROM', 10, 50);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text([data.fromName, `E-MAIL: ${data.fromEmail}`, `ADDRESS: ${data.fromAddress}`], 10, 55);

  // TO Section
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TO', 120, 50);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  pdf.text(
    [data.clientName, `E-MAIL: ${data.clientEmail}`, `ADDRESS: ${data.clientAddress}`],
    120,
    55,
  );

  // Table data preparation
  const tableData = [];
  const descriptions = Array.isArray(data.invoiceItemDescription)
    ? data.invoiceItemDescription
    : [data.invoiceItemDescription];
  const quantities = Array.isArray(data.invoiceItemQuantity)
    ? data.invoiceItemQuantity
    : [data.invoiceItemQuantity];
  const rates = Array.isArray(data.invoiceItemRate) ? data.invoiceItemRate : [data.invoiceItemRate];

  for (let i = 0; i < descriptions.length; i++) {
    const amount = (quantities[i] * rates[i]).toFixed(2);
    tableData.push([
      descriptions[i],
      quantities[i].toString(),
      `${data.currency} ${rates[i].toFixed(2)}`,
      `${data.currency} ${amount}`,
    ]);
  }

  // Render table
  const startY = 70;

  pdf.autoTable({
    startY,
    head: [['Description', 'Quantity', 'Rate', 'Total']],
    body: tableData,
    headStyles: {
      fillColor: [255, 255, 255], // white
      textColor: [0, 0, 0], // Black text for the header
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center', // Center align header text
    },
    bodyStyles: {
      fillColor: [255, 255, 255], // white
      textColor: [0, 0, 0], // Black text for the body
      lineColor: [255, 255, 255], // Light gray borders
      lineWidth: 0.25,
      cellPadding: 4, // Add spacing within cells
    },
    styles: {
      fontSize: 10, // Font size for the table content
      cellPadding: 4, // Padding for cells
    },
    columnStyles: {
      0: { cellWidth: 70, halign: 'center' }, // DESCRIPTION
      1: { cellWidth: 30, halign: 'center' }, // QTY
      2: { cellWidth: 40, halign: 'center' }, // UNIT PRICE
      3: { cellWidth: 40, halign: 'right' }, // TOTAL
    },
  });

  // Add totals section
  const rightMargin = 200; // Right edge of A4 paper
  const tableHeight = startY + tableData.length * 10; // Dynamically calculate table height

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(`Total: ${data.currency} ${data.total.toFixed(2)}`, rightMargin - 10, tableHeight + 30, {
    align: 'right',
  });

  // Banking details section
  const bankingDetailsY = tableHeight + 40;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Banking Details:', 10, bankingDetailsY);
  pdf.setFont('helvetica', 'italic');
  pdf.text(
    [
      'Bank: FNB',
      `Account Name: ${data.clientName}`,
      'Account Number: 123456789',
      'Branch Code: 250655',
      `Reference: INV-${data.invoiceNumber}`,
    ],
    10,
    bankingDetailsY + 5,
  );

  // Note about due date and payment
  const noteY = bankingDetailsY + 35;
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.text(
    `Note: Payment is due by ${data.dueDate}. Please ensure timely payment to avoid any penalties.`,
    10,
    noteY,
  );

  // Thank you message
  const thankYouY = noteY + 20;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Thank you for your business!', 105, thankYouY, { align: 'center' });

  // Generate PDF buffer
  const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
  return new NextResponse(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    },
  });
}
