import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Box
} from '@mui/material';
import { BillFormat } from '../../Lib/Utils/BillFormatter';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridOnIcon from '@mui/icons-material/GridOn';
import CodeIcon from '@mui/icons-material/Code';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DataObjectIcon from '@mui/icons-material/DataObject';

// Define props directly to ensure proper typing
interface FormatSelectorProps {
  value: BillFormat;
  onChange: (format: BillFormat) => void;
  disabled?: boolean;
  sx?: any;
}

// Dropdown to pick the bill format for download
const FormatSelector: React.FC<FormatSelectorProps> = ({ value, onChange, disabled = false, sx }) => {
  // Handle dropdown change
  const handleChange = (event: SelectChangeEvent) => {
    // Ensure value is explicitly cast to BillFormat
    const formatValue = event.target.value as BillFormat;
    onChange(formatValue);
  };

  return (
    <FormControl 
      sx={{ 
        minWidth: 120,
        ...sx
      }}
      disabled={disabled}
    >
      <InputLabel id="format-label">Format</InputLabel>
      <Select
        labelId="format-label"
        value={value}
        label="Format"
        onChange={handleChange}
        sx={{ height: '44px' }}
      >
        <MenuItem value={BillFormat.PDF}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
            <PictureAsPdfIcon fontSize="small" />
          </Box>
          PDF
        </MenuItem>
        <MenuItem value={BillFormat.CSV}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
            <TableRowsIcon fontSize="small" />
          </Box>
          CSV
        </MenuItem>
        <MenuItem value={BillFormat.JSON}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
            <CodeIcon fontSize="small" />
          </Box>
          JSON
        </MenuItem>
        <MenuItem value={BillFormat.HTML}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
            <GridOnIcon fontSize="small" />
          </Box>
          HTML
        </MenuItem>
        <MenuItem value={BillFormat.XML}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
            <DataObjectIcon fontSize="small" />
          </Box>
          XML
        </MenuItem>
        <MenuItem value={BillFormat.TEXT}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
            <TextSnippetIcon fontSize="small" />
          </Box>
          Text
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default FormatSelector; 