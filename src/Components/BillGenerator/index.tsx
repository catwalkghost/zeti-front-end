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
import { VehicleAPI } from '../../Lib/API/Vehicle';
import { BillingCalculator } from '../../Lib/Utils/BillingCalculator';
import { BillFormat, BillFormatter } from '../../Lib/Utils/BillFormatter';
import dayjs from 'dayjs';
// Removed these for now - these are needed for Date Picker implemntation
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Bill } from '../../Types';
import Index from '../BillSummary';
import VehicleList from '../VehicleList';
import { COLORS, LAYOUT } from '../../Lib/Theme/theme';
import { BILLING_PERIOD_START, BILLING_PERIOD_END, COMPANY_NAME } from '../../Constants';
import BillGeneratorHeader from './BillGeneratorHeader';
import BillingInformation from './BillingInformation';

type BillGeneratorProps = {
  startDate?: string;
  endDate?: string;
};

const formatDisplayDate = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY');
};

const formatDisplayDateTime = (dateString: string): string => {
  return dayjs(dateString).format('DD/MM/YYYY HH:mm');
};

const calculateTotalMiles = (bill: Bill): number => {
  return bill.vehicles.reduce((total, vehicle) => 
    total + (vehicle.endMileage - vehicle.startMileage), 0);
};

const BillGenerator: React.FC<BillGeneratorProps> = () => {
  const theme = useTheme();
  
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<BillFormat>(BillFormat.PDF);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [dateRange] = useState({ startDate: BILLING_PERIOD_START, endDate: BILLING_PERIOD_END });
  const [customerName] = useState<string>(COMPANY_NAME);
  
  const generateBill = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the vehicle data for start and end of the month
      const startVehicles = await VehicleAPI.getVehiclesHistory(dateRange.startDate);
      const endVehicles = await VehicleAPI.getVehiclesHistory(dateRange.endDate);
      
      // Calculate the bill for Bob's Taxis
      const generatedBill = BillingCalculator.generateBill(
        startVehicles,
        endVehicles,
        dateRange.startDate,
        dateRange.endDate
      );
      
      setBill(generatedBill);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to generate bill: ${errorMessage}`);
      console.error("Something went wrong:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.startDate, dateRange.endDate]);

  useEffect(() => {
    // Using IIFE
    (async () => {
      try {
        await generateBill();
      } catch (error) {
        console.error("Something went wrong:", error);
      }
    })();
    // No need to return anything from useEffect
  }, [generateBill]);

  const handleFormatChange = (format: BillFormat) => {
    setDownloadFormat(format);
  };

  const downloadBill = async () => {
    if (!bill) return;
    
    try {
      setIsDownloading(true);
      setError(null);
      
      const { extension, mimeType } = BillFormatter.getFileInfo(downloadFormat);
      const formattedContent = await BillFormatter.formatBill(bill, downloadFormat);
      
      // PDF is special — it's already a data URL
      if (downloadFormat === BillFormat.PDF) {
        const a = document.createElement('a');
        a.href = formattedContent;
        a.download = `bobs_taxis_bill_${dateRange.startDate.split('T')[0]}_to_${dateRange.endDate.split('T')[0]}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Other formats need to be converted to blobs
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
      setError(`Download failed: ${err instanceof Error ? err.message : String(err)}`);
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
              <Typography 
                variant="body1" 
                sx={{ color: COLORS.errorText, mb: 3 }}
              >
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
              <Index
                billingPeriodStart={bill.billingPeriodStart}
                billingPeriodEnd={bill.billingPeriodEnd}
                totalMiles={calculateTotalMiles(bill)}
                costPerMile={bill.costPerMile}
                totalCost={bill.totalCost}
                vehicleCount={bill.vehicles.length}
              />

              <Divider sx={{ my: LAYOUT.spacing.sm, borderColor: theme.palette.divider }}/>

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