/**
 * API URLs
 */
// Base API URL
export const API_BASE_URL = "https://funczetiinterviewtest.azurewebsites.net";
// API endpoint for vehicles
export const API_VEHICLES_ENDPOINT = "/api/vehicles";
// API endpoint for vehicle history
export const API_VEHICLES_HISTORY_ENDPOINT = "/api/vehicles/history";
// CORS proxy URL
export const CORS_PROXY = "https://api.allorigins.win/raw?url=";

/**
 * Bob's Taxis Information
 */
// Bob's Taxis license plates for filtering
export const BOBS_TAXIS_LICENSE_PLATES = ["CBDH 789", "86532 AZE"];
// Company name
export const COMPANY_NAME = "Bob's Taxis";

/**
 * Fixed billing period dates
 */
export const BILLING_PERIOD_START = "2021-02-01T00:00:00Z";
export const BILLING_PERIOD_END = "2021-02-28T23:59:00Z";

/**
 * File format information
 */
export const FILE_FORMATS = {
  PDF: {
    id: "pdf",
    mimeType: "application/pdf",
    extension: "pdf"
  },
  JSON: {
    id: "json",
    mimeType: "application/json",
    extension: "json"
  },
  CSV: {
    id: "csv",
    mimeType: "text/csv",
    extension: "csv"
  },
  HTML: {
    id: "html",
    mimeType: "text/html",
    extension: "html"
  },
  XML: {
    id: "xml",
    mimeType: "application/xml",
    extension: "xml"
  },
  TEXT: {
    id: "text",
    mimeType: "text/plain",
    extension: "txt"
  }
};

/**
 * Currency format options
 */
export const CURRENCY_FORMAT_OPTIONS = {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

/**
 * Date format patterns
 */
export const DATE_FORMAT = "dd/MM/yyyy";
export const DATE_TIME_FORMAT = "dd/MM/yyyy HH:mm"; 