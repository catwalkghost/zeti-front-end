import { describe, it, expect } from 'vitest';
import { BillFormatter, BillFormat } from '../Lib/Utils/BillFormatter'; 
import type { Bill } from '../Types';

describe('BillFormatter', () => {
  const sampleBill: Bill = {
    billingPeriodStart: '2021-02-01T00:00:00Z',
    billingPeriodEnd: '2021-02-28T23:59:00Z',
    customerName: 'Bob\'s Taxis',
    totalMiles: 1250,
    costPerMile: 0.207,
    totalCost: 258.75,
    generatedAt: '2023-04-25T14:30:00Z',
    vehicles: [
      {
        registration: 'CBDH 789',
        licensePlate: 'CBDH 789',
        vin: 'JH4DB7540SS801338',
        make: 'Toyota',
        model: 'Corolla',
        startMileage: 12500,
        endMileage: 13200,
        milesTravelled: 700,
        cost: 144.9,
        startOdometerMiles: 12500,
        endOdometerMiles: 13200
      },
      {
        registration: '86532 AZE',
        licensePlate: '86532 AZE',
        vin: 'JTHBJ46G992339158',
        make: 'Ford',
        model: 'Fiesta',
        startMileage: 8000,
        endMileage: 8550,
        milesTravelled: 550,
        cost: 113.85,
        startOdometerMiles: 8000,
        endOdometerMiles: 8550
      }
    ]
  };

  describe('getFileInfo', () => {
    it('returns correct info for PDF format', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.PDF);
      expect(extension).toBe('pdf');
      expect(mimeType).toBe('application/pdf');
    });

    it('returns correct info for CSV format', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.CSV);
      expect(extension).toBe('csv');
      expect(mimeType).toBe('text/csv');
    });

    it('returns correct info for JSON format', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.JSON);
      expect(extension).toBe('json');
      expect(mimeType).toBe('application/json');
    });

    it('returns correct info for HTML format', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.HTML);
      expect(extension).toBe('html');
      expect(mimeType).toBe('text/html');
    });

    it('returns correct info for TEXT format', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.TEXT);
      expect(extension).toBe('txt');
      expect(mimeType).toBe('text/plain');
    });
  });

  describe('formatBill', () => {
    it('formats bill as JSON correctly', async () => {
      const formatted = await BillFormatter.formatBill(sampleBill, BillFormat.JSON);
      
      // Parse it back to verify structure
      const parsed = JSON.parse(formatted);
      expect(parsed.customerName).toBe('Bob\'s Taxis');
      expect(parsed.totalMiles).toBe(1250);
      expect(parsed.vehicles.length).toBe(2);
      expect(parsed.vehicles[0].make).toBe('Toyota');
    });

    it('formats bill as CSV correctly', async () => {
      const formatted = await BillFormatter.formatBill(sampleBill, BillFormat.CSV);
      
      // CSV should have header row and vehicle data
      const lines = formatted.trim().split('\n');
      expect(lines.length).toBeGreaterThan(2); // At least header + 2 vehicles
      
      // Check if it contains key data points
      expect(formatted).toContain('Toyota');
      expect(formatted).toContain('Corolla');
      expect(formatted).toContain('Ford');
      expect(formatted).toContain('Fiesta');
    });

    it('formats bill as text correctly', async () => {
      const formatted = await BillFormatter.formatBill(sampleBill, BillFormat.TEXT);
      
      // Plain text should contain company name and basic details
      expect(formatted).toContain('Bob\'s Taxis');
      expect(formatted).toContain('VEHICLE USAGE BILL');
      expect(formatted).toContain('CBDH 789');
      expect(formatted).toContain('86532 AZE');
    });

    it('formats bill as HTML correctly', async () => {
      const formatted = await BillFormatter.formatBill(sampleBill, BillFormat.HTML);
      
      expect(formatted).toContain('<!DOCTYPE html>');
      expect(formatted).toContain('<title>Bill for Bob\'s Taxis</title>');
      expect(formatted).toContain('Vehicle Usage Bill');
    });

    it('creates a PDF data URL', async () => {
      const formatted = await BillFormatter.formatBill(sampleBill, BillFormat.PDF);
      expect(formatted.startsWith('data:application/pdf;base64,')).toBe(true);
      expect(formatted.length).toBeGreaterThan(1000); // PDF should have a substantial size
    });
  });
}); 