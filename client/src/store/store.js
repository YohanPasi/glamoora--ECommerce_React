import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice'; // Import your auth slice
import adminProductSlice from './admin/product-slice'

const store = configureStore({
  reducer: {
    auth: authReducer, // Attach the auth slice to the store
    adminProducts: adminProductSlice,
  },
});

export default store;
