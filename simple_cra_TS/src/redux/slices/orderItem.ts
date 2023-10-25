import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrderItem as createOrderItemAPI, getAllOrderItem as getAllOrderItemAPI} from "src/utils/axios";
import { addOrderItem, FetchBooks, FetchOrderItem, OrderBook } from "src/utils/types";

export interface addOrdersState {
    orderItems: FetchOrderItem[]
}


const initialState: addOrdersState = {
    orderItems: [ ]
}

export const  CreateOrderItemThunk = createAsyncThunk(
    'create/order_item',
    async (data:addOrderItem)=>{
        return createOrderItemAPI(data);
    }
)

export const FetchOrderItemThunk = createAsyncThunk(
    'fetch_all/order_items',
    async ()=>{
        return getAllOrderItemAPI()
    }
)

export const orderItemSlice = createSlice({
    name:'order',
    initialState,
    reducers:{
        addOrderItem:  (state, action: any)=>{
            
        }
    },extraReducers(builder) {
        builder
            .addCase(FetchOrderItemThunk.fulfilled,(state,action)=>{
                state.orderItems = action.payload.data;
            })
            .addCase(CreateOrderItemThunk.fulfilled, (state,action)=>{
              
            })
    },
});

export default orderItemSlice.reducer;

