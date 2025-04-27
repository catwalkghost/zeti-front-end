import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VehicleList from '../Components/VehicleList';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

// Mock data for testing
const mockVehicles = [
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
  }
];

// Wrapper component for providing theme
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

describe('VehicleList', () => {
  it('renders component with vehicle data', () => {
    render(
      <VehicleList 
        vehicles={mockVehicles} 
        totalMiles={300} 
        totalCost={75.0} 
      />,
      { wrapper: Wrapper }
    );

    // Test heading is present
    expect(screen.getByText('Vehicle Details')).toBeInTheDocument();
    
    // Test vehicle data is displayed
    expect(screen.getByText('Jaguar')).toBeInTheDocument();
    expect(screen.getByText('Tesla')).toBeInTheDocument();
    expect(screen.getByText('IPace')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    
    // Test license plates are displayed
    expect(screen.getByText('CBDH 789')).toBeInTheDocument();
    expect(screen.getByText('86532 AZE')).toBeInTheDocument();
    
    // Test costs are displayed (need to match partial text due to formatting)
    expect(screen.getByText(/£25\.00/)).toBeInTheDocument();
    expect(screen.getByText(/£50\.00/)).toBeInTheDocument();
    
    // Test totals are displayed
    expect(screen.getByText(/£75\.00/)).toBeInTheDocument();
  });
}); 