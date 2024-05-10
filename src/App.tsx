import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import About from "./pages/About";
import Services from "./pages/Services";
import LatestWork from "./pages/LatestWork";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import GetStarted from "./pages/GetStarted";
import Home from "./pages/Home";
import "./assets/styles/main.css";
import NotFound from "./components/header/NotFound";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./common/Loader";
import DefaultLayout from "./layout/DefaultLayout";
import ECommerce from "./pages/Dashboard/ECommerce";
import SignIn from "./pages/Authentication/SignIn";
import OrdersList from "./components/order/OrdersList";
import User from "./components/user/User";
import { Products } from "./pages/inventory/Products";
import { Suppliers } from "./pages/inventory/Suppliers";
import { Categories } from "./pages/inventory/Categories";
import { Purschase } from "./pages/inventory/Purschase";
import { OrderRegistration } from "./components/order/OrderRegistration";
import OrderDetailsPage from "./components/order/OrderDetailsPage";
import { PurchaseRegistration } from "./pages/inventory/PurchaseRegistration";
import { Stock } from "./pages/inventory/Stock";
import {Sale} from "./pages/inventory/Sale";
import { SaleRegistration } from "./pages/inventory/SaleRegistration";
import Setting from "./components/setting/Setting";
import { CommissionList } from "./components/commission/CommissionList";
import Pricing from "./components/pricing/Pricing";
import { CustomerList } from "./components/customer/CustomerList";
import { Notifications } from "./components/header/Notifications";
import { OperatorNotification } from "./components/header/OperatorNotification";
import { ReceptionistNotification } from "./components/header/ReceptionistNotification";
import { FinanceNotification } from "./components/header/FinanceNotification";
import { StoreNotifications } from "./components/header/StoreNotifications";
import { OperatorStore } from "./pages/inventory/OperatorStore";
import { SaleDetails } from "./pages/inventory/SaleDetails";
import { PurchaseDetails } from "./pages/inventory/PurchaseDetails";
import { OperatorStoreSaleDetails } from "./pages/inventory/OperatorStoreSaleDetails";
import CommissionDetailsPage from "./components/commission/CommissionDetailsPage";
import { ServicesList } from "./pages/inventory/ServicesList";
import Profile from "./pages/Profile";
import Settings from "./pages/AccountSettings";
import AccountSettings from "./pages/AccountSettings";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        {/* <Route path="/auth/signup" element={<SignUp />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/latest-work" element={<LatestWork />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route element={<PrivateRoute />}>
            <Route path="/add-order" element={<OrderRegistration />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/dashboard" element={<DefaultLayout />}>
            <Route path="/dashboard/ecommerce" element={<ECommerce />} />
            <Route index element={<OrdersList />} />
            <Route path="/dashboard/notifications/:id" element={<Notifications/>}/>
            <Route path="/dashboard/operator-notifications" element={<OperatorNotification />}/>
            <Route path="/dashboard/receptionist-notifications" element={<ReceptionistNotification/>}/>
            <Route path="/dashboard/finance-notifications" element={<FinanceNotification/>}/>
            <Route path="/dashboard/store-notifications" element={<StoreNotifications/>}/>
            <Route path="/dashboard/profile" element={<Profile/>}/>
            <Route path="/dashboard/account-settings" element={<AccountSettings/>}/>
            {/* <Route path="/dashboard/forms/form-elements" element={<FormElements/>}/> */}
            {/* <Route path="/dashboard/forms/form-layout" element={<FormLayout />} /> */}
            {/* <Route path="/dashboard/ui/alerts" element={<Alerts />} /> */}
            <Route path="/dashboard/user" element={<User/>}/>
            <Route path="/dashboard/customers" element={<CustomerList />} />
            {/* <Route path="/dashboard/ui/buttons" element={<Buttons />} /> */}
            <Route path="/dashboard/settings" element={<Setting />} />
            <Route path="/dashboard/pricing" element={<Pricing/>}/>
            <Route path="/dashboard/commission" element={<CommissionList/>}/>
            <Route path="/dashboard/commission/:id" element={<CommissionDetailsPage/>}/>
            <Route path="/dashboard/inventory/products" element={<Products/>}/>
            <Route path="/dashboard/inventory/operator-store" element={<OperatorStore/>}/>
            <Route path="/dashboard/inventory/category" element={<Categories/>}/>
            <Route path="/dashboard/inventory/service" element={<ServicesList/>}/>
            <Route path="/dashboard/inventory/suppliers" element={<Suppliers/>}/>
            <Route path="/dashboard/inventory/purchases" element={<Purschase/>}/>
            <Route path="/dashboard/inventory/purchases/:id" element={<PurchaseDetails />}/>
            <Route path="/dashboard/inventory/purchases/add" element={<PurchaseRegistration/>}/>
            <Route path="/dashboard/inventory/stock" element={<Stock/>}/>
            <Route path="/dashboard/inventory/sales" element={<Sale />} />
            <Route path="/dashboard/inventory/sales/:id" element={<SaleDetails />} />
            <Route path="/dashboard/inventory/operator-store/:id" element={<OperatorStoreSaleDetails />} />
            <Route path="/dashboard/inventory/sales/add" element={<SaleRegistration />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
