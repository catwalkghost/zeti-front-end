import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  styled
} from '@mui/material';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import AltRouteRoundedIcon from '@mui/icons-material/AltRouteRounded';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { COLORS } from '../theme';

type BillSummaryProps = {
  billingPeriodStart: string;
  billingPeriodEnd: string;
  totalMiles: number;
  costPerMile: number;
  totalCost: number;
  vehicleCount: number;
};

// Styled components to reduce inline sx usage
const SummaryContainer = styled(Paper)(({ theme }) => ({
  padding: '1rem 1.5rem',
  borderRadius: '8px',
  backgroundColor: 'background.paper',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: '2rem'
}));

const SummaryTitle = styled(Typography)(() => ({
  fontWeight: 700,
  color: 'text.primary',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
}));

const SummaryItemCard = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '1.5rem',
  backgroundColor: COLORS.summaryBackground,
  borderRadius: '8px',
  transition: 'transform 0.2s, box-shadow 0.2s',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.05)'
  }
}));

const IconWrapper = styled(Box)(() => ({
  backgroundColor: '#fff',
  padding: '0.75rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
}));

const TitleIconWrapper = styled(Box)(() => ({
  backgroundColor: COLORS.summaryBackground,
  padding: '0.5rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const FlexContainer = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  width: '100%'
}));

const ResponsiveBox = styled(Box)(({ theme }) => ({
  flex: '1 1 30%',
  minWidth: '30%',
  marginBottom: 0,
  [theme.breakpoints.down('md')]: {
    flex: '1 1 100%',
    minWidth: '100%',
    marginBottom: '1.5rem'
  },
  [theme.breakpoints.between('sm', 'md')]: {
    flex: '1 1 45%',
    minWidth: '45%',
  }
}));

/**
 * BillSummary component to display bill summary information
 */
const BillSummary: React.FC<BillSummaryProps> = ({
  billingPeriodStart,
  billingPeriodEnd,
  totalMiles,
  costPerMile,
  totalCost,
  vehicleCount
}) => {
  const theme = useTheme();

  // Format functions
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;
  const formatCostPerMile = (value: number) => `£${value.toFixed(3)}`;
  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <SummaryContainer elevation={0}>
      <SummaryTitle variant="h5">
        <TitleIconWrapper>
          <SummarizeIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
        </TitleIconWrapper>
        Bob's Taxis — Bill Summary
      </SummaryTitle>
      
      <FlexContainer>
        <ResponsiveBox>
          <SummaryItemCard>
            <IconWrapper>
              <CalendarTodayIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            </IconWrapper>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Billing Period
            </Typography>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {formatDate(billingPeriodStart)} - {formatDate(billingPeriodEnd)}
            </Typography>
          </SummaryItemCard>
        </ResponsiveBox>
        
        <ResponsiveBox>
          <SummaryItemCard>
            <IconWrapper>
              <AltRouteRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            </IconWrapper>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Mileage
            </Typography>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {formatNumber(totalMiles)} miles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Cost Per Mile: <Typography component="span" fontWeight={600} variant="body2">{formatCostPerMile(costPerMile)}</Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Vehicles: <Typography component="span" fontWeight={600} variant="body2">{vehicleCount}</Typography>
            </Typography>
          </SummaryItemCard>
        </ResponsiveBox>
        
        <ResponsiveBox>
          <SummaryItemCard>
            <IconWrapper>
              <PaidRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            </IconWrapper>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Cost
            </Typography>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {formatCurrency(totalCost)}
            </Typography>
          </SummaryItemCard>
        </ResponsiveBox>
      </FlexContainer>
    </SummaryContainer>
  );
};

export default BillSummary; 