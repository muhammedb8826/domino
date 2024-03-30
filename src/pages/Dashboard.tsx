import { useState } from "react";
import { SideBar } from "../components/dashboard/SideBar";
import TopBar from "../components/dashboard/TopBar";
import OrderDetails from "../components/order/OrdersList";
import User from "../components/user/User";
import Product from "../components/product/Product";
import Pricing from "../components/pricing/Pricing";
import Setting from "../components/setting/Setting";
import { CustomerList } from "../components/customer/CustomerList";
import { CommissionList } from "@/components/commission/CommissionList";
import { Products } from "@/components/inventory/Products";
import { Purschase } from "@/components/inventory/Purschase";
import Sale from "@/components/inventory/Sale";
import { Reports } from "@/components/inventory/Reports";
import { Categories } from "@/components/inventory/Categories";
import { People, Suppliers } from "@/components/inventory/Suppliers";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DynamicComponent from "./DynamicComponent";

const Dashboard = () => {
  // const [active, setActive] = useState("order");
  // const handleButtonClick = (newActiveState: string) => {
  //   setActive(newActiveState);
  // };
   // <section className="w-screen h-screen flex justify-between bg-[#EBE9EA] overflow-hidden box-border relative">
    //   <div className="w-[15%] static">
    //     <SideBar handleButtonClick={handleButtonClick} active={active} />
    //   </div>

    //   <div className="flex flex-col w-full h-full">
    //     {active === "order" && (
    //       <>
    //         <TopBar />
    //         <OrderDetails />
    //       </>
    //     )}

    //     {active === "user" && (
    //       <>
    //         <TopBar />
    //         <User />
    //       </>
    //     )}
    //     {active === "products" && (
    //       <>
    //         <TopBar />
    //         <Products />
    //       </>
    //     )}

    //     {active === "purchase" && (
    //       <>
    //         <TopBar />
    //         <Purschase />
    //       </>
    //     )}

    //     {active === "sale" && (
    //       <>
    //         <TopBar />
    //         <Sale />
    //       </>
    //     )}

    //     {active === "reports" && (
    //       <>
    //         <TopBar />
    //         <Reports />
    //       </>
    //     )}
         
    //      {active === "suppliers" && (
    //       <>
    //         <TopBar />
    //         <Suppliers />
    //       </>
    //     )}

    //     {active === "categories" && (
    //       <>
    //         <TopBar />
    //         <Categories />
    //       </>
    //     )}

    //     {active === "customer" && (
    //       <>
    //         <TopBar />
    //         <CustomerList />
    //       </>
    //     )}

    //     {active === "commission" && (
    //       <>
    //         <TopBar />
    //         <CommissionList />
    //       </>
    //     )}

    //     {active === "product" && (
    //       <>
    //         <TopBar />
    //         <Product />
    //       </>
    //     )}

    //     {active === "pricing" && (
    //       <>
    //         <TopBar />
    //         <Pricing />
    //       </>
    //     )}

    //     {active === "setting" && (
    //       <>
    //         <TopBar />
    //         <Setting />
    //       </>
    //     )}
    //   </div>
    // </section>
  return (
    <section className="w-screen h-screen flex justify-between bg-[#EBE9EA] overflow-hidden box-border relative">
      <div className="w-[15%] static">
        <SideBar />
      </div>

      <div className="flex flex-col w-full h-full">
        <Routes>
          <Route path="/dashboard/:activeComponent/*" element={<DynamicComponent />} />
        </Routes>
      </div>
    </section>
  );
};

export default Dashboard;
