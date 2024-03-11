import { useState } from "react";
import { SideBar } from "../components/dashboard/SideBar";
import TopBar from "../components/dashboard/TopBar";
import OrderDetails from "../components/order/OrdersList";
import User from "../components/user/User";
import Product from "../components/product/Product";
import Pricing from "../components/pricing/Pricing";
import Setting from "../components/setting/Setting";
import  {CustomerList} from "../components/customer/CustomerList";
import { CommissionList } from "@/components/commission/CommissionList";

const Dashboard = () => {

  const [active, setActive] = useState("order");
  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };
  return (
    <section className="w-screen h-screen flex justify-between bg-[#EBE9EA] overflow-hidden box-border relative">
      <div className="w-[15%] static">
        <SideBar handleButtonClick={handleButtonClick} active={active} />
      </div>

      <div className="flex flex-col w-full h-full">
        {active === "order" && (
          <>
            <TopBar />
            <OrderDetails />
          </>
        )}

        {active === "user" && (
          <>
            <TopBar />
            <User />
          </>
        )}

        {active === "customer" && (
          <>
            <TopBar />
            <CustomerList/>
          </>
        )}

{active === "commission" && (
          <>
            <TopBar />
            <CommissionList/>
          </>
        )}

        {active === "product" && (
          <>
            <TopBar />
            <Product/>
          </>
        )}

        {active === "pricing" && (
          <>
            <TopBar />
            <Pricing/>
          </>
        )}

        {active === "setting" &&(
        <>
        <TopBar/>
        <Setting/>
        </>
        )}
      </div>
    </section>
  );
  // ) : (
  //   <div>Not authenticated user <NavLink to="/sign-in" className="text-sky-400 decoration-black">Please contact your admin</NavLink></div>
  //   );
};

export default Dashboard;
