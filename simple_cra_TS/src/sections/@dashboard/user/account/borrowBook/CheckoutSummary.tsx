// @mui
import {
    Box,
    Card,
    Stack,
    Button,
    Divider,
    TextField,
    CardHeader,
    Typography,
    CardContent,
    InputAdornment,
  } from '@mui/material';
  // utils
  import { fCurrency } from 'src/utils/formatNumber';
  // components
  import Iconify from 'src/components/iconify';
import { TypeTotal } from './BorrowBook';
  
  // ----------------------------------------------------------------------
  
  type Props = {
    total: number;
    discount?: number;
    subtotal: number;
    objectTotalOrder?: TypeTotal;
    shipping?: number;
    onEdit?: VoidFunction;
    enableEdit?: boolean;
    onApplyDiscount?: (discount: number) => void;
    enableDiscount?: boolean;
  };
  
  export default function CheckoutSummary({
    total,
    onEdit,
    discount,
    subtotal,
    shipping,
    objectTotalOrder,
    onApplyDiscount,
    enableEdit = false,
    enableDiscount = false,
  }: Props) {
    const displayShipping = shipping !== null ? 'Free' : '-';
  
    return (
      <>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Order Summary"
          action={
            enableEdit && (
              <Button size="small" onClick={onEdit} startIcon={<Iconify icon="eva:edit-fill" />}>
                Edit
              </Button>
            )
          }
        />
  
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Deposit
              </Typography>
              <Typography variant="subtitle2">{fCurrency(objectTotalOrder?.deposit!)}</Typography>
            </Stack>
  
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Rent
              </Typography>
              <Typography variant="subtitle2">{fCurrency(objectTotalOrder?.rent!)}</Typography>
            </Stack>
  
  
            <Divider />
  
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="subtitle1">Total</Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle1" sx={{ color: 'error.main' }}>
                  {fCurrency(total)}
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  (VAT included if applicable)
                </Typography>
              </Box>
            </Stack>
  
            {enableDiscount && onApplyDiscount && (
              <TextField
                fullWidth
                placeholder="Discount codes / Gifts"
                value="DISCOUNT5"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button onClick={() => onApplyDiscount(5)} sx={{ mr: -0.5 }}>
                        Apply
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </CardContent>
      </Card>
      </>
    );
  }
  