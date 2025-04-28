import { createTheme, PaletteOptions } from '@mui/material/styles';

// App color palette
export const COLORS = {
  // Background colors
  background: '#F9FAFB',      // Light gray background
  cardBackground: '#FFFFFF',  // White cards
  summaryBackground: '#F3F4F6', // Light gray for summary sections
  hoverBackground: '#F1F5F9', // Subtle hover effect
  
  // Text colors
  textPrimary: '#111827',     // Nearly black for main text
  textSecondary: '#6B7280',   // Medium gray for less important text
  textDisabled: '#9CA3AF',    // Light gray for disabled text
  
  // Brand colors
  accent: '#D4AF37',          // Gold accent (primary brand color)
  accentDark: '#C49C26',      // Darker gold for hover states
  
  // UI elements
  divider: '#E5E7EB',         // Light gray dividers
  iconColor: '#1F2937',       // Dark gray icons
  
  // State colors
  error: '#DC2626',           // Red for errors
  errorLight: '#FEF2F2',      // Light red background
  errorBorder: '#FEE2E2',     // Red border
  errorText: '#7F1D1D',       // Dark red text
  success: '#059669',         // Green for success states
  warning: '#D97706',         // Amber for warnings
};

// Layout constants
export const LAYOUT = {
  borderRadius: 8,            // Default corner radius
  buttonBorderRadius: 8,      // Button corners
  mainBorderRadius: 12,       // Main containers
  spacing: {
    xs: 2,                    // 8px
    sm: 4,                    // 16px
    md: 8,                    // 32px
    lg: 12,                   // 48px
    xl: 16,                   // 64px
  },
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Subtle shadow
};

// MUI breakpoints
const BREAKPOINTS = {
  values: {
    xs: 0,     // Phone
    sm: 600,   // Tablet
    md: 900,   // Small laptop
    lg: 1200,  // Desktop
    xl: 1536,  // Large display
  },
};

// Theme palette configuration
const palette: PaletteOptions = {
  primary: {
    main: COLORS.accent,
    light: '#DFC158',
    dark: COLORS.accentDark,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: COLORS.iconColor,
    light: '#4B5563',
    dark: '#111827',
    contrastText: '#FFFFFF',
  },
  error: {
    main: COLORS.error,
    light: '#f87171',
    dark: '#dc2626',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: COLORS.warning,
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#FFFFFF',
  },
  info: {
    main: COLORS.accent,
    light: '#DFC158', 
    dark: COLORS.accentDark,
    contrastText: '#FFFFFF',
  },
  success: {
    main: COLORS.success,
    light: '#34d399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: COLORS.textPrimary,
    secondary: COLORS.textSecondary,
    disabled: COLORS.textDisabled,
  },
  background: {
    default: COLORS.background,
    paper: COLORS.cardBackground,
  },
  divider: COLORS.divider,
};

// Create the MUI theme
const theme = createTheme({
  breakpoints: BREAKPOINTS,
  palette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { 
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    body1: { fontWeight: 400 },
    body2: {
      fontWeight: 400,
      color: COLORS.textSecondary,
    }
  },
  shape: {
    borderRadius: LAYOUT.borderRadius,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: COLORS.background,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a0a0a0',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: LAYOUT.boxShadow,
          borderRadius: LAYOUT.borderRadius,
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        },
        elevation2: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
          borderRadius: LAYOUT.borderRadius,
          overflow: 'hidden',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: LAYOUT.buttonBorderRadius,
          textTransform: 'none',
          boxShadow: 'none',
          padding: '8px 20px',
          fontWeight: 600,
          transition: 'all 0.2s',
          height: '44px',
          '&:hover': {
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: COLORS.accent,
          '&:hover': {
            background: COLORS.accentDark,
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderBottom: `1px solid ${COLORS.divider}`,
          height: '60px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: COLORS.background,
          color: COLORS.textSecondary,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: COLORS.background,
          },
          '&:hover': {
            backgroundColor: COLORS.hoverBackground,
          },
          '&.MuiTableRow-footer': {
            backgroundColor: COLORS.summaryBackground,
            fontWeight: 700,
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '16px 0',
          borderColor: COLORS.divider,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: LAYOUT.borderRadius,
          overflow: 'hidden',
        }
      }
    },
  },
});

export default theme; 