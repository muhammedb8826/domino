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
import Profile from "./pages/Profile";
import FormElements from "./pages/Form/FormElements";
import Calendar from "./pages/Calendar";
import Tables from "./pages/Tables";
import OrdersList from "./components/order/OrdersList";
import FormLayout from "./pages/Form/FormLayout";
import Buttons from "./pages/UiElements/Buttons";
import User from "./components/user/User";
import Alerts from "./pages/UiElements/Alerts";
import Chart from "./pages/Chart";
import { Products } from "./pages/inventory/Products";
import { Suppliers } from "./pages/inventory/Suppliers";
import Setting from "./components/setting/Setting";
import Settings from "./pages/Settings";
import Material from "./components/setting/Material";
import { Categories } from "./pages/inventory/Categories";
import { Purschase } from "./pages/inventory/Purschase";
import { OrderRegistration } from "./components/order/OrderRegistration";
import OrderDetailsPage from "./components/order/OrderDetailsPage";

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
            <Route index element={<OrdersList />} />
            <Route path="/dashboard/profile" element={<Profile/>}/>
            <Route path="/dashboard/forms/form-elements" element={<FormElements/>}/>
            <Route path="/dashboard/forms/form-layout" element={<FormLayout />} />
            <Route path="/dashboard/ui/alerts" element={<Alerts />} />
            <Route path="/dashboard/user" element={<User/>}/>
            <Route path="/dashboard/tables" element={<Tables />} />
            <Route path="/dashboard/ui/buttons" element={<Buttons />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/ecommerce" element={<ECommerce/>}/>
            <Route path="/dashboard/chart" element={<Chart/>}/>
            <Route path="/dashboard/inventory/products" element={<Products/>}/>
            <Route path="/dashboard/inventory/category" element={<Categories/>}/>
            <Route path="/dashboard/inventory/suppliers" element={<Suppliers/>}/>
            <Route path="/dashboard/inventory/purchases" element={<Purschase/>}/>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
