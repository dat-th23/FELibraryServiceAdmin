import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// @types
import { IInvoice, IInvoiceAddress } from '../../../../@types/invoice';
// mock
import { _invoiceAddressFrom } from '../../../../_mock/arrays';
// components
import FormProvider from '../../../../components/hook-form';
//
import OrderNewBook from './OrderNewBook';
import OrderNewUser from './OrderNewUser';
import OrderNewStatusDate from './OrderNewStatusDate';
import { FetchOrderItem, OrderBook_V1, User } from 'src/utils/types';

// ----------------------------------------------------------------------

type IFormValuesProps = Omit<OrderBook_V1,  'invoiceTo'>;

interface FormValuesProps extends IFormValuesProps {
  invoiceTo: OrderBook_V1 | null;
}

type Props = {
  isEdit?: boolean;
  currentOrder?: FormValuesProps;
};

export default function OrderNewForm({ isEdit, currentOrder }: Props) {
  const navigate = useNavigate();

  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);

  const NewUserSchema = Yup.object().shape({
  });

  const defaultValues = useMemo(
    () => ({
      type: currentOrder?.type || "VIRTUAL_WALLET",
      totalRent: currentOrder?.totalRent || undefined,
      status: currentOrder?.status || "AVAILABLE",
      invoiceTo: currentOrder?.invoiceTo || undefined,
      books: currentOrder?.books || [
        { title: '', borrowPrice: 0, quantity: 1, price: 0, total: 0 ,status:  "AVAILABLE",borrowedAt:  '', returnedAt: '',bookId: null},
      ],
      totalDeposit: currentOrder?.totalDeposit,
    }),
    [currentOrder]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentOrder) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentOrder]);

  const handleCreateAndSend = async (data: FormValuesProps) => {
    //setLoadingSend(true);
    console.log(data);
    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   reset();
    //   setLoadingSend(false);
    //   navigate(PATH_DASHBOARD.book.list);
    //   console.log('DATA', JSON.stringify(data, null, 2));
    // } catch (error) {
    //   console.error(error);
    //   setLoadingSend(false);
    // }
  };

  return (
    <FormProvider methods={methods}>
      <Card>
        <OrderNewUser />
        <OrderNewBook />
      </Card>

      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 3 }}>
        <LoadingButton
          size="large"
          variant="contained"
          loading={loadingSend && isSubmitting}
          onClick={handleSubmit(handleCreateAndSend)}
        >
          Create
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
