import { useState } from 'react';
// @mui
import {
  Link,
  Stack,
  Button,
  Divider,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Avatar,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// @types
import { IInvoice } from '../../../../@types/invoice';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { CustomAvatar } from '../../../../components/custom-avatar';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';
import { OrderBook } from 'src/utils/types';

// ----------------------------------------------------------------------

type Props = {
  row: OrderBook;
  selected: boolean;
  onSelectRow: VoidFunction;
  onViewRow: VoidFunction;
};

export default function OrderTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
}: Props) {
  const {  phoneNumber, createdAt, updatedAt, status, user, totalDeposit,totalRent } = row;

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

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={user.name} src={user.avatar} />

            <div>
              <Typography variant="subtitle2" noWrap>
                {user.username}
              </Typography>
              <Typography variant="subtitle2" noWrap>
                {user.email}
              </Typography>
            </div>
          </Stack>
        </TableCell>

        <TableCell align="left">{fDate(createdAt!)}</TableCell>

        <TableCell align="left">{fDate(updatedAt!)}</TableCell>

        <TableCell align="center">{fCurrency(totalDeposit + totalRent)}</TableCell>

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
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
      </MenuPopover>
    </>
  );
}
