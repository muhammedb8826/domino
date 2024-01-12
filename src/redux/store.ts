import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import  authReducer  from "./features/user/authentication";

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
    },
    });

export default store;