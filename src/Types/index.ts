// Vehicle state information at a specific point in time
export type VehicleState = {
  odometerInMeters: number;
  speedInMph: number;
  asAt: string;
};

// Vehicle information
export type Vehicle = {
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  state: VehicleState | null;
};

// Vehicle with state for history endpoint
export type VehicleWithState = Vehicle;

export type GetVehiclesResponse = Vehicle[];

export type GetVehiclesHistoryParams = {
  asAtDateTimeString: string;
};

export type GetVehiclesHistoryResponse = VehicleWithState[];

// Represents a vehicle in the bill
export type BillVehicle = {
  registration: string;  // License plate
  make: string;
  model: string;
  startMileage: number;  // Used by BillFormatter
  endMileage: number;    // Used by BillFormatter
  cost: number;
  
  // Additional properties used in VehicleList component
  licensePlate?: string;
  vin?: string;
  startOdometerMiles?: number;
  endOdometerMiles?: number;
  milesTravelled?: number;
};

// Bill model
export type Bill = {
  id?: string;
  customerId?: string;
  customerName?: string;   // Added for BillFormatter
  billingPeriodStart: string;
  billingPeriodEnd: string;
  generatedAt: string;
  vehicles: BillVehicle[];
  costPerMile: number;
  totalCost: number;
  totalMiles?: number;     // Added for formatting functions
};

// Customer model
export type Customer = {
  id: string;
  name: string;
  // Add additional fields as needed for a real implementation
};