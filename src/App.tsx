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
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import OrderDetailsPage from "./components/order/OrderDetailsPage";
import { OrderRegistration } from "./components/order/OrderRegistration";
import CommissionDetailsPage from "./components/commission/CommissionDetailsPage";
import { Notifications } from "./components/header/Notifications";
import { OperatorNotification } from "./components/header/OperatorNotification";
import { ReceptionistNotification } from "./components/header/ReceptionistNotification";
import { FinanceNotification } from "./components/header/FinanceNotification";
import { Suppliers } from "./components/inventory/Suppliers";
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Loader from "./common/Loader";
import DefaultLayout from "./layout/DefaultLayout";
import ECommerce from "./pages/Dashboard/ECommerce";
import routes from "./routes";
import SignIn from "./pages/Authentication/SignIn";
import Profile from "./pages/Profile";
import FormElements from "./pages/Form/FormElements";

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
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DefaultLayout />}>
            <Route index element={<ECommerce />} />
            <Route path="/dashboard/profile" element={<Profile/>}/>
            <Route path="/dashboard/forms/form-elements" element={<FormElements/>}/>
            {/* {routes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })} */}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
