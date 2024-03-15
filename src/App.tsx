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

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/latest-work" element={<LatestWork />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/sign-in" element={<Login />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-order" element={<OrderRegistration/>} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/commission/:id" element={<CommissionDetailsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
};

export default App;
