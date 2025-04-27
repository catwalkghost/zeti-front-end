import { Bill } from "../Types";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import dayjs from 'dayjs';
import { FILE_FORMATS } from "../Constants";

// This component has written with the help from the AI due to time constraints
// This can be reviewed and optimised manually

/**
 * Formats a date string in UK format (DD/MM/YYYY HH:mm)
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
const formatUKDate = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

/**
 * Formats a currency value with 2 decimal places
 * @param value - The numeric value
 * @returns Formatted currency string with £ symbol and 2 decimal places
 */
const formatCurrency = (value: number): string => {
  return `£${value.toFixed(2)}`;
};

/**
 * Supported bill output formats
 */
export enum BillFormat {
  JSON = "json",
  CSV = "csv",
  PDF = "pdf",
  HTML = "html",
  TEXT = "text",
  XML = "xml",
}

/**
 * Utility class for formatting bills in different formats
 */
export class BillFormatter {
  /**
   * Formats a bill as a JSON string
   * @param bill - The bill to format
   * @returns Formatted bill as a JSON string
   */
  public static formatAsJson(bill: Bill): string {
    // Format dates in the bill before converting to JSON
    const formattedBill = {
      ...bill,
      billingPeriodStart: formatUKDate(bill.billingPeriodStart),
      billingPeriodEnd: formatUKDate(bill.billingPeriodEnd),
      costPerMile: parseFloat(bill.costPerMile.toFixed(2)),
      totalCost: parseFloat(bill.totalCost.toFixed(2)),
      generatedAt: formatUKDate(bill.generatedAt),
      vehicles: bill.vehicles.map((vehicle: any) => ({
        ...vehicle,
        cost: parseFloat(vehicle.cost.toFixed(2)),
        // Format dates in vehicle state if present
        state: vehicle.state ? {
          ...vehicle.state,
          asAt: formatUKDate(vehicle.state.asAt)
        } : null
      }))
    };
    
    return JSON.stringify(formattedBill, null, 2);
  }

  /**
   * Formats a bill as CSV
   * @param bill - The bill to format
   * @returns Formatted bill as CSV
   */
  public static formatAsCsv(bill: Bill): string {
    const summary = `Customer,${bill.customerName}\nBilling Period,${formatUKDate(bill.billingPeriodStart)} to ${formatUKDate(bill.billingPeriodEnd)}\nTotal Miles,${bill.totalMiles}\nCost Per Mile (GBP),${bill.costPerMile.toFixed(2)}\nTotal Cost (GBP),${bill.totalCost.toFixed(2)}\n\n`;
    
    const header = "License Plate,VIN,Make,Model,Start Odometer (miles),End Odometer (miles),Miles Travelled,Cost (GBP)\n";
    
    const rows = bill.vehicles.map((vehicle: any) => 
      `${vehicle.licensePlate},${vehicle.vin},${vehicle.make},${vehicle.model},${vehicle.startOdometerMiles},${vehicle.endOdometerMiles},${vehicle.milesTravelled},${vehicle.cost.toFixed(2)}`
    ).join("\n");
    
    const footer = `\nGenerated on,${formatUKDate(bill.generatedAt)}`;
    
    return summary + header + rows + footer;
  }

  /**
   * Creates a PDF document for the bill
   * @param bill - The bill to format
   * @returns PDF document as a Blob
   */
  public static createPdf(bill: Bill): Blob {
    try {
      // Calculate total miles
      const totalMiles = bill.vehicles.reduce((sum: number, vehicle: any) => 
        sum + (vehicle.endMileage - vehicle.startMileage), 0);
        
      const doc = new jsPDF();
      
      doc.setProperties({
        title: 'Vehicle Usage Bill',
        subject: 'Bill for Bob\'s Taxis',
        author: 'Zeti Vehicle Billing System',
        creator: 'Zeti'
      });

      const GOLD_COLOR = [212, 175, 55];
      const PRIMARY_TEXT = [17, 24, 39];
      
      doc.setFontSize(20);
      doc.setTextColor(PRIMARY_TEXT[0], PRIMARY_TEXT[1], PRIMARY_TEXT[2]);
      doc.text(`Vehicle Usage Bill`, 14, 22);
      
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128); // Secondary text color
      doc.text(`Bob's Taxis`, 14, 30);
      
      doc.setFontSize(14);
      doc.setTextColor(PRIMARY_TEXT[0], PRIMARY_TEXT[1], PRIMARY_TEXT[2]);
      doc.text('Bill Overview', 14, 42);
      
      const summaryData = [
        ['Billing Period:', `${formatUKDate(bill.billingPeriodStart)} to ${formatUKDate(bill.billingPeriodEnd)}`],
        ['Total Miles:', `${totalMiles.toLocaleString()}`],
        ['Cost Per Mile:', `£${bill.costPerMile.toFixed(3)}`],
        ['Total Cost:', formatCurrency(bill.totalCost)],
      ];
      
      try {
        // @ts-ignore - autoTable is added by jspdf-autotable import
        doc.autoTable({
          body: summaryData,
          startY: 46,
          theme: 'plain',
          styles: { 
            fontSize: 12,
            cellPadding: 4,
          },
          columnStyles: {
            0: { fontStyle: 'bold', textColor: [31, 41, 55] as any },
            1: { halign: 'left' },
          },
          tableWidth: 'auto',
        });
      } catch (error) {
        console.error("Error creating summary table:", error);
        
        // Fallback for summary
        let y = 46;
        summaryData.forEach(row => {
          doc.text(`${row[0]} ${row[1]}`, 14, y);
          y += 8;
        });
      }
      
      let startY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 15 : 80;
      
      // Add vehicle details heading
      doc.setFontSize(14);
      doc.setTextColor(PRIMARY_TEXT[0], PRIMARY_TEXT[1], PRIMARY_TEXT[2]);
      doc.text('Vehicle Details', 14, startY);
      startY += 10;
      
      // Define table columns and rows
      const columns = [
        "Registration", "Make", "Model", 
        "Start Miles", "End Miles", "Miles Driven", "Cost"
      ];
      
      const tableRows = bill.vehicles.map((vehicle: any) => {
        const milesDriven = vehicle.endMileage - vehicle.startMileage;
        return [
          vehicle.registration,
          vehicle.make,
          vehicle.model,
          vehicle.startMileage.toLocaleString(),
          vehicle.endMileage.toLocaleString(),
          milesDriven.toLocaleString(),
          formatCurrency(vehicle.cost)
        ];
      });
      
      // Add footer row with totals
      tableRows.push(['', '', '', '', 'Total:', totalMiles.toLocaleString(), formatCurrency(bill.totalCost)]);
      
      // Add the table to the PDF
      try {
        // @ts-ignore - autoTable is added by jspdf-autotable import
        doc.autoTable({
          head: [columns],
          body: tableRows,
          startY: startY,
          theme: 'striped',
          headStyles: { 
            fillColor: GOLD_COLOR, 
            textColor: [255, 255, 255] as any,
            fontStyle: 'bold'
          },
          footStyles: { 
            fillColor: [249, 250, 251], 
            textColor: PRIMARY_TEXT as any,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251]
          },
          styles: {
            fontSize: 10,
            cellPadding: 6,
          },
        });
      } catch (error) {
        console.error("Error creating table:", error);
        
        // Fallback method if autoTable fails
        doc.text("Vehicle Details:", 14, startY);
        let y = startY + 10;
        
        bill.vehicles.forEach((vehicle: any) => {
          const milesDriven = vehicle.endMileage - vehicle.startMileage;
          doc.text(`${vehicle.make} ${vehicle.model} (${vehicle.registration})`, 20, y);
          y += 8;
          doc.text(`Miles: ${milesDriven.toLocaleString()} (${formatCurrency(vehicle.cost)})`, 25, y);
          y += 12;
        });
        
        doc.text(`Total Miles: ${totalMiles.toLocaleString()}`, 14, y);
        y += 8;
        doc.text(`Total Cost: ${formatCurrency(bill.totalCost)}`, 14, y);
      }
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(156, 163, 175); // Text disabled color
        doc.text(`Generated on: ${formatUKDate(bill.generatedAt)} - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
      }
      
      // Return as blob
      return doc.output('blob');
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Formats a bill as PDF
   * Returns a data URL for the PDF
   * @param bill - The bill to format
   * @returns Promise that resolves to a data URL for the PDF
   */
  public static async formatAsPdf(bill: Bill): Promise<string> {
    try {
      const blob = BillFormatter.createPdf(bill);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error formatting PDF:", error);
      throw error;
    }
  }

  /**
   * Formats a bill as HTML
   * @param bill - The bill to format
   * @returns Formatted bill as HTML
   */
  public static formatAsHtml(bill: Bill): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill for ${bill.customerName}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              color: #333;
              box-sizing: border-box;
              width: 100%;
            }
            h1, h2, h3 { color: #2980b9; }
            .container {
              width: 100%;
              max-width: 100%;
              overflow-x: hidden;
              padding: 20px;
              box-sizing: border-box;
            }
            .info-panel { 
              background-color: #f8f9fa; 
              padding: 15px; 
              border-radius: 5px; 
              margin-bottom: 20px; 
            }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 20px 0; 
              table-layout: auto;
            }
            .responsive-table {
              width: 100%;
              overflow-x: auto;
            }
            th, td { 
              padding: 12px 8px; 
              text-align: left; 
              border: 1px solid #ddd; 
            }
            th { background-color: #2980b9; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            tfoot { font-weight: bold; background-color: #2980b9; color: white; }
            .summary { 
              margin-bottom: 30px; 
              background-color: #f8f9fa; 
              padding: 15px; 
              border-radius: 5px; 
              width: 100%; 
              box-sizing: border-box;
            }
            .summary table { 
              width: 100%; 
              margin: 0; 
              border: none; 
            }
            .summary table tr:nth-child(even) { background-color: transparent; }
            .summary table td { border: none; padding: 8px 15px; }
            .summary table td:first-child { font-weight: bold; width: 150px; }
            .vehicle-section { margin-top: 20px; width: 100%; }
            .footer { 
              margin-top: 30px; 
              font-size: 0.8em; 
              color: #777; 
              text-align: center; 
              border-top: 1px solid #eee; 
              padding-top: 10px; 
            }
            
            /* Responsive styles */
            @media screen and (max-width: 768px) {
              .summary table td:first-child { width: auto; }
              th, td { padding: 8px 4px; font-size: 0.9em; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Vehicle Usage Bill</h1>
            <h2>${bill.customerName}</h2>
            
            <div class="summary">
              <h3>Summary</h3>
              <table>
                <tr><td>Billing Period:</td><td>${formatUKDate(bill.billingPeriodStart)} to ${formatUKDate(bill.billingPeriodEnd)}</td></tr>
                <tr><td>Total Miles:</td><td>${bill.totalMiles}</td></tr>
                <tr><td>Cost Per Mile:</td><td>${formatCurrency(bill.costPerMile)}</td></tr>
                <tr><td>Total Cost:</td><td>${formatCurrency(bill.totalCost)}</td></tr>
              </table>
            </div>
            
            <div class="vehicle-section">
              <h3>Vehicle Details</h3>
              <div class="responsive-table">
                <table>
                  <thead>
                    <tr>
                      <th>License Plate</th>
                      <th>VIN</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Start Odometer</th>
                      <th>End Odometer</th>
                      <th>Miles</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${bill.vehicles.map((vehicle: any) => `
                      <tr>
                        <td>${vehicle.licensePlate}</td>
                        <td>${vehicle.vin}</td>
                        <td>${vehicle.make}</td>
                        <td>${vehicle.model}</td>
                        <td>${vehicle.startOdometerMiles}</td>
                        <td>${vehicle.endOdometerMiles}</td>
                        <td>${vehicle.milesTravelled}</td>
                        <td>${formatCurrency(vehicle.cost)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="6" style="text-align: right;"><strong>Total:</strong></td>
                      <td><strong>${bill.totalMiles}</strong></td>
                      <td><strong>${formatCurrency(bill.totalCost)}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <div class="footer">
              <p>Generated on: ${formatUKDate(bill.generatedAt)}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Formats a bill as plain text
   * @param bill - The bill to format
   * @returns Formatted bill as plain text
   */
  public static formatAsText(bill: Bill): string {
    // Plain text representation
    let text = `
VEHICLE USAGE BILL
=================
${bill.customerName}
=================

SUMMARY:
Total Miles: ${bill.totalMiles}
Total Cost: ${formatCurrency(bill.totalCost)}
Billing Period: ${formatUKDate(bill.billingPeriodStart)} to ${formatUKDate(bill.billingPeriodEnd)}
Cost Per Mile: ${formatCurrency(bill.costPerMile)}

VEHICLE DETAILS:
`;

    // Add vehicle details
    bill.vehicles.forEach((vehicle: any) => {
      text += `
-------------------------------
License Plate: ${vehicle.licensePlate}
VIN: ${vehicle.vin}
Make/Model: ${vehicle.make} ${vehicle.model}
Start Odometer: ${vehicle.startOdometerMiles} miles
End Odometer: ${vehicle.endOdometerMiles} miles
Miles Travelled: ${vehicle.milesTravelled} miles
Cost: ${formatCurrency(vehicle.cost)}
-------------------------------
`;
    });

    text += `
Generated on: ${formatUKDate(bill.generatedAt)}
`;

    return text;
  }

  /**
   * Formats a bill as XML
   * @param bill - The bill to format
   * @returns Formatted bill as XML
   */
  public static formatAsXml(bill: Bill): string {
    // XML representation with proper escaping
    const escapeXml = (str: string | undefined) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<bill>
  <customerName>${escapeXml(bill.customerName)}</customerName>
  <billingPeriod>
    <start>${formatUKDate(bill.billingPeriodStart)}</start>
    <end>${formatUKDate(bill.billingPeriodEnd)}</end>
  </billingPeriod>
  <totalMiles>${bill.totalMiles}</totalMiles>
  <costPerMile>${bill.costPerMile.toFixed(3)}</costPerMile>
  <totalCost>${bill.totalCost.toFixed(2)}</totalCost>
  <generatedAt>${formatUKDate(bill.generatedAt)}</generatedAt>
  <vehicles>`;

    // Add vehicle details
    bill.vehicles.forEach((vehicle: any) => {
      xml += `    <vehicle>
      <licensePlate>${escapeXml(vehicle.licensePlate)}</licensePlate>
      <vin>${escapeXml(vehicle.vin)}</vin>
      <make>${escapeXml(vehicle.make)}</make>
      <model>${escapeXml(vehicle.model)}</model>
      <startOdometerMiles>${vehicle.startOdometerMiles}</startOdometerMiles>
      <endOdometerMiles>${vehicle.endOdometerMiles}</endOdometerMiles>
      <milesTravelled>${vehicle.milesTravelled}</milesTravelled>
      <cost>${vehicle.cost.toFixed(2)}</cost>
    </vehicle>
`;
    });

    xml += `  </vehicles>
</bill>`;

    return xml;
  }

  /**
   * Get file extension and MIME type for a given format
   * @param format - The bill format
   * @returns Object with extension and mimeType
   */
  public static getFileInfo(format: BillFormat): { extension: string, mimeType: string } {
    switch (format) {
      case BillFormat.JSON:
        return FILE_FORMATS.JSON;
      case BillFormat.CSV:
        return FILE_FORMATS.CSV;
      case BillFormat.PDF:
        return FILE_FORMATS.PDF;
      case BillFormat.HTML:
        return FILE_FORMATS.HTML;
      case BillFormat.XML:
        return FILE_FORMATS.XML;
      case BillFormat.TEXT:
      default:
        return FILE_FORMATS.TEXT;
    }
  }

  /**
   * Format a bill in the specified format
   * @param bill - The bill to format
   * @param format - The desired output format
   * @returns Promise that resolves to the formatted bill in the specified format
   */
  public static async formatBill(bill: Bill, format: BillFormat): Promise<string> {
    try {
      switch (format) {
        case BillFormat.JSON:
          return BillFormatter.formatAsJson(bill);
        case BillFormat.CSV:
          return BillFormatter.formatAsCsv(bill);
        case BillFormat.PDF:
          return await BillFormatter.formatAsPdf(bill);
        case BillFormat.HTML:
          return BillFormatter.formatAsHtml(bill);
        case BillFormat.XML:
          return BillFormatter.formatAsXml(bill);
        case BillFormat.TEXT:
          return BillFormatter.formatAsText(bill);
        default:
          // Default to JSON if an unsupported format is requested
          console.warn(`Unsupported format: ${format}, defaulting to JSON`);
          return BillFormatter.formatAsJson(bill);
      }
    } catch (error) {
      console.error(`Error formatting bill as ${format}:`, error);
      throw error;
    }
  }
} 