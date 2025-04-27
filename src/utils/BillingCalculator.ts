import { VehicleWithState, Bill, BillVehicle } from "../Types";
import { memoize } from "lodash-es";

// Cost per mile in GBP for Bob's Taxis
const COST_PER_MILE = 0.207;

// Customer information for Bob's Taxis
const CUSTOMER_NAME = "Bob's Taxis";
const BOBS_TAXIS_LICENSE_PLATES = ["CBDH 789", "86532 AZE"];

/**
 * Utility class for calculating vehicle bills
 */
export class BillingCalculator {
  /**
   * Converts odometer readings from meters to miles
   * @param meters - distance in meters
   * @returns distance in miles (rounded to 2 decimal places)
   */
  public static metersToMiles = (meters: number): number => {
    // 1 mile = 1609.344 meters
    return parseFloat((meters / 1609.344).toFixed(2));
  };

  /**
   * Calculates the miles traveled between two odometer readings
   * Handles edge cases like missing readings or negative differences
   * @param startOdometer - starting odometer reading in meters
   * @param endOdometer - ending odometer reading in meters
   * @returns miles traveled (non-negative)
   */
  public static calculateMilesTravelled = (
    startOdometer: number | undefined,
    endOdometer: number | undefined
  ): number => {
    // Handle edge cases for missing readings
    if (startOdometer === undefined || endOdometer === undefined) {
      console.warn("Missing odometer reading, assuming 0 miles travelled");
      return 0;
    }

    // Calculate difference in meters
    const metersTravelled = endOdometer - startOdometer;

    // Ensure non-negative (vehicles should not travel backwards)
    if (metersTravelled < 0) {
      console.warn(
        `Negative distance calculated (${metersTravelled} meters). Possibly an error in readings. Assuming 0 miles travelled.`
      );
      return 0;
    }

    // Convert to miles
    return BillingCalculator.metersToMiles(metersTravelled);
  };

  /**
   * Calculates the cost based on miles travelled
   * @param milesTravelled - distance in miles
   * @returns cost in GBP (rounded to 2 decimal places)
   */
  public static calculateCost = (
    milesTravelled: number
  ): number => {
    return parseFloat((milesTravelled * COST_PER_MILE).toFixed(2));
  };

  /**
   * Generates a bill for Bob's Taxis vehicles between two dates
   * Memoized to avoid recalculation with the same inputs
   * @param startVehicles - vehicles with state at the start of period
   * @param endVehicles - vehicles with state at the end of period
   * @param startDate - start date of billing period
   * @param endDate - end date of billing period
   * @returns complete bill object
   */
  public static generateBill = memoize((
    startVehicles: VehicleWithState[],
    endVehicles: VehicleWithState[],
    startDate: string,
    endDate: string
  ): Bill => {
    // Filter vehicles to only include Bob's Taxis fleet
    const bobsStartVehicles = startVehicles.filter(v => 
      BOBS_TAXIS_LICENSE_PLATES.includes(v.licensePlate)
    );
    const bobsEndVehicles = endVehicles.filter(v => 
      BOBS_TAXIS_LICENSE_PLATES.includes(v.licensePlate)
    );

    // Calculate the bill for each vehicle
    const vehicleBills: BillVehicle[] = [];
    let totalMileage = 0;
    let totalCost = 0;

    // Process each vehicle in the end period
    bobsEndVehicles.forEach(endVehicle => {
      // Find the matching start vehicle by VIN (most reliable vehicle identifier)
      const startVehicle = bobsStartVehicles.find(
        v => v.vin === endVehicle.vin
      );

      // Skip if we don't have start data for this vehicle
      if (!startVehicle || !startVehicle.state || !endVehicle.state) {
        console.warn(`Missing state data for vehicle ${endVehicle.vin}, skipping`);
        return;
      }

      // Calculate miles travelled
      const startOdometer = startVehicle.state.odometerInMeters;
      const endOdometer = endVehicle.state.odometerInMeters;
      const milesTravelled = BillingCalculator.calculateMilesTravelled(
        startOdometer,
        endOdometer
      );
      
      // Calculate cost
      const cost = BillingCalculator.calculateCost(milesTravelled);
      
      // Add to totals
      totalMileage += milesTravelled;
      totalCost += cost;
      
      // Convert meter readings to miles for display
      const startMileage = BillingCalculator.metersToMiles(startOdometer);
      const endMileage = BillingCalculator.metersToMiles(endOdometer);
      
      // Create the vehicle bill object with all required properties
      vehicleBills.push({
        registration: endVehicle.licensePlate,
        licensePlate: endVehicle.licensePlate,
        vin: endVehicle.vin,
        make: endVehicle.make,
        model: endVehicle.model,
        startMileage,
        endMileage,
        startOdometerMiles: startMileage,
        endOdometerMiles: endMileage,
        milesTravelled,
        cost
      });
    });

    // Create a complete bill with all required properties
    return {
      billingPeriodStart: startDate,
      billingPeriodEnd: endDate,
      customerName: CUSTOMER_NAME,
      totalMiles: parseFloat(totalMileage.toFixed(2)),
      costPerMile: COST_PER_MILE,
      vehicles: vehicleBills,
      totalCost: parseFloat(totalCost.toFixed(2)),
      generatedAt: new Date().toISOString()
    };
  });
} 