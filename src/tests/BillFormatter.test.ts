import { describe, it, expect } from 'vitest';
import { BillFormatter, BillFormat } from '../utils/BillFormatter';

// Mock bill data for testing
const mockBill = {
  billingPeriodStart: '2021-02-01T00:00:00Z',
  billingPeriodEnd: '2021-02-28T23:59:00Z', 
  costPerMile: 0.25,
  totalCost: 75.0,
  generatedAt: '2021-03-01T12:00:00Z',
  customerName: "Bob's Taxis",
  totalMiles: 300,
  vehicles: [
    {
      licensePlate: 'CBDH 789',
      vin: 'abcd123',
      make: 'Jaguar',
      model: 'IPace',
      startOdometerMiles: 12000,
      endOdometerMiles: 12100,
      milesTravelled: 100,
      cost: 25.0,
      registration: 'CBDH 789',
      startMileage: 12000,
      endMileage: 12100,
    },
    {
      licensePlate: '86532 AZE',
      vin: 'xyz12345',
      make: 'Tesla',
      model: '3',
      startOdometerMiles: 30000,
      endOdometerMiles: 30200,
      milesTravelled: 200,
      cost: 50.0,
      registration: '86532 AZE',
      startMileage: 30000,
      endMileage: 30200,
    }
  ]
};

describe('BillFormatter', () => {
  describe('getFileInfo', () => {
    it('should return the correct extension and mime type for PDF', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.PDF);
      expect(extension).toBe('pdf');
      expect(mimeType).toBe('application/pdf');
    });

    it('should return the correct extension and mime type for CSV', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.CSV);
      expect(extension).toBe('csv');
      expect(mimeType).toBe('text/csv');
    });

    it('should return the correct extension and mime type for JSON', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.JSON);
      expect(extension).toBe('json');
      expect(mimeType).toBe('application/json');
    });

    it('should return the correct extension and mime type for XML', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.XML);
      expect(extension).toBe('xml');
      expect(mimeType).toBe('application/xml');
    });

    it('should return the correct extension and mime type for HTML', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.HTML);
      expect(extension).toBe('html');
      expect(mimeType).toBe('text/html');
    });

    it('should return the correct extension and mime type for TEXT', () => {
      const { extension, mimeType } = BillFormatter.getFileInfo(BillFormat.TEXT);
      expect(extension).toBe('txt');
      expect(mimeType).toBe('text/plain');
    });
  });

  describe('formatAsJson', () => {
    it('should format bill as JSON', () => {
      const result = BillFormatter.formatAsJson(mockBill);
      expect(typeof result).toBe('string');
      
      const parsedResult = JSON.parse(result);
      expect(parsedResult.customerName).toBe("Bob's Taxis");
      expect(parsedResult.totalCost).toBe(75);
      expect(parsedResult.vehicles.length).toBe(2);
    });
  });

  describe('formatAsCsv', () => {
    it('should format bill as CSV', () => {
      const result = BillFormatter.formatAsCsv(mockBill);
      expect(typeof result).toBe('string');
      expect(result).toContain('Customer,Bob\'s Taxis');
      expect(result).toContain('Total Miles,300');
      expect(result).toContain('License Plate,VIN,Make,Model');
      expect(result).toContain('CBDH 789,abcd123,Jaguar,IPace');
    });
  });

  describe('formatAsXml', () => {
    it('should format bill as XML', () => {
      const result = BillFormatter.formatAsXml(mockBill);
      expect(typeof result).toBe('string');
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain('<customerName>Bob&apos;s Taxis</customerName>');
      expect(result).toContain('<totalMiles>300</totalMiles>');
      expect(result).toContain('<licensePlate>CBDH 789</licensePlate>');
    });
  });

  describe('formatAsText', () => {
    it('should format bill as plain text', () => {
      const result = BillFormatter.formatAsText(mockBill);
      expect(typeof result).toBe('string');
      expect(result).toContain('VEHICLE USAGE BILL');
      expect(result).toContain('Bob\'s Taxis');
      expect(result).toContain('Total Miles: 300');
      expect(result).toContain('License Plate: CBDH 789');
    });
  });
}); 