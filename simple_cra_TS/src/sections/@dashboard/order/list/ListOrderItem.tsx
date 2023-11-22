import React, { useEffect, useState } from 'react'
import { FetchOrderItem } from 'src/utils/types';
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { fDate } from 'src/utils/formatTime';
import Label from 'src/components/label/Label';
import { useLocation } from 'react-router';
import MenuPopover from 'src/components/menu-popover';
import Iconify from 'src/components/iconify';
type Props = {
  row: FetchOrderItem;
  selected: boolean;
  onSelectRow: VoidFunction;
  onUpdateStatus: any
};

export default function ListOrderItem({
  row,
  selected,
  onSelectRow,
  onUpdateStatus
}: Props) {
  const [checkDate, setCheckDate] = useState("due")
  const { borrowedAt, returnedAt, order, orderItemId, book, quantity } = row;
  const [action, setAction] = useState('view');
  const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (new Date(Date.now()).getTime() - new Date(returnedAt).getTime() > 0) {
      setCheckDate('expired')
    }
    setAction(location.state.action)
  }, [])

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };


  const renderAction = () => {
    if (action == 'edit') {
      return (
        <Label
          variant="soft"
          color={checkDate === "due" && "success" || "error"}
          sx={{ textTransform: 'capitalize' }}
          onClick={handleOpenPopover}
        >
          {checkDate}
        </Label>
      )
    } else {
      return (
        <Label
          variant="soft"
          color={checkDate === "due" && "success" || "error"}
          sx={{ textTransform: 'capitalize' }}
        >
          {checkDate}
        </Label>
      )
    }
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={book.title} src={book.thumbnail!} />
            <div>
              <Typography variant="subtitle2" noWrap>
                {book.title}
              </Typography>
            </div>
          </Stack>
        </TableCell>
        <TableCell align="left">{quantity}</TableCell>
        <TableCell align="left">{book.price * quantity}</TableCell>
        <TableCell align="left">{book.borrowPrice * quantity * 7}</TableCell>
        <TableCell align="left">{fDate(borrowedAt)}</TableCell>
        <TableCell align="left">{fDate(returnedAt)}</TableCell>
        <TableCell align="left" >
          {renderAction()}
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
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            onUpdateStatus(book.id)
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:eye-fill" />
          Edit
        </MenuItem>
      </MenuPopover>
    </>
  )
}
