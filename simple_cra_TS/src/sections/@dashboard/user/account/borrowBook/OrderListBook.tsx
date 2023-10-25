// @mui
import { Table, TableBody, TableContainer } from '@mui/material';
import { addOrderItem } from 'src/utils/types';
// @types
import { ICheckoutCartItem } from '../../../../../@types/product';
// components
import Scrollbar from '../../../../../components/scrollbar';
import { TableHeadCustom } from '../../../../../components/table';
//
import OrderBook from './OrderBook';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'borrow', label: 'borrow' },
  { id:'borrowedDays',label:'borrowed days'},
  { id: 'quantity', label: 'Quantity' },
  { id: 'totalPrice', label: 'Total Price', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

type Props = {
  products: addOrderItem[];
  onDelete: (id: addOrderItem) => void;
  onDecreaseQuantity: (id: addOrderItem) => void;
  onIncreaseQuantity: (id: addOrderItem) => void;
};

export default function OrderListBook({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  return (
    <TableContainer sx={{ maxHeight: 440 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row) => (
              <OrderBook
                key={row.order.orderId}
                row={row}
                onDelete={() => onDelete(row)}
                onDecrease={() => onDecreaseQuantity(row)}
                onIncrease={() => onIncreaseQuantity(row)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
