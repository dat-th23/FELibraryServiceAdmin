// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { FetchCategory } from 'src/utils/types';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 160;

type Props = {
  filterTitle: string;
  isFiltered: boolean;
  filterCategory: string;
  optionsCategory: FetchCategory[];
  onResetFilter: VoidFunction;
  onFilterTitle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function BookTableToolbar({
  filterTitle,
  isFiltered,
  onFilterTitle,
  filterCategory,
  onResetFilter,
  optionsCategory,
  onFilterCategory,
}: Props) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        select
        label="category type"
        value={filterCategory}
        onChange={onFilterCategory}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: { maxHeight: 220 },
            },
          },
        }}
        sx={{
          maxWidth: { md: INPUT_WIDTH },
          textTransform: 'capitalize',
        }}
      >
         <MenuItem
            value=''
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
              '&:first-of-type': { mt: 0 },
              '&:last-of-type': { mb: 0 },
            }}
          >
            All
          </MenuItem>
        {optionsCategory.map((option) => (
          <MenuItem
            key={option.categoryId}
            value={option.name}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
              '&:first-of-type': { mt: 0 },
              '&:last-of-type': { mb: 0 },
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterTitle}
        onChange={onFilterTitle}
        placeholder="Search client or Book number..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
    </Stack>
  );
}
