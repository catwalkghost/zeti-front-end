import React from 'react';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { BillFormat } from '../../Lib/Utils/BillFormatter';
import FormatSelector from '../FormatSelector';
import { COLORS, LAYOUT } from '../../Lib/Theme/theme';

type BillGeneratorHeaderProps = {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  downloadFormat: BillFormat;
  onFormatChange: (format: BillFormat) => void;
  onDownload: () => void;
  isDownloading: boolean;
  billExists: boolean;
  formatDisplayDate: (dateString: string) => string;
};

const BillGeneratorHeader: React.FC<BillGeneratorHeaderProps> = ({
  dateRange,
  downloadFormat,
  onFormatChange,
  onDownload,
  isDownloading,
  billExists,
  formatDisplayDate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFormatChange = (format: BillFormat) => {
    onFormatChange(format);
  };

  return (
    <Box sx={{ mb: LAYOUT.spacing.sm }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: COLORS.textPrimary,
          mb: 1
        }}
      >
        Vehicle Usage Bill
      </Typography>

      <Typography
        variant="subtitle1"
        color={COLORS.textSecondary}
        gutterBottom
        sx={{ mb: 3 }}
      >
        Billing period {formatDisplayDate(dateRange.startDate)} – {formatDisplayDate(dateRange.endDate)}
      </Typography>

      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        gap: 3,
        flexWrap: 'wrap',
        flexDirection: isMobile ? 'column' : 'row',
        mt: isMobile ? 2 : 0
      }}>
        <Box sx={{
          width: isMobile ? '100%' : 'auto',
          mt: isMobile ? 0 : 0
        }}>
          <FormatSelector
            value={downloadFormat}
            onChange={handleFormatChange}
            disabled={!billExists || isDownloading}
            sx={{
              width: isMobile ? '100%' : 'auto'
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={onDownload}
          disabled={!billExists || isDownloading}
          sx={{
            bgcolor: COLORS.accent,
            '&:hover': {
              bgcolor: COLORS.accentDark,
            },
            height: 44,
            px: 3,
            fontWeight: 600,
            borderRadius: '8px',
            textTransform: 'none',
            width: isMobile ? '100%' : 'auto'
          }}
          startIcon={<DownloadIcon />}
        >
          {isDownloading ? 'Downloading...' : 'Download Bill'}
        </Button>
      </Box>
    </Box>
  );
};

export default BillGeneratorHeader;