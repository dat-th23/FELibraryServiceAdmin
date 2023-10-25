// @mui
import { Box, Card, Button, Typography, Stack, Divider, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { returnBook } from 'src/utils/axios';
import { fDate } from 'src/utils/formatTime';
import { FetchOrderItem } from 'src/utils/types';
// @types
import { IUserAccountBillingAddress } from '../../../../../@types/user';
// components
import Iconify from '../../../../../components/iconify';

// ----------------------------------------------------------------------

type Props = {
  orderItems: FetchOrderItem[];
};

export default function AccountBillingBook({ orderItems }: Props) {

    return (
        <Card sx={{ p: 3 }} style={{height: "600px",overflowY: "scroll"}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              Billing Info
            </Typography>
          </Stack>
    
          <Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
            {orderItems.map((ortiem) => (
              <ListOrdeItem key={ortiem.orderItemId} orderItem={ortiem} />
            ))}
          </Stack>
        </Card>
      );
}

type PropsItem = {
  orderItem: FetchOrderItem
}

function ListOrdeItem ({orderItem}:PropsItem){

  const [checkDate ,setCheckDate]= useState(false);
  const [checkReturnBook, setCheckReturnBook] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(()=>{
    if(new  Date(Date.now()).getTime() >  new  Date(orderItem.returnedAt).getTime()){
      setCheckDate(true)
    }
    if(orderItem.status ===  "RETURN_OVERDUE_DATE"){
      setCheckReturnBook(1);
      setCheckDate(false);
    }
    if(orderItem.status === "RETURN_OK"){
      setCheckReturnBook(2);
      setCheckDate(false);
    }
  },[orderItem]);

  const handleReturnBook = async (id: number)=>{
    try {
      await returnBook(id);
      enqueueSnackbar('Success Complete the return of the book!');
    } catch (err) {
      enqueueSnackbar(err,{variant:'error'});
    }
  }
  return (
    <>
        <Stack  style={{padding:"10px" ,borderRadius:  "10px"}} bgcolor={checkDate  ?"#FFAC82" : "#C8FACD"}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }} >
            <Typography variant="subtitle1">{orderItem.book.title}</Typography>
            <Button size="small">
              {checkReturnBook === 1 && "Returned the book but it's too low"}
              {checkReturnBook === 2 && "Paid the book on time"}
              {checkReturnBook === 0 && "Borrowing a book"}
            </Button> 
          </Stack>
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
              Address:
            </Box>
            {orderItem.order.address}
          </Typography>
          <Grid container>
            <Grid item xs={4} md={4}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  Deposit:
                </Box>
                {orderItem.quantity * orderItem.book.price}VND
              </Typography>
            </Grid>
            <Grid item xs={4} md={4}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  Rent:
                </Box>
                {orderItem.quantity * orderItem.book.borrowPrice * (new Date(orderItem.returnedAt).getTime() - new Date(orderItem.borrowedAt).getTime())/ (1000*3600*24)}VND
              </Typography>
            </Grid>
            <Grid item xs={4} md={4}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  Quantity:
                </Box>
                {orderItem.quantity}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4} md={4}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  Borrow Day:
                </Box>
                {fDate(orderItem.borrowedAt)}
              </Typography>
            </Grid>
            <Grid item xs={4} md={4}>
              <Typography variant="body2">
                <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                  Return Day:
                </Box>
                {fDate(orderItem.returnedAt)}
              </Typography>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={1}>
            {
              checkReturnBook === 0 &&  
              <Button color="error" size="small" startIcon={<Iconify icon="eva:trash-2-outline" />} onClick={()=>handleReturnBook(orderItem.orderItemId)}>
                return books
              </Button>
            }
            
{/* 
              <Button size="small" startIcon={<Iconify icon="eva:edit-fill" />}>
                Edit
              </Button> */}
            </Stack>
        </Stack>
    </>
  )
}
