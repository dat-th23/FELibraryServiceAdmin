import React, { useEffect, useState } from 'react'
import { FetchOrderItem } from 'src/utils/types';
import {
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    MenuItem,
    TableCell,
    IconButton,
    Typography,
    Divider,
  } from '@mui/material';
import { fDate } from 'src/utils/formatTime';
import Label from 'src/components/label/Label';
type Props = {
    row: FetchOrderItem;
    selected: boolean;
    onSelectRow: VoidFunction;
  };
  
export default function ListBorrowBookRow({
    row,
    selected,
    onSelectRow,
  }: Props) {
    const [checkDate,setCheckDate] = useState("due")
    const { borrowedAt,returnedAt, order,orderItemId,book,quantity} = row;
    console.log(book)
    useEffect(()=>{
      if(new  Date(Date.now()).getTime() - new Date(returnedAt).getTime()>0){
        setCheckDate('expired')
      }
    },[])
   

  return (
    <>
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell align="left">{order.user.username}</TableCell>
      <TableCell align="left">{order.user.email}</TableCell>
      <TableCell align="left">{quantity}</TableCell>
      <TableCell align="left">{order.totalRent  * quantity}</TableCell>
      <TableCell align="left">{fDate(borrowedAt)}</TableCell>
      <TableCell align="left">{fDate(returnedAt)}</TableCell>
      <TableCell align="left" >
        <Label
            variant="soft"
            color={checkDate === "due" && "success" || "error"}  
            sx={{ textTransform: 'capitalize' }}
          >
              {checkDate}
          </Label>
          
      </TableCell>
    </TableRow>
  </>
  )
}
