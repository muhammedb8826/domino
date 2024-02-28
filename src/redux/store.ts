import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import authReducer from "./features/user/authentication";
import productReducer from "./features/product/productSlice";
import orderReducer from "./features/order/orderSlice";
import printingReducer from "./features/print/printingSlice";
import customerReducer  from "./features/customer/customerSlice";
import serviceReducer from "./features/service/servicesSlice";
import machineReducer from "./features/machine/machineSlice";
import materialReducer from "./features/material/materialSlice";
import unitReducer from "./features/unit/unitSlice";
import priceReducer from "./features/price/pricingSlice";
import roleReducer from "./features/role/roleSlice";
import discountReducer from "./features/dicount/dicountSlice";
const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        product: productReducer,
        order: orderReducer,
        printing: printingReducer,
        customer: customerReducer,
        service: serviceReducer,
        machine: machineReducer,
        material: materialReducer,
        unit: unitReducer,
        price: priceReducer,
        role: roleReducer,
        discount: discountReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = EnhancedStore<RootState>;
