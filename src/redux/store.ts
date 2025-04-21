
//redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import authReducer from '../features/products/registrationSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
