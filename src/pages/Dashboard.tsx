import { useState } from "react";
import OrderDetails from "../components/order/OrderDetails";
import { SideBar } from "../components/order/SideBar";
import TopBar from "../components/order/TopBar";
import UserRegistration from "../components/user/UserRegistration";
import UserList from "../components/user/UserList";
// import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

const Dashboard = () => {
  // const { isAuthenticated } = useSelector((state) => state.auth);
  

  const [active, setActive] = useState("order");

  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };


  // {!isAuthenticated && <Navigate to="/sign-in" />}
return (
    <section className="w-screen h-screen flex justify-between bg-[#EBE9EA] overflow-hidden">
      <div className="w-[15%] static">
        <SideBar handleButtonClick={handleButtonClick} active={active} />
      </div>

      <div className="flex flex-col w-full">
        {active === "order" && (
          <>
            <TopBar />
            <OrderDetails />
          </>
        )}

        {active === "userRegistration" && <UserRegistration />}

        {active === "userList" && 
        <>
        <TopBar />
        <UserList />
        </>
        }

        {active === "customer" && (
          <>
            <TopBar />
            <div>customer</div>
          </>
        )}

        {active === "setting" && <div>setting</div>}
      </div>
    </section>
  );
};

export default Dashboard;
