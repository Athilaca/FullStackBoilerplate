
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authSlice'
import adminReducer from './redux/adminSlice' 
import adminAuthReducer from './redux/adminAuthSlice' 

export default configureStore({
  reducer: {
    auth: authReducer,
    admin:adminReducer,
    adminAuth: adminAuthReducer,
  },
});

