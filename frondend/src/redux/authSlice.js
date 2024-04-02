import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action creator for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register', userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async action creator for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', userData);
      const { access } = response.data;
      localStorage.setItem('accessToken', access); 
      localStorage.setItem('user', JSON.stringify(response.data.user)); 
      return response.data;
    } catch (error) {
      console.log('Login error:', error); 
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const uploadProfilePicture = createAsyncThunk(
  'auth/uploadProfilePicture',
  async (formData, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('http://127.0.0.1:8000/api/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Profile picture upload error:', error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  
  initialState: {
    user:null,
    accessToken: localStorage.getItem('accessToken') || null,
    loading: false,
    error: null,
  },
  reducers: {
    updateProfilePicture(state, action) {
      state.user = action.payload;
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.email;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.user=null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        console.log(action.payload.user)
        state.accessToken = localStorage.getItem('accessToken');
        
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.detail;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.detail;
      });
  },
});

export const { updateProfilePicture } = authSlice.actions
export default authSlice.reducer;



