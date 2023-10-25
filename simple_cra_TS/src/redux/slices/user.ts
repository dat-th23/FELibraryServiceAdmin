import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createUser as createUseAPI, listUsers as listUsersAPI, updateUser } from "src/utils/axios";
import { CreateBook, CreateUser, UpdateUser, User } from "src/utils/types";
import { RootState } from "../store";



export interface UsersState {
    users: User[];
}


const initialState: UsersState = {
    users: [],
}

export const fetchUserThunk  = createAsyncThunk(
    'fetch/user',
    async () => {
        return listUsersAPI();
    }
);

export  const updateUserThunk = createAsyncThunk(
    'update/user',
    async(data: UpdateUser)=>{
        return updateUser(data);
    }
)

export const createUserThunk = createAsyncThunk(
    'create/user',
    async(data:CreateUser)=>{
        return createUseAPI(data);
    }
)

export const usersSlice =  createSlice({
    name:'users',
    initialState,
    reducers:{
        getAllUser: (state,action: PayloadAction<User[]> )=>{

        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUserThunk.fulfilled,(state,action)=>{
                state.users =action.payload.data;
            })
            .addCase(createUserThunk.fulfilled,(state,action)=>{
                state.users.push(action.payload.data);
            })
            .addCase(updateUserThunk.fulfilled, (state,action)=>{

            })
    },
});

const selectUser =(state:RootState) => state.users;

export const getAllUser = createSelector(selectUser,(state)=>state.users);



export default usersSlice.reducer;
    