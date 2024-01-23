import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import authReducer from "./features/user/authentication";
import productReducer from "./features/user/productSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        product: productReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = EnhancedStore<RootState>;
