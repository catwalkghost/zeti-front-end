import React from 'react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import BillGenerator from './Components/BillGenerator';
import theme from './Lib/Theme/theme.ts';


const App: React.FC = () => {
  /** Date range for the billing period
  * This is hardcoded due to the task requirements
  * For production a date-time selector should be used
   **/
  const startDate = '2021-02-01T00:00:00Z';
  const endDate = '2021-02-28T23:59:00Z';
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <BillGenerator 
          startDate={startDate} 
          endDate={endDate} 
        />
        <Box 
          component="footer" 
          sx={{ 
            mt: 0, 
            py: 1,
            px: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper
          }}
        >
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center' }}
          >
            CatwalkGhost 2025. Made with 💛
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
