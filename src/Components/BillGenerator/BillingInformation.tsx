import React from 'react';
import { Box, Typography, Theme } from '@mui/material';
import { LAYOUT } from '../../theme.ts';

type BillingInformationProps = {
  generatedAt: string;
  customerName: string;
  formatDisplayDateTime: (dateString: string) => string;
  theme: Theme;
};

/**
 * Component to display billing information footer
 * Includes generation date and customer name
 */
const BillingInformation: React.FC<BillingInformationProps> = ({
  generatedAt,
  customerName,
  formatDisplayDateTime,
  theme,
}) => {
  return (
    <Box sx={{ mt: LAYOUT.spacing.sm, pt: LAYOUT.spacing.sm, borderTop: `1px solid ${theme.palette.divider}` }}>
      <Typography 
        variant="body2" 
        align="center" 
        color="text.secondary"
        sx={{ fontStyle: 'italic', mb: 1 }}
      >
        Bill generated on {formatDisplayDateTime(generatedAt)}
      </Typography>
      <Typography 
        variant="body2" 
        align="center" 
        color="text.secondary"
      >
        For: {customerName}
      </Typography>
    </Box>
  );
};

export default BillingInformation;
