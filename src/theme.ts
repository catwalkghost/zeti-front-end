import { createTheme, PaletteOptions } from '@mui/material/styles';

/**
 * Date Range Constants
 * Fixed date range for Bob's Taxis billing period
 */
export const FIXED_START_DATE = "2021-02-01T00:00:00Z";
export const FIXED_END_DATE = "2021-02-28T23:59:00Z";

/**
 * Company Information
 * Default company information for billing
 */
export const DEFAULT_COMPANY_NAME = "Bob's Taxis";

/**
 * Theme Colors
 * Color palette for the application
 */
export const COLORS = {
  // Background colors
  background: '#F9FAFB',      // Very light gray - soft luxury feel
  cardBackground: '#FFFFFF',  // Pure clean white
  summaryBackground: '#F3F4F6', // Light gray for summary boxes
  hoverBackground: '#F1F5F9', // Light gray for hover states
  
  // Text colors
  textPrimary: '#111827',     // Primary text color (dark gray)
  textSecondary: '#6B7280',   // Secondary text color (medium gray)
  textDisabled: '#9CA3AF',    // Disabled/caption text (light gray)
  
  // Accent colors
  accent: '#D4AF37',          // Primary accent color (gold)
  accentDark: '#C49C26',      // Darker accent for hover states
  
  // UI elements
  divider: '#E5E7EB',         // Very light gray for gentle separation
  iconColor: '#1F2937',       // Muted black for icons
  
  // State colors
  error: '#DC2626',           // Error state color (red)
  errorLight: '#FEF2F2',      // Light error background
  errorBorder: '#FEE2E2',     // Error border color
  success: '#059669',         // Success state color (green)
  warning: '#D97706',         // Warning state color (amber)
};

/**
 * Layout Constants
 * General measurements for layout
 */
export const LAYOUT = {
  borderRadius: 8,            // Default border radius for components
  buttonBorderRadius: 8,      // Button border radius
  mainBorderRadius: 12,       // Main content wrapper border radius
  spacing: {
    xs: 2,                    // Extra small spacing (8px)
    sm: 4,                    // Small spacing (16px)
    md: 8,                    // Medium spacing (32px)
    lg: 12,                   // Large spacing (48px)
    xl: 16,                   // Extra large spacing (64px)
  },
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Default box shadow
};

// Define breakpoints
type BreakpointValues = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

const BREAKPOINTS: { values: BreakpointValues } = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Color palette based on design specs
const palette: PaletteOptions = {
  primary: {
    main: COLORS.accent, 
    light: '#DFC158',
    dark: COLORS.accentDark,
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: COLORS.iconColor, // muted black as secondary
    light: '#4B5563',
    dark: '#111827',
    contrastText: '#FFFFFF',
  },
  error: {
    main: COLORS.error, // red-500
    light: '#f87171', // red-400
    dark: '#dc2626', // red-600
    contrastText: '#FFFFFF',
  },
  warning: {
    main: COLORS.warning, // amber-500
    light: '#fbbf24', // amber-400
    dark: '#d97706', // amber-600
    contrastText: '#FFFFFF',
  },
  info: {
    main: COLORS.accent, // gold for info as well
    light: '#DFC158', 
    dark: COLORS.accentDark,
    contrastText: '#FFFFFF',
  },
  success: {
    main: COLORS.success, // emerald-500
    light: '#34d399', // emerald-400
    dark: '#059669', // emerald-600
    contrastText: '#FFFFFF',
  },
  text: {
    primary: COLORS.textPrimary, // charcoal black
    secondary: COLORS.textSecondary, // gray-500
    disabled: COLORS.textDisabled,
  },
  background: {
    default: COLORS.background, // very light gray
    paper: COLORS.cardBackground,
  },
  divider: COLORS.divider, // gray-200
};

// Create theme
const theme = createTheme({
  breakpoints: BREAKPOINTS,
  palette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    body1: {
      fontWeight: 400,
    },
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
          height: '60px', // Increased row height for elegance
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