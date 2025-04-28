import { BillFormat } from '../Lib/Utils/BillFormatter';

// Vehicle state information at a specific point in time
export type VehicleState = {
  odometerInMeters: number;
  speedInMph: number;
  asAt: string;
};

// Basic vehicle information
export type Vehicle = {
  vin: string;
  licensePlate: string;
  make: string;
  model: string;
  state: VehicleState | null;
};

// Vehicle with state for history endpoint (same as Vehicle, just named differently for API clarity)
export type VehicleWithState = Vehicle;

// Vehicle in the bill with additional display properties
export type BillVehicle = {
  registration: string;  // License plate
  make: string;
  model: string;
  startMileage: number;
  endMileage: number;
  cost: number;
  
  // Additional properties used in VehicleList component
  licensePlate?: string;
  vin?: string;
  startOdometerMiles?: number;
  endOdometerMiles?: number;
  milesTravelled?: number;
};

// Complete bill model
export type Bill = {
  id?: string;
  customerId?: string;
  customerName?: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  generatedAt: string;
  vehicles: BillVehicle[];
  costPerMile: number;
  totalCost: number;
  totalMiles?: number;
};

// Component Props

// FormatSelector component props
export type FormatSelectorProps = {
  value: BillFormat;
  onChange: (format: BillFormat) => void;
  disabled?: boolean;
  sx?: any;
};

// BillSummary component props
export type BillSummaryProps = {
  billingPeriodStart: string;
  billingPeriodEnd: string;
  totalMiles: number;
  costPerMile: number;
  totalCost: number;
  vehicleCount: number;
};

// VehicleList component props
export type VehicleListProps = {
  vehicles: {
    licensePlate: string;
    vin: string;
    make: string;
    model: string;
    startOdometerMiles: number;
    endOdometerMiles: number;
    milesTravelled: number;
    cost: number;
    registration?: string;
    startMileage?: number;
    endMileage?: number;
  }[];
  totalMiles: number;
  totalCost: number;
};

// BillGenerator component props
export type BillGeneratorProps = {
  startDate?: string;
  endDate?: string;
};

// API Response Types
export type GetVehiclesResponse = Vehicle[];

export type GetVehiclesHistoryParams = {
  asAtDateTimeString: string;
};

export type GetVehiclesHistoryResponse = VehicleWithState[];

// Customer model
export type Customer = {
  id: string;
  name: string;
  // Additional fields can be needed for the real-world implementation
};