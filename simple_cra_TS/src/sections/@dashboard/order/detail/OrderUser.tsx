import React from 'react'
import { useState } from 'react';
// form
import { useFormContext } from 'react-hook-form';
// @mui
import { Stack, Divider, Typography, Button } from '@mui/material';
// hooks
import useResponsive from '../../../../hooks/useResponsive';
// _mock
import { _invoiceAddressFrom, _invoiceAddressTo } from '../../../../_mock/arrays';
// components
import Iconify from '../../../../components/iconify';
//
import { useSelector } from 'src/redux/store';


export default function OrderUser() {
    const {
        watch,
        setValue,
        formState: { errors },
      } = useFormContext();
      const upMd = useResponsive('up', 'md');
    
      const values = watch();
    
      const { invoiceFrom, invoiceTo } = values;

    
      return (
        <Stack
          spacing={{ xs: 2, md: 5 }}
          direction={{ xs: 'column', md: 'row' }}
          divider={
            <Divider
              flexItem
              orientation={upMd ? 'vertical' : 'horizontal'}
              sx={{ borderStyle: 'dashed' }}
            />
          }
          sx={{ p: 3 }}
        >
          <Stack sx={{ width: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ color: 'text.disabled' }}>
                To:
              </Typography>
            </Stack>
            {invoiceTo ? (
              <AddressInfo name={invoiceTo.name} email={invoiceTo.email} address={invoiceTo.address} />
            ) : (
              <Typography typography="caption" sx={{ color: 'error.main' }}>
                {(errors.invoiceTo as any)?.message}
              </Typography>
            )}
          </Stack>
        </Stack>
      );
}
type AddressInfoProps = {
    name: string;
    email: string;
    address: string;
  };
  
  function AddressInfo({ name, email, address }: AddressInfoProps) {
    return (
      <>
        <Typography variant="subtitle2">{name}</Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 0.5 }}>
          Email: {email}
        </Typography>
        <Typography variant="body2">Address: {address}</Typography>
      </>
    );
  }

