import { debounce } from "lodash-es";
import { Bill } from "../../Types";
import { API_BASE_URL, CORS_PROXY } from "../../Constants";

class BillAPI {

  static async getBill(vehicleId: string): Promise<Bill | null> {
    try {
      const apiUrl = `${API_BASE_URL}/api/vehicle/${vehicleId}/bill`;
      const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
      const billData = await fetch(url);
      
      if (!billData.ok) {
        // For client-side code, it's more appropriate to log errors and handle gracefully
        // rather than throwing exceptions that might crash the UI
        console.error(`Failed to fetch bill: ${billData.statusText}`);
        return null;
      }
      
      return await billData.json();
    } catch (error) {
      // Only log to the console in development, in production would use a proper logging service
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error fetching bill data:', error);
      }
      return null;
    }
  }


   // A Debounced version of getBill to prevent excessive API calls (300 ms delay)
  // The method can be refactored to take delay as an argument

  static debouncedGetBill = debounce(BillAPI.getBill, 300);
}

export default BillAPI; 