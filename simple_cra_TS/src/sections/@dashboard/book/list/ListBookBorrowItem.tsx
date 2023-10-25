import { Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React,{useState} from 'react'
import { useParams } from 'react-router';
import Scrollbar from 'src/components/scrollbar/Scrollbar'
import { TableEmptyRows, TableHeadCustom, TablePaginationCustom, useTable,emptyRows } from 'src/components/table';
import { useSelector } from 'src/redux/store';
import { FetchOrderItem } from 'src/utils/types';
import ListBorrowBookRow from './ListBorrowBookRow';

const TABLE_HEAD = [
    { id: 'username', label: 'username', align: 'left' },
    { id: 'email', label: 'Email', align: 'left' },
    { id: 'quantity', label: 'Quantity', align: 'left' },
    { id: 'price', label: 'Price', align: 'left' },
    { id: 'borrowedAt', label: 'Borrowed At', align: 'left' },
    { id: 'returnedAt', label: 'Returned At', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
  ];
export default function ListBookBorrowItem() {
    const {id} = useParams();
    const orderItemData = useSelector(state=> state.orderItem.orderItems.filter((otiem) => parseInt(otiem.book.id) === parseInt(id!)));

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
        <TableContainer sx={{ overflow: 'unset' }}>
            <Scrollbar>
                <Table sx={{ minWidth: 960 }}>
                        <TableHeadCustom
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={orderItemData.length}
                            numSelected={selected.length}
                            onSort={onSort}
                            onSelectAllRows={(checked) =>
                                onSelectAllRows(
                                    checked,
                                    orderItemData.map((row) => row.orderItemId+"")
                                )
                            }
                         />
                        <TableBody>
                            {orderItemData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                <ListBorrowBookRow
                                    key={row.order.orderId}
                                    row={row}
                                    selected={selected.includes(row.orderItemId+"")}
                                    onSelectRow={() => onSelectRow(row.orderItemId+"")}
                                />
                                ))}

                            <TableEmptyRows
                                height={denseHeight}
                                emptyRows={emptyRows(page, rowsPerPage, orderItemData.length)}
                            />

                            {/* <TableNoData isNotFound={isNotFound} /> */}
                        </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
          count={orderItemData.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          //
          dense={dense}
          onChangeDense={onChangeDense}/>
        <Divider sx={{ mt: 5 }} /> 
    </>
      

  )
}
