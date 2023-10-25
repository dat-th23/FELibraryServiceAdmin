import React from 'react'
// @mui
import { Stack, Link, Button, Typography } from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { fCurrency } from '../../../../../utils/formatNumber';
// @types
import { IUserAccountBillingInvoice } from '../../../../../@types/user';
// components
import Iconify from '../../../../../components/iconify';
import { ReportOrderbyUserIdType } from 'src/utils/types';

// ----------------------------------------------------------------------

type Props = {
  dataReport: ReportOrderbyUserIdType[];
};

export default function AccountBillingBookHistory({ dataReport }: Props) {
  console.log(1)
  return (
    <Stack spacing={3} alignItems="flex-end">
      <Typography variant="overline" sx={{ width: 1, color: 'text.secondary' }}>
         Report Order
      </Typography>

      <Stack spacing={2} sx={{ width: 1 }}>
        {dataReport?.map((data,index) => (
          <Stack key={index} direction="row" justifyContent="space-between" sx={{ width: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 120 }}>
              {data.month}
            </Typography>

            <Typography variant="body2">{fCurrency(data.totalDeposit)}</Typography>

            <Typography variant="body2">{fCurrency(data.totalRent)}</Typography>
          </Stack>
        ))}
      </Stack>

      <Button size="small" color="inherit" endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}>
        All invoices
      </Button>
    </Stack>
  )
}
