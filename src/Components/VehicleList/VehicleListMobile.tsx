import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Theme,
  styled
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Component props including shared styling components
type VehicleListMobileProps = {
  vehicles: {
    licensePlate: string;
    vin: string;
    make: string;
    model: string;
    startOdometerMiles: number;
    endOdometerMiles: number;
    milesTravelled: number;
    cost: number;
  }[];
  totalMiles: number;
  totalCost: number;
  theme: Theme;
  IconCircle: React.ComponentType<any>;
  VehicleDetailsHeading: React.ComponentType<any>;
};

const VehicleCard = styled(Card)(({ theme }) => ({
  marginBottom: '1.5rem',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  overflow: 'hidden'
}));

const VehicleListMobile: React.FC<VehicleListMobileProps> = ({
  vehicles,
  totalMiles,
  totalCost,
  theme,
  IconCircle,
  VehicleDetailsHeading
}) => {
  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;
  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <Box>
      <VehicleDetailsHeading variant="h5">
        <IconCircle>
          <DirectionsCarIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        </IconCircle>
        Vehicle Details
      </VehicleDetailsHeading>

      <Box sx={{ mt: 3 }}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.vin} elevation={0}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                component="div" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <DirectionsCarIcon fontSize="small" color="primary" />
                {vehicle.make} {vehicle.model}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                License: <Typography component="span" fontWeight={600} variant="body2">{vehicle.licensePlate}</Typography>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                VIN: <Typography component="span" fontWeight={600} variant="body2">{vehicle.vin}</Typography>
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Start Odometer</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatNumber(vehicle.startOdometerMiles)} mi
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">End Odometer</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatNumber(vehicle.endOdometerMiles)} mi
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Miles Travelled</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {formatNumber(vehicle.milesTravelled)} mi
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Cost</Typography>
                  <Typography variant="body1" fontWeight={700} color="primary.main">
                    {formatCurrency(vehicle.cost)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </VehicleCard>
        ))}

        <Card
          elevation={0}
          sx={{
            borderRadius: '8px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.default,
            mt: 3,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Total</Typography>
              <Typography variant="h6" fontWeight={600}>
                {formatNumber(totalMiles)} miles
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">Total Cost</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatCurrency(totalCost)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default VehicleListMobile;
