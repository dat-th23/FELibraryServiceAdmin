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
import { User } from 'src/utils/types';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  selected: (selectedId: string) => boolean;
  onClose: VoidFunction;
  onSelect: (user: User | null) => void;
  userOptions: User[];
};
function OrderUserDialog({
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

  const handleSelectAddress = (user: User | null) => {
    onSelect(user);
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
        <Typography variant="h6"> Select address </Typography>

        <Button
          size="small"
          startIcon={<Iconify icon="eva:plus-fill" />}
          sx={{ alignSelf: 'flex-end' }}
        >
          Add New
        </Button>
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
          {dataFiltered.map((user) => (
            <ListItemButton
              key={user.id}
              selected={selected(user.email)}
              onClick={() => handleSelectAddress(user)}
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
              <Typography variant="subtitle2">{user.username}</Typography>

              <Typography
                variant="caption"
                component="div"
                sx={{
                  my: 0.5,
                  color: 'info.main',
                  fontWeight: 'fontWeightMedium',
                }}
              >
                {user.email}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.address}
              </Typography>
            </ListItemButton>
          ))}
        </Scrollbar>
      )}
    </Dialog>
  );
}

function applyFilter(array: User[], query: string) {
  if (query) {
    return array.filter(
      (address) =>
        address.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        address.email.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        address.address.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return array;
}


export default OrderUserDialog