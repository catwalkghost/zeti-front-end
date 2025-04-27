/** 
 * Type declaration file for jspdf-autotable
 * Provides TypeScript support for jspdf-autotable's extensions to the jsPDF object
 */

import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    /**
     * Auto-table plugin for generating tables
     */
    autoTable: (options: AutoTableOptions) => void;
    
    /**
     * Export table to CSV
     */
    tableToCSV: (table: HTMLTableElement) => string;
    
    /**
     * Export table to Excel (XLSX)
     */
    tableToXLSX: (table: HTMLTableElement, filename?: string) => string;
    
    /**
     * Extended output method that adds blob format support
     */
    output(type: 'blob'): Blob;
  }
}

interface AutoTableStyles {
  fillColor?: number[];
  textColor?: number;
  fontSize?: number;
  fontStyle?: string;
  overflow?: string;
  halign?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  lineWidth?: number;
  lineColor?: number[];
  cellPadding?: number;
}

interface AutoTableOptions {
  head?: any[][];
  body?: any[][];
  foot?: any[][];
  startY?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  pageBreak?: 'auto' | 'avoid';
  rowPageBreak?: 'auto' | 'avoid';
  tableWidth?: 'auto' | 'wrap' | number;
  theme?: 'striped' | 'grid' | 'plain';
  styles?: AutoTableStyles;
  headStyles?: AutoTableStyles;
  bodyStyles?: AutoTableStyles;
  footStyles?: AutoTableStyles;
  alternateRowStyles?: AutoTableStyles;
  columnStyles?: { [key: number]: AutoTableStyles };
  willDrawCell?: (data: any) => void;
  didDrawCell?: (data: any) => void;
  didDrawPage?: (data: any) => void;
} 