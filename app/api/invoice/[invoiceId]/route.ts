import { readFileSync } from 'fs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';
import { NextResponse } from 'next/server';
import path from 'path';
import { standardDate } from '../../../utils/dateFormatter';
import prisma from '../../../utils/db';

// Example placeholder logo in Base64 (replace with your actual logo)
// const LOGO_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...';

interface jsPDFCustom extends jsPDF {
  autoTable: (options: UserOptions) => void;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ invoiceId: string }> },
) {
  try {
    const { invoiceId } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        items: true,
        user: {
          select: {
            email: true,
            address: true,
            businessName: true,
            bankName: true,
            bankAccountName: true,
            accountNumber: true,
            branchCode: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Update data object to get client info directly from invoice
    const data = {
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.createdAt,
      dueDate: invoice.dueDate,
      fromName: invoice.user?.businessName,
      fromEmail: invoice.user?.email,
      fromAddress: invoice.user?.address,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientAddress: invoice.clientAddress,
      note: invoice.note,
      items: invoice.items,
      total: invoice.total,
      bankName: invoice.user?.bankName || '',
      bankAccountName: invoice.user?.bankAccountName || '',
      accountNumber: invoice.user?.accountNumber || '',
      branchCode: invoice.user?.branchCode || '',
    };

    // Read and convert logo to base64
    const logoPath = path.join(process.cwd(), 'public', 'kumwenda-inc.png');
    const logoBase64 = readFileSync(logoPath).toString('base64');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    }) as jsPDFCustom;

    const logoWidth = 100; // adjust size as needed
    const logoHeight = 25; // adjust size as needed
    pdf.addImage(logoBase64, 'PNG', 100, 10, logoWidth, logoHeight);

    // Y position variables
    const headerY = 35;
    const invoiceDetailsY = 55;
    const fromToSectionY = 75;

    // Calculate table Y position dynamically
    const tableY = Math.max(
      fromToSectionY + 15 + (data.fromAddress?.split(',').length * 5 || 0),
      fromToSectionY + 15 + (data.clientAddress?.split(',').length * 5 || 0),
    );

    // Calculate banking details Y position based on table
    const bankingY = tableY + data.items.length * 10 + 45;
    const noteY = bankingY + 40;
    const thankYouY = noteY + 30;

    // Header section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(26);
    pdf.text('INVOICE', 10, headerY);

    // Invoice details section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Invoice Number: ${data.invoiceNumber}`, 10, invoiceDetailsY);
    pdf.text(`Invoice Date: ${standardDate(data.date)}`, 10, invoiceDetailsY + 5);

    // FROM Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FROM', 10, fromToSectionY);

    pdf.setFontSize(12);
    const fromAddressLines = (data.fromAddress ?? '').split(',').map((line) => line.trim());

    // Add business name
    pdf.setFont('helvetica', 'italic');
    pdf.text(data.fromName ?? '', 10, fromToSectionY + 5);

    // Add email line with mixed formatting
    pdf.setFont('helvetica', 'bold');
    pdf.text('E-MAIL:', 10, fromToSectionY + 10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(data.fromEmail ?? '', 35, fromToSectionY + 10);

    // Add address lines
    pdf.setFont('helvetica', 'bold');
    pdf.text('ADDRESS:', 10, fromToSectionY + 15);
    pdf.setFont('helvetica', 'italic');
    fromAddressLines.forEach((line, index) => {
      pdf.text(line, 35, fromToSectionY + 15 + index * 5);
    });

    // TO Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TO', 110, fromToSectionY);

    pdf.setFontSize(12);
    const toAddressLines = (data.clientAddress ?? '').split(',').map((line) => line.trim());

    // Add client name
    pdf.setFont('helvetica', 'italic');
    pdf.text(data.clientName ?? '', 110, fromToSectionY + 5);

    // Add email line with mixed formatting
    pdf.setFont('helvetica', 'bold');
    pdf.text('E-MAIL:', 110, fromToSectionY + 10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(data.clientEmail ?? '', 135, fromToSectionY + 10);

    // Add address lines
    pdf.setFont('helvetica', 'bold');
    pdf.text('ADDRESS:', 110, fromToSectionY + 15);
    pdf.setFont('helvetica', 'italic');
    toAddressLines.forEach((line, index) => {
      pdf.text(line, 135, fromToSectionY + 15 + index * 5);
    });

    // Table data preparation
    const tableData = [];
    const descriptions = data.items.map((item) => item.description);
    const quantities = data.items.map((item) => item.quantity);
    const rates = data.items.map((item) => item.rate);

    for (let i = 0; i < descriptions.length; i++) {
      const amount = (quantities[i] * rates[i]).toFixed(2);
      tableData.push([
        descriptions[i],
        quantities[i].toString(),
        `R ${rates[i].toFixed(2)}`,
        `R ${amount}`,
      ]);
    }

    // Render table
    pdf.autoTable({
      startY: tableY,
      head: [['Description', 'Quantity', 'Rate', 'Total']],
      body: tableData,
      headStyles: {
        fillColor: [255, 255, 255], // white
        textColor: [0, 0, 0], // Black text for the header
        fontStyle: 'bold',
        fontSize: 12,
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
        fontSize: 12, // Font size for the table content
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
    const tableHeight = tableY + tableData.length * 10; // Dynamically calculate table height

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(`Total: R ${data.total.toFixed(2)}`, rightMargin - 10, tableHeight + 30, {
      align: 'right',
    });

    // Banking details section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Banking Details:', 10, bankingY);

    // Bank details with consistent spacing
    pdf.setFont('helvetica', 'italic');
    const bankingFields = [
      { label: 'Bank:', value: data.bankName },
      { label: 'Account Name:', value: data.bankAccountName },
      { label: 'Account Number:', value: data.accountNumber },
      { label: 'Branch Code:', value: data.branchCode },
      { label: 'Reference:', value: `${data.invoiceNumber} or Your Name & Surname` },
    ];

    bankingFields.forEach((field, index) => {
      const yPos = bankingY + 6 * (index + 1);
      pdf.setFont('helvetica', 'italic');
      pdf.text(field.label, 10, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(field.value ?? '', 50, yPos);
    });

    // Note section
    pdf.setFont('helvetica', 'italic');
    pdf.text(
      `Note: Payment is due by ${standardDate(data.dueDate)}. Please ensure timely payment to avoid any penalties.`,
      10,
      noteY,
    );
    pdf.text(data.note ?? '', 10, noteY + 5);

    // Thank you message
    pdf.setFontSize(14);
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
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate invoice PDF' }, { status: 500 });
  }
}
