import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createOrder as createOrderAPI, createOrderItem as createOrderItemAPI, listOrders as listOrdersAPI, updateOrder  as updateOrderAPI } from "src/utils/axios";
import { addOrderItem, CreateOrder, OrderBook } from "src/utils/types";
import { RootState } from "../store";


export interface OrderBooksState {
    orderBooks: OrderBook[];
    addOrder : addOrderItem[];
}


const initialState: OrderBooksState = {
    orderBooks: [],
    addOrder:[],
}

export const fetchOrderBookThunk = createAsyncThunk(
    'fetch/order',
    async ()=>{
        return listOrdersAPI()
    }
)

export const createOrderThunk = createAsyncThunk(
    'create/order',
    async (data:CreateOrder)=>{
        return createOrderAPI(data);
    }
);

export const updateOrderThunk = createAsyncThunk(
    'update/order',
    async (data:OrderBook)=>{
        return updateOrderAPI(data);
    }
);




export const orderBookSlice = createSlice({
    name:'orders',
    initialState,
    reducers:{
        addOrderItemStore : (state, action:PayloadAction<addOrderItem[]>)=>{
                state.addOrder = action.payload;
        },
        deleteOrderItemStore : (state, action:PayloadAction<addOrderItem>)=>{
            const checkAddOrder = state.addOrder.filter(add => add.bookId !== action.payload.bookId);
            state.addOrder = checkAddOrder;
        },
        onIncreaseQty : (state,action:PayloadAction<addOrderItem>)=>{
            const findOrder  = state.addOrder.find(add => add.bookId === action.payload.bookId);
            const orderItemIndex = state.addOrder.findIndex(add=> add.bookId === action.payload.bookId)
            if(findOrder){
                findOrder.quantity++;
                state.addOrder[orderItemIndex] = findOrder
            }
        },
        onDecreaseQty: (state,action:PayloadAction<addOrderItem>)=>{
            const findOrder  = state.addOrder.find(add => add.bookId === action.payload.bookId);
            const orderItemIndex = state.addOrder.findIndex(add=> add.bookId === action.payload.bookId)
           
            if(findOrder){
                findOrder.quantity--;
                state.addOrder[orderItemIndex] = findOrder
            }
           
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchOrderBookThunk.fulfilled,(state,action)=>{
                state.orderBooks = action.payload.data;
            })
            .addCase(createOrderThunk.fulfilled,(state,action)=>{
                state.orderBooks.push(action.payload.data);
            })
            .addCase(updateOrderThunk.fulfilled,(state,action)=>{
                const order= action.payload.data;
                const findOrderIndex = state.orderBooks.findIndex(ob=> ob.orderId === order.orderId);
                if(findOrderIndex){
                    state.orderBooks[findOrderIndex] = order;
                }
            })
    },
});
 const selectOrder =(state:RootState) => state.orderBook;

 export const getAllOrder = createSelector(selectOrder,(state)=>state.orderBooks);


export const {addOrderItemStore,deleteOrderItemStore,onIncreaseQty,onDecreaseQty} = orderBookSlice.actions;

export default orderBookSlice.reducer;
