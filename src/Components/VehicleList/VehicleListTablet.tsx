import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  styled,
  Typography,
  Tooltip,
  Theme
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { COLORS } from '../../theme.ts';

// Component props including shared styling components
type VehicleListTabletProps = {
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
}

const TabletTableCell = styled(TableCell)({
  padding: '8px 12px',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  '&.MuiTableCell-head': {
    fontWeight: 600,
  }
});

const MakeModelTableCell = styled(TabletTableCell)({
  maxWidth: '100px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

const VinTableCell = styled(TabletTableCell)({
  maxWidth: '85px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

const VehicleListTablet: React.FC<VehicleListTabletProps> = ({
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

      <Paper elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.divider}` }}>
        <Table size="small" aria-label="vehicle list">
          <TableHead>
            <TableRow>
              <TabletTableCell>License</TabletTableCell>
              <TabletTableCell>VIN</TabletTableCell>
              <MakeModelTableCell>Make/Model</MakeModelTableCell>
              <TabletTableCell align="right">Start</TabletTableCell>
              <TabletTableCell align="right">End</TabletTableCell>
              <TabletTableCell align="right">Miles</TabletTableCell>
              <TabletTableCell align="right">Cost</TabletTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.vin}>
                <TabletTableCell>{vehicle.licensePlate}</TabletTableCell>
                <VinTableCell>
                  <Tooltip title={vehicle.vin} placement="top">
                    <Typography variant="inherit" component="span" sx={{ cursor: 'pointer' }}>
                      {vehicle.vin}
                    </Typography>
                  </Tooltip>
                </VinTableCell>
                <MakeModelTableCell title={`${vehicle.make} ${vehicle.model}`}>{vehicle.make} {vehicle.model}</MakeModelTableCell>
                <TabletTableCell align="right">{formatNumber(vehicle.startOdometerMiles)}</TabletTableCell>
                <TabletTableCell align="right">{formatNumber(vehicle.endOdometerMiles)}</TabletTableCell>
                <TabletTableCell align="right">{formatNumber(vehicle.milesTravelled)}</TabletTableCell>
                <TabletTableCell align="right" sx={{ color: 'primary.main', fontWeight: 700 }}>{formatCurrency(vehicle.cost)}</TabletTableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow sx={{ 
              backgroundColor: COLORS.summaryBackground, 
              '&:hover': { backgroundColor: COLORS.summaryBackground } 
            }}>
              <TabletTableCell colSpan={5} align="right" sx={{ fontWeight: 700 }}>
                Total:
              </TabletTableCell>
              <TabletTableCell align="right" sx={{ fontWeight: 700 }}>
                {formatNumber(totalMiles)}
              </TabletTableCell>
              <TabletTableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {formatCurrency(totalCost)}
              </TabletTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </Box>
  );
};

export default VehicleListTablet;
