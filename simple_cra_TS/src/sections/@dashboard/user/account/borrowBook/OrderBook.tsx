// @mui
import { Box, Stack, Divider, TableRow, TableCell, Typography, IconButton, TextField } from '@mui/material';
// utils
import { fCurrency } from '../../../../../utils/formatNumber';
// @types
import { ICheckoutCartItem } from '../../../../../@types/product';
// components
import Image from '../../../../../components/image';
import Label from '../../../../../components/label';
import Iconify from '../../../../../components/iconify';
import { ColorPreview } from 'src/components/color-utils';
import { IncrementerButton } from '../../../../../components/custom-input';
import { addOrderItem } from 'src/utils/types';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { Controller, useFormContext } from 'react-hook-form';
import { RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type CheckoutProductListRowProps = {
  row: addOrderItem;
  onDelete: VoidFunction;
  onDecrease: VoidFunction;
  onIncrease: VoidFunction;
};
export default function OrderBook({
    row,
    onDelete,
    onDecrease,
    onIncrease,
  }: CheckoutProductListRowProps) {
    const [value, setValue] = useState<Date|null>(new Date());
    const { book, order, quantity} = row;

    return (
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            alt="product image"
            src={book?.thumbnail!}
            sx={{ width: 64, height: 64, borderRadius: 1.5, mr: 2 }}
          />
  
          <Stack spacing={0.5}>
            <Typography noWrap variant="subtitle2" sx={{ maxWidth: 200 }}>
              {book.title}
            </Typography>
  
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'body2', color: 'text.secondary' }}
            >
              {/* size: <Label sx={{ ml: 0.5 }}> {size} </Label>
              <Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
              <ColorPreview colors={colors} /> */}
            </Stack>
          </Stack>
        </TableCell>
  
        <TableCell>{fCurrency(book.price)}</TableCell>
        <TableCell>{fCurrency(book.borrowPrice)}</TableCell>
        <TableCell>7</TableCell>
        <TableCell>
          <Box sx={{ width: 96, textAlign: 'right' }}>
            <IncrementerButton
              quantity={quantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              disabledDecrease={quantity <= 1}
              disabledIncrease={quantity >= book.amount}
            />
  
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              available: {quantity}
            </Typography>
          </Box>
        </TableCell>
  
        <TableCell align="right">{fCurrency((book.price + book.borrowPrice )* quantity)}</TableCell>
  
        <TableCell align="right">
          <IconButton onClick={onDelete}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </TableCell>
      </TableRow>
  )
}
