import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  SxProps,
  Theme
} from '@mui/material';
import { BillFormat } from '../utils/BillFormatter';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridOnIcon from '@mui/icons-material/GridOn';
import CodeIcon from '@mui/icons-material/Code';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import DataObjectIcon from '@mui/icons-material/DataObject';

type FormatSelectorProps = {
  value: BillFormat;
  onChange: (value: BillFormat) => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

const FormatSelector: React.FC<FormatSelectorProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  sx
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as BillFormat);
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
      >
        <MenuItem value={BillFormat.PDF}>
          <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
          PDF
        </MenuItem>
        <MenuItem value={BillFormat.CSV}>
          <TableRowsIcon fontSize="small" sx={{ mr: 1 }} />
          CSV
        </MenuItem>
        <MenuItem value={BillFormat.JSON}>
          <CodeIcon fontSize="small" sx={{ mr: 1 }} />
          JSON
        </MenuItem>
        <MenuItem value={BillFormat.HTML}>
          <GridOnIcon fontSize="small" sx={{ mr: 1 }} />
          HTML
        </MenuItem>
        <MenuItem value={BillFormat.XML}>
          <DataObjectIcon fontSize="small" sx={{ mr: 1 }} />
          XML
        </MenuItem>
        <MenuItem value={BillFormat.TEXT}>
          <TextSnippetIcon fontSize="small" sx={{ mr: 1 }} />
          Text
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default FormatSelector; 