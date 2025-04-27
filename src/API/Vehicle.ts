import { Vehicle, VehicleWithState } from "../Types";
import { debounce } from "lodash-es";
import { API_BASE_URL, API_VEHICLES_ENDPOINT, API_VEHICLES_HISTORY_ENDPOINT, CORS_PROXY, BOBS_TAXIS_LICENSE_PLATES } from "../Constants";

/**
 * API service for fetching vehicle data
 */
export class VehicleAPI {
  // Cache to prevent duplicate fetches
  private static vehicleCache = new Map<string, Vehicle[]>();
  private static historyCache = new Map<string, VehicleWithState[]>();

  /**
   * Fetches all vehicles
   * API endpoint: GET /api/vehicles
   * @returns Promise with array of vehicles
   */
  public static async getVehicles(): Promise<Vehicle[]> {
    // Check cache first
    if (this.vehicleCache.has('all')) {
      return this.vehicleCache.get('all') as Vehicle[];
    }

    try {
      const apiUrl = `${API_BASE_URL}${API_VEHICLES_ENDPOINT}`;
      const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
      console.log('Fetching vehicles from:', apiUrl, '(via CORS proxy)');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API error (${response.status})`);
      }
      
      const allVehicles = await response.json() as Vehicle[];
      console.log('Fetched vehicles:', allVehicles);
      
      // Filter for Bob's Taxis vehicles
      const bobsTaxisVehicles = allVehicles.filter(vehicle => 
        BOBS_TAXIS_LICENSE_PLATES.includes(vehicle.licensePlate)
      );
      
      // Store in cache
      this.vehicleCache.set('all', bobsTaxisVehicles);
      
      return bobsTaxisVehicles;
    } catch (error) {
      console.error("Error in getVehicles:", error);
      throw error;
    }
  }

  /**
   * Fetches vehicles with state information at a specific datetime
   * API endpoint: GET /api/vehicles/history/{asAtDateTimeString}
   * @param asAtDateTime - ISO datetime string for the moment to fetch vehicle state
   * @returns Promise with array of vehicles including state information
   */
  public static async getVehiclesHistory(
    asAtDateTime: string
  ): Promise<VehicleWithState[]> {
    // Check cache first
    if (this.historyCache.has(asAtDateTime)) {
      return this.historyCache.get(asAtDateTime) as VehicleWithState[];
    }
    
    try {
      const encodedDateTime = encodeURIComponent(asAtDateTime);
      const apiUrl = `${API_BASE_URL}${API_VEHICLES_HISTORY_ENDPOINT}/${encodedDateTime}`;
      const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
      console.log('Fetching vehicle history from:', apiUrl, '(via CORS proxy)');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API error (${response.status})`);
      }
      
      const allVehicles = await response.json() as VehicleWithState[];
      console.log('Fetched vehicle history:', allVehicles);
      
      // Filter for Bob's Taxis vehicles
      const bobsTaxisVehicles = allVehicles.filter(vehicle => 
        BOBS_TAXIS_LICENSE_PLATES.includes(vehicle.licensePlate)
      );
      
      // Store in cache
      this.historyCache.set(asAtDateTime, bobsTaxisVehicles);
      
      return bobsTaxisVehicles;
    } catch (error) {
      console.error(`Error in getVehiclesHistory for ${asAtDateTime}:`, error);
      throw error;
    }
  }

  /**
   * Get vehicles specific to Bob's Taxis (filtered)
   */
  public static async getBobsTaxisVehicles(): Promise<Vehicle[]> {
    const allVehicles = await this.getVehicles();
    return allVehicles.filter(vehicle => 
      BOBS_TAXIS_LICENSE_PLATES.includes(vehicle.licensePlate)
    );
  }

  /**
   * Debounced versions of API calls to prevent excessive requests
   * These methods implement a 500ms delay for multiple consecutive calls
   */
  public static debouncedGetVehicles = debounce(VehicleAPI.getVehicles, 500);
  public static debouncedGetVehiclesHistory = debounce(VehicleAPI.getVehiclesHistory, 500);
  public static debouncedGetBobsTaxisVehicles = debounce(VehicleAPI.getBobsTaxisVehicles, 500);
} 