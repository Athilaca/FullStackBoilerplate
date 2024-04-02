import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './axiosInstance';

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async () => {
    try {
       const response = await axiosInstance.get('/admin-dashboard'); 
      return response.data;
    } catch (error) {
      
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async ({ userId, token }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/delete-user/${userId}`);
      return response.data;
    } catch (error) {
      // Handle the error
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ userId,updatedUser, token }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/update-user/${userId}`,updatedUser);
      return response.data;
    } catch (error) {
      // Handle the error
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addUser = createAsyncThunk(
  'admin/addUser',
  async ({ newUser, token }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/add-user', newUser);
      return response.data;
    } catch (error) {
      // Handle the error
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out the deleted user from the state
        state.users = state.users.filter((user) => user.id !== action.payload.id);
      })
      // Handle rejected state
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
       .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default adminSlice.reducer;
