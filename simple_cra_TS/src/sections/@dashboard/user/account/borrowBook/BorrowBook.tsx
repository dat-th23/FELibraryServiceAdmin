import { LoadingButton } from '@mui/lab';
import { Button, Card, CardHeader, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { SetStateAction, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import EmptyContent from 'src/components/empty-content/EmptyContent';
import Iconify from 'src/components/iconify/Iconify';
import { createOrderThunk, deleteOrderItemStore,fetchOrderBookThunk,onDecreaseQty,onIncreaseQty, updateOrderThunk } from 'src/redux/slices/order';
import { CreateOrderItemThunk } from 'src/redux/slices/orderItem';
import { useDispatch, useSelector } from 'src/redux/store';
import TableBookAddCart from 'src/sections/@dashboard/shop/TableBookAddCart';
import { createOrderItem } from 'src/utils/axios';
import { addOrderItem, OrderBook } from 'src/utils/types';
import CheckoutSummary from './CheckoutSummary';
import OrderListBook from './OrderListBook';
 export type TypeTotal ={
  deposit : number;
  rent: number;
  sum:  number
}

type Props={
  setShowFormConfirm: (type: boolean)=> void;
  setOrderUpdate: (data: OrderBook) => void;
}

export default function BorrowBook({setShowFormConfirm,setOrderUpdate}:Props) {
    const {email}= useParams();
    const { enqueueSnackbar } = useSnackbar();
    const user = useSelector((state)=>state.users.users.find(u=> u.email === email));
    var totalCount  = 0
    const [isSubmitting,setIsSupmmiting] = useState(false);
    const [showFormBook, setShowFormBook] = useState(false);
    const [showFormOrder, setShowFormOrder] = useState(false);
    const [objectTotalOrder ,setObjectTotalOrder] = useState<TypeTotal>({"deposit": 0,"rent": 0 ,"sum":0});
    const [totalOrder,setTotalOrder] = useState<number>(0);
    const [orderSetup,setOrderSetup] = useState<addOrderItem[] | []>([]);
    const dispatch = useDispatch();
    const order = useSelector((state)=> state.orderBook.orderBooks.find((or=> or.user.id === user?.id && or.status === "PENDING")));
    const orderStore = useSelector((state)=>state.orderBook.addOrder);

    useMemo(()=>{
      if(orderStore.length >0){
        for(var i = 0;  i < orderStore.length; ++i){
          objectTotalOrder.deposit += orderStore[i].quantity * orderStore[i].book.price;
          objectTotalOrder.rent += orderStore[i].quantity *orderStore[i].book.borrowPrice * (new Date(orderStore[i].returnedAt).getTime() - new Date(orderStore[i].borrowedAt).getTime())/(1000*3600*24) 
          totalCount+= (orderStore[i].quantity *(orderStore[i].book.borrowPrice*(new Date(orderStore[i].returnedAt).getTime() - new Date(orderStore[i].borrowedAt).getTime())/(1000*3600*24) + orderStore[i].book.price) )
        }
        setObjectTotalOrder(objectTotalOrder);
        setTotalOrder(totalCount);
        setShowFormOrder(true);
      }
    },[orderStore]);

    async  function handleCreateOrder (){
      try {
        if(user!= undefined){
          setIsSupmmiting(true);
          dispatch(createOrderThunk(
            {
              userId: user?.id,
              fullName:user?.username,
              email: user?.email,
              phoneNumber: null,
              address: user.address,
              totalDeposit: null,
              totalRent: null
            }))
            setIsSupmmiting(false);
            setShowFormBook(true);
        }
            
      } catch (err) {
        console.log(err);
      }
    }
    const handleApplyDiscount = (value: number) => {
      
    };

    const onDeleteCart = (orderitem: addOrderItem)=>{
      dispatch(deleteOrderItemStore(orderitem))
      setObjectTotalOrder({"deposit": 0,"rent": 0 ,"sum":0})
    }

    const onIncreaseQuantity = (orderitem: addOrderItem)=>{
      dispatch(onIncreaseQty(orderitem));
      setObjectTotalOrder({"deposit": 0,"rent": 0 ,"sum":0})
    }

    const onDecreaseQuantity =(orderitem: addOrderItem)=>{
      dispatch(onDecreaseQty(orderitem))
      setObjectTotalOrder({"deposit": 0,"rent": 0 ,"sum":0})
    }

    const handleCheckOut =async ()=>{
       try {
          if(orderStore.length>0){
            for(var i = 0 ; i <  orderStore.length ; i++){
              await createOrderItem(orderStore[i]);
            }
            //setShowFormConfirm(true)
            if(order !== undefined){
              var orderUpdate: OrderBook = {
                orderId: order?.orderId,
                fullName: order?.fullName,
                email:  order?.email,
                type: "VIRTUAL_WALLET",
                status: "AVAILABLE",
                phoneNumber: order?.phoneNumber,
                address: order?.address,
                totalDeposit: objectTotalOrder.deposit,
                totalRent: objectTotalOrder.rent,
                user: order.user
              }
              setOrderUpdate(orderUpdate)
              dispatch(updateOrderThunk(orderUpdate))
            }
          }
         
       } catch (err) {
          console.log(err)
       }
    }

    
  return (
    <div>
      {order ? <>
        <Grid container spacing={3}>
          <Grid item  xs={12} md={9}>
            {
              showFormBook ? 
              <>
                <TableBookAddCart 
                    orderBook={order} 
                    closeFormListBook={setShowFormBook}  
                    setTotalOrder={setTotalOrder} 
                    totalOrder = {totalOrder}
                />
              </>:
              <Card style={{"height": "500px" }} sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <CardHeader
                      title={
                        <Typography variant="h6">
                          Cart
                          <Typography component="span" sx={{ color: 'text.secondary' }}>
                            &nbsp;({orderStore.length} item)
                          </Typography>
                        </Typography>
                      }
                      sx={{ mb: 3 }}
                    />

                    <Button
                      sx={{ m: 3 }}
                      size="small"
                      variant="soft"
                      onClick={()=>setShowFormBook(true)}
                      startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                      Add book Item
                    </Button>
                  </Stack>
                  {
                    showFormOrder  ? <OrderListBook
                      products={orderStore}  
                      onDelete={onDeleteCart}
                      onIncreaseQuantity={onIncreaseQuantity}
                      onDecreaseQuantity={onDecreaseQuantity}
                    /> : <EmptyContent
                    title="Cart is empty"
                    description="Look like you have no items in your shopping cart."
                    img="/assets/illustrations/illustration_empty_cart.svg"
                  />
                  }
                 
              </Card>
            }
            
          </Grid>
          <Grid item xs={12} md={3}>
        <CheckoutSummary
          enableDiscount
          total={totalOrder}
          objectTotalOrder = {objectTotalOrder}
          discount={0}
          subtotal={0}
          onApplyDiscount={handleApplyDiscount}
        />
        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleCheckOut}
        >
          Create
        </Button>
          </Grid>
        </Grid>
      </>:
      (
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          onClick={()=>handleCreateOrder()}
        >
          Create Order
        </LoadingButton>

      )}
      
    </div>
  )
}
