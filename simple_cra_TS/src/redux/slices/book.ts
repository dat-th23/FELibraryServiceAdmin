import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createBook as createBookAPI, listBooks as listBooksAPI,getBookById as getBookByIdAPI } from "src/utils/axios";
import { CreateBook, FetchBooks } from "src/utils/types";

export interface BooksState {
    books: FetchBooks[];
   
}


const initialState: BooksState = {
    books: [],
   
}

export const createBookThunk = createAsyncThunk(
    'books/create',
    async (data: CreateBook) => {
        return createBookAPI(data);
    }
)

export const  fetchBookThunk =  createAsyncThunk(
    'books/fetch',
    async () => {
        return listBooksAPI();
    }
)

export const getBookByIdThunk = createAsyncThunk('books/getById',async(id: number)=>{
    return getBookByIdAPI(id);
})

export const booksSlice =  createSlice({
    name:'books',
    initialState,
    reducers:{
        

    },
    extraReducers(builder) {
        builder
            .addCase(createBookThunk.fulfilled,(state,action)=>{
                state.books.push(action.payload.data);
                
            })
            .addCase(fetchBookThunk.fulfilled,(state,action)=>{
                state.books =action.payload.data;
               
            })
    },
});

export default booksSlice.reducer;
    