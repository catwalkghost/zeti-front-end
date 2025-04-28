import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import VehicleList from '../Components/VehicleList';
import { ThemeProvider } from '@mui/material';
import theme from '../Lib/Theme/theme';

const mockVehicles = [
  {
    licensePlate: 'CBDH 789',
    vin: 'JH4DB7540SS801338',
    make: 'Toyota',
    model: 'Corolla',
    startOdometerMiles: 12500,
    endOdometerMiles: 13200,
    milesTravelled: 700,
    cost: 144.9,
    registration: 'CBDH 789',
    startMileage: 12500,
    endMileage: 13200
  },
  {
    licensePlate: '86532 AZE',
    vin: 'JTHBJ46G992339158',
    make: 'Ford',
    model: 'Fiesta',
    startOdometerMiles: 8000,
    endOdometerMiles: 8500,
    milesTravelled: 500,
    cost: 103.5,
    registration: '86532 AZE',
    startMileage: 8000,
    endMileage: 8500
  }
];

describe('VehicleList Component', () => {
  // Helper function to render the component with the proper theme context
  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    );
  };

  it('renders vehicle details correctly', () => {
    renderWithTheme(
      <VehicleList 
        vehicles={mockVehicles} 
        totalMiles={1200} 
        totalCost={248.4} 
      />
    );
    
    // Check if vehicle makes are displayed
    expect(screen.getByText('Toyota')).toBeTruthy();
    expect(screen.getByText('Corolla')).toBeTruthy();
    expect(screen.getByText('Ford')).toBeTruthy();
    expect(screen.getByText('Fiesta')).toBeTruthy();
    
    // Verify license plates are shown
    expect(screen.getByText('CBDH 789')).toBeTruthy();
    expect(screen.getByText('86532 AZE')).toBeTruthy();
    
    // Check if cost values are displayed (rounding effects may apply)
    expect(screen.getByText('£144.90')).toBeTruthy();
    expect(screen.getByText('£103.50')).toBeTruthy();
  });

  it('shows the totals correctly', () => {
    renderWithTheme(
      <VehicleList 
        vehicles={mockVehicles} 
        totalMiles={1200} 
        totalCost={248.4} 
      />
    );
    
    // Finding total values
    const totalMiles = screen.getByText('1,200 mi');
    expect(totalMiles).toBeTruthy();
    
    const totalCost = screen.getByText('£248.40');
    expect(totalCost).toBeTruthy();
  });

  // Additional test for an empty vehicle list
  it('handles empty vehicle list gracefully', () => {
    renderWithTheme(
      <VehicleList 
        vehicles={[]} 
        totalMiles={0} 
        totalCost={0} 
      />
    );
    
    // Should show totals even with empty data
    expect(screen.getByText('0 mi')).toBeTruthy();
    expect(screen.getByText('£0.00')).toBeTruthy();
  });
}); 