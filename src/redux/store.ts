import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import authReducer from "./features/user/authentication";
import productReducer from "./features/product/productSlice";
import orderReducer from "./features/order/orderSlice";
import printingReducer from "./features/print/printingSlice";
import customerReducer  from "./features/customer/customerSlice";
import commissionReducer  from "./features/commission/commissionSlice";
import serviceReducer from "./features/service/servicesSlice";
import unitReducer from "./features/unit/unitSlice";
import priceReducer from "./features/price/pricingSlice";
import roleReducer from "./features/role/roleSlice";
import discountReducer from "./features/dicount/dicountSlice";
import supplierReducer from "./features/supplier/suppliersSlice";
import categoryReducer from "./features/category/categorySlice";
import purchaseReducer from "./features/purchaseSlice";
import saleReducer from "./features/saleSlice";
import printedTransactionsReducer from "./features/printedTransactionsSlice";
import stockReducer from "./features/stockSlice";
import jobOrderProductReducer from "./features/jobOrderProductsSlice";
import salesPartnersReducer from "./features/salesPartnersSlice";
import paymentReducer from "./features/paymentSlice";
import notesReducer from "./features/notesSlice";
import purchaseNotesReducer from "./features/purchaseNotesSlice";
const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        product: productReducer,
        order: orderReducer,
        printing: printingReducer,
        customer: customerReducer,
        commission: commissionReducer,
        service: serviceReducer,
        unit: unitReducer,
        price: priceReducer,
        role: roleReducer,
        discount: discountReducer,
        supplier: supplierReducer,
        category: categoryReducer,
        purchase: purchaseReducer,
        sale: saleReducer,
        printedTransaction: printedTransactionsReducer,
        stock: stockReducer,
        jobOrderProduct: jobOrderProductReducer,
        salesPartner: salesPartnersReducer,
        payment: paymentReducer,
        note: notesReducer,
        purchaseNote: purchaseNotesReducer
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = EnhancedStore<RootState>;
