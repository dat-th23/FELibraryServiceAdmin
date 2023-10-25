import { useState, useMemo, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
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
import { OrderBook_V1 } from 'src/utils/types';
import OrderListItem from './OrderListItem';
import OrderUser from './OrderUser';
import { useSelector } from 'src/redux/store';
//

type IFormValuesProps = Omit<OrderBook_V1,  'invoiceTo'>;

interface FormValuesProps extends IFormValuesProps {
  invoiceTo: OrderBook_V1 | null;
}

type Props = {
  isEdit?: boolean;
  currentOrder?: FormValuesProps;
};

export default function DetailOrderForm({ isEdit, currentOrder }: Props) {

  const navigate = useNavigate();
  const {id} = useParams();
  const [loadingSave, setLoadingSave] = useState(false);

  const [loadingSend, setLoadingSend] = useState(false);
  const _orderItem = useSelector(state=> state.orderItem.orderItems.filter(ot => ot.order.orderId === id));
  const _order = useSelector(state => state.orderBook.orderBooks.find(data => data.orderId === id))
  const NewUserSchema = Yup.object().shape({
  });

  const defaultValues = useMemo(
    () => ({
      type: currentOrder?.type || "VIRTUAL_WALLET",
      totalRent: _order?.totalRent || undefined,
      status: currentOrder?.status || "AVAILABLE",
      invoiceTo: _order?.user || undefined,
      books: _orderItem,
      totalDeposit: _order?.totalDeposit,
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
  return (
    <>
      <FormProvider methods={methods}>
        <Card>
          <OrderUser />
          <OrderListItem _orderItem={_orderItem} _order={_order!}/>
        </Card>
      </FormProvider>
    </>
  );
}
