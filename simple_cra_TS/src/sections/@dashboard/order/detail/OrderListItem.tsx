import sum from 'lodash/sum';
import { useCallback, useEffect, useState } from 'react';
// form
import { useFormContext, useFieldArray } from 'react-hook-form';
// @mui
import { Box, Stack, Button, Divider, Typography, InputAdornment, MenuItem, TableContainer, Table, TableBody } from '@mui/material';
// utils
import { fNumber, fCurrency } from '../../../../utils/formatNumber';
import { useNavigate, useParams } from 'react-router-dom';
// @types
import { IInvoiceItem } from '../../../../@types/invoice';
// components
import Iconify from '../../../../components/iconify';
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';
import { useSelector } from 'src/redux/store';
import { AddOrderItem_V1, FetchBooks, FetchOrderItem, OrderBook } from 'src/utils/types';
import { useSnackbar } from 'notistack';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { emptyRows, TableEmptyRows, TableHeadCustom, useTable } from 'src/components/table';
import ListBorrowBookRow from '../../book/list/ListBorrowBookRow';
import ListOrderItem from '../list/ListOrderItem';

// ----------------------------------------------------------------------

type Props = {
  _orderItem: FetchOrderItem[];
  _order: OrderBook;
};

const TABLE_HEAD = [
  { id: 'book', label: 'Book', align: 'left' },
  { id: 'quantity', label: 'Quantity', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'borrowBook', label: 'BorrowBook', align: 'left' },
  { id: 'borrowedAt', label: 'Borrowed At', align: 'left' },
  { id: 'returnedAt', label: 'Returned At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
];
export default function OrderListItem({_orderItem,_order}: Props) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const denseHeight = dense ? 56 : 76;

  
    return (
      <>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            Details:
          </Typography>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Scrollbar>
                <Table sx={{ minWidth: 960 }}>
                        <TableHeadCustom
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={_orderItem.length}
                            numSelected={selected.length}
                            onSort={onSort}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    _orderItem.map((row) => row.orderItemId+"")
                                )
                            }
                         />
                        <TableBody>
                            {_orderItem
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                <ListOrderItem
                                    key={row.order.orderId}
                                    row={row}
                                    selected={selected.includes(row.orderItemId+"")}
                                    onSelectRow={() => onSelectRow(row.orderItemId+"")}
                                />
                                ))}

                            <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(page, rowsPerPage, _orderItem.length)}
                            />

                            {/* <TableNoData isNotFound={isNotFound} /> */}
                        </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>
          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
    
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="flex-end">
              <Typography>TotalRent :</Typography>
              <Typography
                sx={{ textAlign: 'right', width: 120 }}
              >
                {fCurrency(_order.totalRent)}
              </Typography>
            </Stack>
    
            <Stack direction="row" justifyContent="flex-end">
              <Typography>TotalDeposit :</Typography>
              <Typography sx={{ textAlign: 'right', width: 120 }}>
                {fCurrency(_order.totalDeposit)}
              </Typography>
            </Stack>
    
            <Stack direction="row" justifyContent="flex-end">
              <Typography variant="h6">Total price :</Typography>
              <Typography variant="h6" sx={{ textAlign: 'right', width: 120 }}>
              {fCurrency(_order.totalDeposit +_order.totalRent)} 
              </Typography>
            </Stack>
          </Stack>
        </Box>
       
      </>
    );
}
