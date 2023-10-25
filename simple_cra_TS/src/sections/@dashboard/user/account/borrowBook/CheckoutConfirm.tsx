

import React, { useEffect } from 'react'
import { useState } from 'react';
// @mui
import { Grid, Card, Button, Typography, Stack, Box } from '@mui/material';
import { _addressBooks } from 'src/_mock/arrays';
import CheckoutSummary from './CheckoutSummary';
import { FetchOrderItem, OrderBook } from 'src/utils/types';
import { checkoutSuccess, deleteOrderItem, getOrderItem } from 'src/utils/axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import { updateOrderThunk } from 'src/redux/slices/order';
import { useDispatch } from 'src/redux/store';

  type Props ={
    order: OrderBook;
    setOrderUpdate: (data: OrderBook| undefined) => void;
  }
  
export default function CheckoutConfirm({order,setOrderUpdate}:Props) {
  const { enqueueSnackbar } = useSnackbar();
    const [open, setOpen] = useState  (false);
    const [checkOrder,setCheckOrder] = useState(false);
    const [orderItemArr,setOrderItemArr] = useState<FetchOrderItem[]>([]);

    useEffect(()=>{
      const fetchData =async () => {
        try {
         const res = await getOrderItem(order.orderId);
         if(res.data.length ===1){
          setCheckOrder(true);
         }
         setOrderItemArr(res.data);
        } catch (err) {
          console.log(err);
        }
      }
      fetchData();
    },[order,setOrderUpdate]);
    
  

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    
    async function handleClickCheckout(){
      try {
          if(order!= undefined){
            setOpen(true);
            if(order.user.virtualWallet < order?.totalRent!+ order?.totalDeposit!){
              enqueueSnackbar('There is not enough money in the user\'s account!',{variant:'error'});
              setOpen(false);
              return;
            }
            await checkoutSuccess(order.orderId);
            setOrderUpdate(undefined)
            setOpen(false);
          }
      } catch (err) {
        console.log(err);
      }
    }

    return (
      <>
      {
        open  ? 
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        : (
          <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
             {orderItemArr.filter(o=>o.order.orderId === order.orderId).map((data, index) => (
              <AddressItem
                key={index}
                data={data}
                checkOrder={checkOrder}
                setCheckOrder={setCheckOrder}
                setOrderUpdate={setOrderUpdate}
              />
            ))} 
          </Grid>
  
          <Grid item xs={12} md={4}>
            <CheckoutSummary subtotal={0} objectTotalOrder={{"deposit":order.totalDeposit,"rent": order.totalRent, "sum": 0 }} total={order.totalRent+ order.totalDeposit} discount={0} />
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={handleClickCheckout}
              >
                Checkout
            </Button>
          </Grid>
        </Grid>
        )
      }
        
  
        {/* <CheckoutBillingNewAddressForm
          open={open}
          onClose={handleClose}
          onCreateBilling={onCreateBilling}
        /> */}
      </>
    );
}



type AddressItemProps = {
    data: FetchOrderItem;
    checkOrder: boolean;
    setCheckOrder: (type: boolean) =>void;
    setOrderUpdate: (data: OrderBook| undefined) => void;
  //  onCreateBilling: VoidFunction;
  };
  
  function AddressItem({ data ,setOrderUpdate,checkOrder,setCheckOrder}: AddressItemProps) {
    const { borrowedAt, returnedAt, quantity, order,book,orderItemId } = data;
    const [open, setOpen] = useState  (false);
    const dispatch = useDispatch()
    const handleDeleteOrdetItem = async (id: number)=>{
      setOrderUpdate({
        orderId: order.orderId,
        type: order.type,
        fullName: order.fullName,
        email: order.email,
        phoneNumber: order.phoneNumber,
        address: order.address,
        status: order.status,
        totalDeposit: order.totalDeposit - book.price * quantity,
        totalRent: order.totalRent - (book.borrowPrice * 7 * quantity),
        user: order.user,
      });
      try {
        setOpen(true);
        await deleteOrderItem(id);
        if(checkOrder === true){
          order.status = "PENDING";
          order.totalDeposit = order.totalDeposit - book.price * quantity;
          order.totalRent = order.totalRent - (book.borrowPrice * 7 * quantity);
         dispatch(updateOrderThunk(order))
         setOrderUpdate(undefined)
        }
        setOpen(false);
      } catch (err) {
        console.log(err)
      }
    }

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <>
        {
          open ?  (
            <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
          ):
            (
              <Card
                sx={{
                  p: 3,
                  mb: 3,
                }}
              >
                <Stack
                  spacing={2}
                  alignItems={{
                    md: 'flex-end',
                  }}
                  direction={{
                    xs: 'column',
                    md: 'row',
                  }}
                >
                  <Stack flexGrow={1} spacing={1}>
                    <Stack direction="row" alignItems="center">
                      <Typography variant="subtitle1">
                        {order.user.name}
                        <Box component="span" sx={{ ml: 0.5, typography: 'body2', color: 'text.secondary' }}>
                          ({order.user.email})
                        </Box>
                      </Typography>
                    </Stack>
                    <Typography variant="body2">Address: {order.user.address}</Typography>
                    <Typography variant="body2">Title Book: {book.title}</Typography>
                    <Typography variant="body2">Price: {book.price}</Typography>
                    <Typography variant="body2">Borray Price: {book.borrowPrice}</Typography>
                    <Typography variant="body2">Day number: {(new  Date(returnedAt).getTime() - new  Date(borrowedAt).getTime())/(1000*3600*24)}</Typography>
                    <Typography variant="body2">Quantity: {quantity}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Borrowed  Day  : {new  Date(borrowedAt).toString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Return  Day  : {new  Date(returnedAt).toString()}
                    </Typography>
                  </Stack>
          
                  <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                      <Button variant="outlined" size="small" color="inherit" sx={{ mr: 1 }} onClick={()=>handleDeleteOrdetItem(orderItemId)}>
                        Delete
                      </Button>
                    {/* <Button variant="outlined" size="small" onClick={onCreateBilling}>
                      Deliver to this Address
                    </Button> */}
                  </Stack>
                </Stack>
              </Card>
            )

        }
      </>
      
    );
  }