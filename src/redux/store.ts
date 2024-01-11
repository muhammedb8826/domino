import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/user/authentication";

const store = configureStore({
    reducer: {
        user: userReducer,
        admin: adminReducer,
    },
    });

export default store;