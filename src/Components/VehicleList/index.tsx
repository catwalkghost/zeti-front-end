import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Typography,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { COLORS } from '../../theme.ts';
import VehicleListMobile from './VehicleListMobile.tsx';
import VehicleListTablet from './VehicleListTablet.tsx';

type Vehicle = {
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
}

type VehicleListProps = {
  vehicles: Vehicle[];
  totalMiles: number;
  totalCost: number;
};

const VehicleDetailsHeading = styled(Typography)(() => ({
  fontWeight: 700,
  color: 'text.primary',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1.5rem'
}));

const IconCircle = styled(Box)(() => ({
  backgroundColor: COLORS.summaryBackground,
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const ResponsiveTableContainer = styled(TableContainer)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 1px 5px rgba(0,0,0,0.03)',
  [theme.breakpoints.down('md')]: {
    display: 'block',
    width: '100%',
    overflowX: 'auto'
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 650,
  }
}));

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, totalMiles, totalCost }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;
  const formatNumber = (num: number) => num.toLocaleString();

  if (isMobile) {
    return (
      <VehicleListMobile
        vehicles={vehicles}
        totalMiles={totalMiles}
        totalCost={totalCost}
        theme={theme}
        IconCircle={IconCircle}
        VehicleDetailsHeading={VehicleDetailsHeading}
      />
    );
  }

  if (isTablet) {
    return (
      <VehicleListTablet
        vehicles={vehicles}
        totalMiles={totalMiles}
        totalCost={totalCost}
        theme={theme}
        IconCircle={IconCircle}
        VehicleDetailsHeading={VehicleDetailsHeading}
      />
    );
  }

  return (
    <Box>
      <VehicleDetailsHeading variant="h5">
        <IconCircle>
          <DirectionsCarIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        </IconCircle>
        Vehicle Details
      </VehicleDetailsHeading>

      <ResponsiveTableContainer>
        <Paper elevation={0}>
          <StyledTable aria-label="vehicle list">
            <TableHead>
              <TableRow>
                <TableCell>License Plate</TableCell>
                <TableCell>VIN</TableCell>
                <TableCell>Make</TableCell>
                <TableCell>Model</TableCell>
                <TableCell align="right">Start Odometer</TableCell>
                <TableCell align="right">End Odometer</TableCell>
                <TableCell align="right">Miles Travelled</TableCell>
                <TableCell align="right">Cost</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.vin}>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell align="right">{formatNumber(vehicle.startOdometerMiles)} mi</TableCell>
                  <TableCell align="right">{formatNumber(vehicle.endOdometerMiles)} mi</TableCell>
                  <TableCell align="right">{formatNumber(vehicle.milesTravelled)} mi</TableCell>
                  <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 700 }}>{formatCurrency(vehicle.cost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow sx={{ 
                backgroundColor: COLORS.summaryBackground, 
                '&:hover': { backgroundColor: COLORS.summaryBackground } 
              }}>
                <TableCell colSpan={6} align="right" sx={{ fontWeight: 700 }}>
                  Total:
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatNumber(totalMiles)} mi
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  {formatCurrency(totalCost)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </StyledTable>
        </Paper>
      </ResponsiveTableContainer>
    </Box>
  );
};

export default VehicleList; 