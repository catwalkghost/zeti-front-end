import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Divider,
  Fade,
  Paper,
  Typography,
  useTheme,
  Button,
} from '@mui/material';
import AltRouteRounded from '@mui/icons-material/AltRouteRounded';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { VehicleAPI } from '../../API/Vehicle.ts';
import { BillingCalculator } from '../../utils/BillingCalculator.ts';
import { BillFormat, BillFormatter } from '../../utils/BillFormatter.ts';
import dayjs from 'dayjs';
// Date picker imports are commented out since I am using fixed timestamps
// In a real-world project, these would be used for dynamic date selection
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Bill } from '../../Types';
import BillSummary from '../BillSummary.tsx';
import VehicleList from '../VehicleList';
import { COLORS, LAYOUT } from '../../theme.ts';
import { BILLING_PERIOD_START, BILLING_PERIOD_END, COMPANY_NAME } from '../../Constants';
import BillGeneratorHeader from './BillGeneratorHeader.tsx';
import BillingInformation from './BillingInformation.tsx';

type BillGeneratorProps = {
  startDate?: string;
  endDate?: string;
};

/**
 * Format date for display in the billing period
 */
const formatDisplayDate = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

/**
 * Format date with time for display
 */
const formatDisplayDateTime = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

/**
 * Calculate total miles for all vehicles
 */
const calculateTotalMiles = (bill: Bill): number => {
  return bill.vehicles.reduce((total, vehicle) => 
    total + (vehicle.endMileage - vehicle.startMileage), 0);
};

/**
 * Vehicle Usage Bill component with elegant, luxury design
 */
const BillGenerator: React.FC<BillGeneratorProps> = () => {
  const theme = useTheme();
  
  // State for bill data and UI
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<BillFormat>(BillFormat.PDF);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  // Using fixed date range from the requirements
  const [dateRange] = useState({ startDate: BILLING_PERIOD_START, endDate: BILLING_PERIOD_END });
  const [customerName] = useState<string>(COMPANY_NAME);
  
  /**
   * Generate bill from vehicle data
   */
  const generateBill = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch vehicle data for the start and end dates
      const startVehicles = await VehicleAPI.getVehiclesHistory(dateRange.startDate);
      const endVehicles = await VehicleAPI.getVehiclesHistory(dateRange.endDate);
      
      // Generate a bill specifically for Bob's Taxis
      const generatedBill = BillingCalculator.generateBill(
        startVehicles,
        endVehicles,
        dateRange.startDate,
        dateRange.endDate
      );
      
      // Update state
      setBill(generatedBill);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to fetch vehicle data: ${errorMessage}. Please check your network connection and ensure the API is accessible.`);
      console.error("Error generating bill:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  // Generate bill on component mount
  useEffect(() => {
    generateBill();
  }, [generateBill]);

  /**
   * Handle format selection change for downloads
   */
  const handleFormatChange = (format: BillFormat) => {
    setDownloadFormat(format);
  };

  /**
   * Download bill in selected format
   */
  const downloadBill = async () => {
    if (!bill) return;
    
    try {
      setIsDownloading(true);
      setError(null);
      
      // Get file info for the selected format
      const { extension, mimeType } = BillFormatter.getFileInfo(downloadFormat);
      
      // Format bill in the selected format
      const formattedContent = await BillFormatter.formatBill(bill, downloadFormat);
      
      // PDF format handler
      if (downloadFormat === BillFormat.PDF) {
        const a = document.createElement('a');
        a.href = formattedContent;
        a.download = `bobs_taxis_bill_${dateRange.startDate.split('T')[0]}_to_${dateRange.endDate.split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // blob is used for other formats
        const blob = new Blob([formattedContent], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bobs_taxis_bill_${dateRange.startDate.split('T')[0]}_to_${dateRange.endDate.split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }
    } catch (err) {
      setError(`Failed to download bill: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        pt: { xs: LAYOUT.spacing.xs, sm: LAYOUT.spacing.sm }, 
        pb: LAYOUT.spacing.lg,
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: COLORS.background,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: LAYOUT.spacing.xs, sm: LAYOUT.spacing.sm }, 
            borderRadius: '12px',
            boxShadow: LAYOUT.boxShadow,
            background: COLORS.cardBackground,
          }}
        >
          {/* Header Section */}
          <BillGeneratorHeader 
            dateRange={dateRange}
            downloadFormat={downloadFormat}
            onFormatChange={handleFormatChange}
            onDownload={downloadBill}
            isDownloading={isDownloading}
            billExists={!!bill}
            formatDisplayDate={formatDisplayDate}
          />
            
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress 
                size={60} 
                thickness={3} 
                sx={{ color: COLORS.accent }}
              />
            </Box>
          ) : error ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: LAYOUT.spacing.sm, 
                mb: LAYOUT.spacing.sm, 
                bgcolor: COLORS.errorLight, 
                borderRadius: '8px',
                border: `1px solid ${COLORS.errorBorder}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <ErrorOutlineIcon 
                sx={{ 
                  fontSize: 48, 
                  color: COLORS.error,
                  mb: 2 
                }}
              />
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: COLORS.error, 
                  fontWeight: 600 
                }}
              >
                Error
              </Typography>
              <Typography variant="body1" sx={{ color: '#7F1D1D', mb: 3 }}>
                {error}
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                onClick={generateBill}
                sx={{ mt: 2 }}
              >
                Retry
              </Button>
            </Paper>
          ) : bill ? (
            <React.Fragment>
              {/* Summary Section */}
              <BillSummary 
                billingPeriodStart={bill.billingPeriodStart}
                billingPeriodEnd={bill.billingPeriodEnd}
                totalMiles={calculateTotalMiles(bill)}
                costPerMile={bill.costPerMile}
                totalCost={bill.totalCost}
                vehicleCount={bill.vehicles.length}
              />

              {/* Divider with sufficient margin */}
              <Divider sx={{ my: LAYOUT.spacing.sm, borderColor: theme.palette.divider }}/>

              {/* Vehicle Details */}
              <VehicleList 
                vehicles={bill.vehicles.map(vehicle => ({
                  licensePlate: vehicle.registration || '',
                  vin: vehicle.vin || '',
                  make: vehicle.make,
                  model: vehicle.model,
                  startOdometerMiles: vehicle.startMileage,
                  endOdometerMiles: vehicle.endMileage,
                  milesTravelled: vehicle.endMileage - vehicle.startMileage,
                  cost: vehicle.cost,
                  registration: vehicle.registration,
                  startMileage: vehicle.startMileage,
                  endMileage: vehicle.endMileage
                }))}
                totalMiles={calculateTotalMiles(bill)}
                totalCost={bill.totalCost}
              />

              {/* Billing Information */}
              <BillingInformation 
                generatedAt={bill.generatedAt}
                customerName={customerName}
                formatDisplayDateTime={formatDisplayDateTime}
                theme={theme}
              />
            </React.Fragment>
          ) : (
            <Box sx={{ 
              p: 6, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <Box sx={{ 
                bgcolor: COLORS.summaryBackground, 
                p: 2, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}>
                <AltRouteRounded sx={{ 
                  fontSize: 60, 
                  color: COLORS.accent,
                  opacity: 0.9
                }} />
              </Box>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                No Bill Generated
              </Typography>
              <Typography variant="body1" color={COLORS.textSecondary} sx={{ maxWidth: 500 }}>
                Click "Refresh Data" to calculate the vehicle usage costs for {customerName}.
              </Typography>
            </Box>
          )}
        </Paper>
      </Fade>
    </Container>
  );
};

export default BillGenerator; 