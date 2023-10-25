import { useState } from 'react';
// @mui
import {
  Stack,
  Dialog,
  Button,
  TextField,
  Typography,
  ListItemButton,
  InputAdornment,
} from '@mui/material';
// @types
import { IInvoiceAddress } from '../../../../@types/invoice';
// components
import Iconify from '../../../../components/iconify';
import Scrollbar from '../../../../components/scrollbar';
import SearchNotFound from '../../../../components/search-not-found';
import { FetchBooks, User } from 'src/utils/types';

// ----------------------------------------------------------------------

type Props = {
  index: number | null
  open: boolean;
  selected: (selectedId: string) => boolean;
  onClose: VoidFunction;
  onSelect: (data: FetchBooks | null,indexFields: number) => void;
  userOptions: FetchBooks[];
};

export default function OrderAddBookDialog({
    index,
    open,
    selected,
    onClose,
    onSelect,
    userOptions,
  }: Props) {
    const [searchUser, setSearchUser] = useState('');
    
    const dataFiltered = applyFilter(userOptions, searchUser);
  
    const isNotFound = !dataFiltered.length && !!searchUser;
  
    const handleSearchAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchUser(event.target.value);
    };
  
    const handleSelectAddress = (data: FetchBooks | null,indexFields: number) => {
      onSelect(data,indexFields);
      setSearchUser('');
      onClose();
    };
  
    return (
      <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pt: 2.5, px: 3 }}
        >
          <Typography variant="h6">Select List Books </Typography>
  
          
        </Stack>
  
        <Stack sx={{ p: 2.5 }}>
          <TextField
            value={searchUser}
            onChange={handleSearchAddress}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
  
        {isNotFound ? (
          <SearchNotFound query={searchUser} sx={{ px: 3, pt: 5, pb: 10 }} />
        ) : (
          <Scrollbar sx={{ p: 1.5, pt: 0, maxHeight: 80 * 8 }}>
            {dataFiltered.map((data) => (
              <ListItemButton
                key={data.id}
                selected={selected(data.id)}
                onClick={() => handleSelectAddress(data,index!)}
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  },
                }}
              >
                <Typography variant="subtitle2">Title: {data.title}</Typography>
                <Typography variant="subtitle2">Amount: {data.amount}</Typography>
              
              </ListItemButton>
            ))}
          </Scrollbar>
        )}
      </Dialog>
    );
}

function applyFilter(array: FetchBooks[], query: string) {
    if (query) {
      return array.filter(
        (address) =>
          address.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
  
    return array;
  }
  