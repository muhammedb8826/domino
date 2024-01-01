import { useState } from "react";
import OrderDetails from "../components/order/OrderDetails"
import { SideBar } from "../components/order/SideBar"
import TopBar from "../components/order/TopBar"

const OrderPage = () => {
  const [active, setActive] = useState("order");

  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };
  

  return (
    <section className="w-screen h-screen flex justify-between bg-[#EBE9EA] overflow-hidden">
      <div className="lg:w-[15%] lg:static absolute w-[5%]">
      <SideBar handleButtonClick={handleButtonClick} active={active}/>
      </div>
      
      <div className="flex flex-col w-full">
        {active === "order" && 
      <>
      <TopBar />
      <OrderDetails />
      </>
      }

      {active === "customer" &&
      <>
      <TopBar />
      <div>customer</div>
      </>
      }

      {active === "setting" &&
      <div>setting</div>
      }
      
      </div>
      </section>
  )
}

export default OrderPage
