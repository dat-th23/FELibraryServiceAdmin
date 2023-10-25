import { IconButton, Stack, Table, TableBody, TableContainer, Tooltip } from '@mui/material';
import { SetState } from 'immer/dist/internal';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { emptyRows, TableEmptyRows, TableHeadCustom, TablePaginationCustom, TableSelectedAction, useTable } from 'src/components/table';
import { addOrderItemStore } from 'src/redux/slices/order';
import { useDispatch, useSelector } from 'src/redux/store'
import { addOrderItem, FetchBooks, OrderBook } from 'src/utils/types';
import { number } from 'yup';
import { InvoiceTableRow } from '../invoice/list';
import CartBookRow from './CartBookRow';
const TABLE_HEAD = [
    { id: 'invoiceNumber', label: 'Client', align: 'left' },
    { id: 'title', label: 'Title', align: 'left' },
    { id: 'price', label: 'Price', align: 'left' },
    { id: 'borrow', label: 'Borrow', align: 'left' },
    { id: 'quantity', label: 'Quantity', align: 'left' },
    { id: 'status', label: 'Status', align: 'left' },
    { id: '' },
  ];

  type  Props={
    orderBook: OrderBook;
    closeFormListBook: (type: boolean) => void;
    setTotalOrder:  (type: number)=>void;
    totalOrder: number;
  }



export default function TableBookAddCart({orderBook,closeFormListBook,totalOrder,setTotalOrder}: Props) {
    const dispatch = useDispatch();
    const [bookObject,setBookObject] = useState<{[id: string]:FetchBooks}>({})
    

    const bookData = useSelector(state=> state.books.books);
    for(var i = 0; i <bookData.length ; i++ ){
        bookObject[bookData[i].id+""] = bookData[i];
    }
   
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
        onChangeRowsPerPage
      } = useTable({ defaultOrderBy: 'createDate' });
     
      const [tableData, setTableData] = useState(bookData);
      const denseHeight = dense ? 56 : 76;
      const handleOpenConfirm = () => {};

      function handleSaveOrder(){
        if(selected.length!== 0){
            const bookStore: addOrderItem[]= [];
            for(var i = 0 ; i < selected.length ; i++){
                totalOrder+= (bookObject[selected[i]+""].price + bookObject[selected[i]+""].borrowPrice);
                var startedDate = new  Date(Date.now()).getTime()
                bookStore.push({
                    order:orderBook,
                    book:bookObject[selected[i]+""],
                    bookId: parseInt(bookObject[selected[i]+""].id),
                    quantity: 1,
                    borrowedAt: new  Date(startedDate).toISOString(),
                    returnedAt : new  Date(startedDate + 7*24*3600*1000).toISOString()
                })
                       
            }
            setTotalOrder(totalOrder);
            dispatch(addOrderItemStore(bookStore))
            closeFormListBook(false);
        }
      }
  return (
    <>
        <TableContainer>
        <TableSelectedAction
                dense={dense}
                numSelected={selected.length}
                rowCount={tableData.length}
                onSelectAllRows={(checked) =>
                    onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                    )
                }
                action={
                    <Stack direction="row">
                    <Tooltip 
                        title="Save"
                        onClick={handleSaveOrder}
                    >
                        <IconButton color="primary">
                        <Iconify icon="ic:round-send" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Cancel">
                        <IconButton color="primary" onClick={handleOpenConfirm}>
                        <Iconify icon="eva:trash-2-outline" />
                        </IconButton>
                    </Tooltip>
                    </Stack>
                }
                />
            <Scrollbar>
                <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                    <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                        onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                        )
                    }
                    />
                    <TableBody>
                        {tableData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                            <CartBookRow
                                key={row.id}
                                row={row}
                                selected={selected.includes(row.id)}
                                onSelectRow={() => onSelectRow(row.id)}
                            />
                            ))}

                        <TableEmptyRows
                            height={denseHeight}
                            emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                        />

                        {/* <TableNoData isNotFound={isNotFound} /> */}
                    </TableBody>
                </Table>
            </Scrollbar>
        </TableContainer>
        <TablePaginationCustom
                count={tableData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                //
                dense={dense}
                onChangeDense={onChangeDense}
            />
       
    </>

  )
}
