import { useState } from "react";
import { useSelector } from "react-redux";
import { SideBar } from "../components/order/SideBar";
import TopBar from "../components/order/TopBar";
import OrderDetails from "../components/order/OrderDetails";
import { NavLink } from "react-router-dom";
import User from "../components/user/User";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const [active, setActive] = useState("order");
  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
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
            <div>customer</div>
          </>
        )}

        {active === "setting" && <div>setting</div>}
      </div>
    </section>
  ) : (
    <div>Not authenticated user <NavLink to="/sign-in" className="text-sky-400 decoration-black">Please contact your admin</NavLink></div>
    );
};

export default Dashboard;
