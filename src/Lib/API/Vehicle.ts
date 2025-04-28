import { Vehicle, VehicleWithState } from "../../Types";
import { debounce } from "lodash-es";
import { API_BASE_URL, API_VEHICLES_ENDPOINT, API_VEHICLES_HISTORY_ENDPOINT, CORS_PROXY, BOBS_TAXIS_LICENSE_PLATES } from "../../Constants";


export class VehicleAPI {
  // Cache to prevent duplicate fetches
  private static vehicleCache = new Map<string, Vehicle[]>();
  private static historyCache = new Map<string, VehicleWithState[]>();

  /**
   * Fetches all vehicles
   * API endpoint: GET /api/vehicles
   * @returns Promise with an array of vehicles
   */
  public static async getVehicles(): Promise<Vehicle[]> {
    if (this.vehicleCache.has('all')) {
      return this.vehicleCache.get('all') as Vehicle[];
    }

    try {
      const apiUrl = `${API_BASE_URL}${API_VEHICLES_ENDPOINT}`;
      const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
      
      // In development, we might want to log the URL for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.log('Fetching vehicles via CORS proxy');
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error(`API error (${response.status})`);
      }
      
      const allVehicles = await response.json() as Vehicle[];
      
      const bobsTaxisVehicles = allVehicles.filter(vehicle =>
        BOBS_TAXIS_LICENSE_PLATES.includes(vehicle.licensePlate)
      );
      
      this.vehicleCache.set('all', bobsTaxisVehicles);
      
      return bobsTaxisVehicles;
    } catch (error) {
      console.error("Error in getVehicles:", error);
      throw new Error(`Failed to fetch vehicles: ${error instanceof Error ? error.message : String(error)}`);
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
    if (this.historyCache.has(asAtDateTime)) {
      return this.historyCache.get(asAtDateTime) as VehicleWithState[];
    }
    
    try {
      const encodedDateTime = encodeURIComponent(asAtDateTime);
      const apiUrl = `${API_BASE_URL}${API_VEHICLES_HISTORY_ENDPOINT}/${encodedDateTime}`;
      const url = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error(`API error (${response.status})`);
      }
      
      const allVehicles = await response.json() as VehicleWithState[];
      
      const bobsTaxisVehicles = allVehicles.filter(vehicle =>
        BOBS_TAXIS_LICENSE_PLATES.includes(vehicle.licensePlate)
      );
      
      this.historyCache.set(asAtDateTime, bobsTaxisVehicles);
      
      return bobsTaxisVehicles;
    } catch (error) {
      console.error(`Error in getVehiclesHistory for ${asAtDateTime}:`, error);
      throw new Error(`Failed to fetch vehicle history: ${error instanceof Error ? error.message : String(error)}`);
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

  // Debounced API calls to prevent excessive requests (300 ms delay)
  public static debouncedGetVehicles = debounce(VehicleAPI.getVehicles, 300);
  public static debouncedGetVehiclesHistory = debounce(VehicleAPI.getVehiclesHistory, 300);
  public static debouncedGetBobsTaxisVehicles = debounce(VehicleAPI.getBobsTaxisVehicles, 300);
} 