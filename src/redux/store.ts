import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import authReducer from "./features/user/authentication";
import productReducer from "./features/product/productSlice";
import orderReducer from "./features/order/orderSlice";
import printingReducer from "./features/print/printingSlice";
import customerReducer  from "./features/customer/customerSlice";


const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        product: productReducer,
        order: orderReducer,
        printing: printingReducer,
        customer: customerReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = EnhancedStore<RootState>;
