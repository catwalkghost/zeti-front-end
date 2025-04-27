import { debounce } from "lodash-es";
import { Bill } from "../Types";

/**
 * API service for managing billing operations
 */
class BillAPI {
  /**
   * Get the bill for a specific vehicle
   * Use debounce to prevent excessive API calls
   * 
   * @param vehicleId - The ID of the vehicle to get the bill for
   * @returns Promise with the bill data or null if not available
   */
  static async getBill(vehicleId: string): Promise<Bill | null> {
    try {
      const billData = await fetch(`/api/vehicle/${vehicleId}/bill`);
      if (!billData.ok) {
        throw new Error(`Failed to fetch bill: ${billData.statusText}`);
      }
      
      return await billData.json();
    } catch (error) {
      console.error('Error fetching bill data:', error);
      return null;
    }
  }

  /**
   * Debounced version of getBill to prevent excessive API calls
   * Implements a 300ms delay for multiple consecutive calls
   */
  static debouncedGetBill = debounce(BillAPI.getBill, 300);
}

export default BillAPI; 