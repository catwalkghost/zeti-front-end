import { VehicleWithState, Bill, BillVehicle } from "../../Types";
import { memoize } from "lodash-es";

// Fixed rate per mile. This can be made dynamic
const COST_PER_MILE = 0.207;

// Bob's Taxis info
const CUSTOMER_NAME = "Bob's Taxis";
const BOBS_TAXIS_LICENSE_PLATES = ["CBDH 789", "86532 AZE"];

export class BillingCalculator {
  // Convert from meters to miles
  static metersToMiles = (meters: number): number => {
    return parseFloat((meters / 1609.344).toFixed(2));
  };

  // Figure out miles traveled between readings
  static calculateMilesTravelled = (
    startOdometer: number | undefined,
    endOdometer: number | undefined
  ): number => {
    // Can't calculate if we're missing data
    if (startOdometer === undefined || endOdometer === undefined) {
      console.warn("Missing odometer reading, assuming 0 miles travelled");
      return 0;
    }

    const metersTravelled = endOdometer - startOdometer;

    // Sanity check - vehicles shouldn't go backwards
    if (metersTravelled < 0) {
      console.warn(
        `Negative distance (${metersTravelled} meters). Probably a data error. Using 0 miles.`
      );
      return 0;
    }

    return BillingCalculator.metersToMiles(metersTravelled);
  };

  // Simple cost calculation
  static calculateCost = (milesTravelled: number): number => {
    return parseFloat((milesTravelled * COST_PER_MILE).toFixed(2));
  };

  // Main bill generation function - we cache the results with memoize
  static generateBill = memoize((
    startVehicles: VehicleWithState[],
    endVehicles: VehicleWithState[],
    startDate: string,
    endDate: string
  ): Bill => {
    // Only care about Bob's Taxis vehicles
    const bobsStartVehicles = startVehicles.filter(v => 
      BOBS_TAXIS_LICENSE_PLATES.includes(v.licensePlate)
    );
    const bobsEndVehicles = endVehicles.filter(v => 
      BOBS_TAXIS_LICENSE_PLATES.includes(v.licensePlate)
    );

    // Build the bill
    const vehicleBills: BillVehicle[] = [];
    let totalMileage = 0;
    let totalCost = 0;

    // Loop through each vehicle at the end of a period
    bobsEndVehicles.forEach(endVehicle => {
      // Find a matching start vehicle using VIN
      const startVehicle = bobsStartVehicles.find(
        v => v.vin === endVehicle.vin
      );

      // Skip if data is missing
      if (!startVehicle || !startVehicle.state || !endVehicle.state) {
        console.warn(`No data for ${endVehicle.vin}, skipping`);
        return;
      }

      // Calculate distance and cost
      const startOdometer = startVehicle.state.odometerInMeters;
      const endOdometer = endVehicle.state.odometerInMeters;
      const milesTravelled = BillingCalculator.calculateMilesTravelled(
        startOdometer,
        endOdometer
      );
      
      const cost = BillingCalculator.calculateCost(milesTravelled);
      
      // Update running totals
      totalMileage += milesTravelled;
      totalCost += cost;
      
      // Convert to miles for display
      const startMileage = BillingCalculator.metersToMiles(startOdometer);
      const endMileage = BillingCalculator.metersToMiles(endOdometer);
      
      // Add this vehicle to the bill
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