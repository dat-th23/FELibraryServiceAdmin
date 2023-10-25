import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCategorys } from "src/utils/axios";
import { FetchCategory } from "src/utils/types"


export interface CategorysState {
    categories: FetchCategory[];
}

const initialState: CategorysState = {
    categories: [],
}

export const fetchCategoriesThunk = createAsyncThunk(
    'categories/fectch',
    async () => {
        return getCategorys();
    }
)

export const categorySlice =  createSlice({
    name:'category',
    initialState,
    reducers:{

    },
    extraReducers(builder) {
        builder.addCase(fetchCategoriesThunk.fulfilled,(state,action)=>{
          
            state.categories =action.payload.data;
        })
    },
});

export default categorySlice.reducer;