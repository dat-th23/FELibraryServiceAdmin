import { useState } from 'react';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// @mui
import {
  Link,
  Button,
  Divider,
  Stack,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  TextField,
} from '@mui/material';
// utils
import { fDate } from 'src/utils/formatTime';
import { fCurrency } from 'src/utils/formatNumber';
// @types
import { IInvoice } from 'src/@types/invoice';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { CustomAvatar } from 'src/components/custom-avatar';
import MenuPopover from 'src/components/menu-popover';
import ConfirmDialog from 'src/components/confirm-dialog';
import { FetchBooks } from 'src/utils/types';
import { Controller, useFormContext } from 'react-hook-form';

// ----------------------------------------------------------------------
const INPUT_WIDTH = 160;
const PADDING = 2;
type Props = {
  row: FetchBooks;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function CartBookRow({
  row,
  selected,
  onSelectRow,
}: Props) {
  const { id, title, createdAt, author, status,price,amount ,borrowPrice} = row;
  const [value, setValue] = useState<Date|null>(new Date());
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangeValueDate = ()=>{
    
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Typography variant="subtitle2" noWrap>
                {id}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">{title}</TableCell>
        <TableCell align="left">{borrowPrice}</TableCell>
        <TableCell align="left">{price}</TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {amount}
        </TableCell>
       
        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === 'paid' && 'success') ||
              (status === 'unpaid' && 'warning') ||
              (status === 'overdue' && 'error') ||
              'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
