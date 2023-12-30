import OrderDetails from "../components/order/OrderDetails"
import { SideBar } from "../components/order/SideBar"
import TopBar from "../components/order/TopBar"

const OrderPage = () => {
  return (
    <section className="w-screen h-screen flex justify-between bg-[#EBE9EA] overflow-hidden">
      <div className="w-[20%]">
      <SideBar />
      </div>
      
      <div className="flex flex-col w-[80%]">
      <TopBar />
      <OrderDetails />
      </div>
      </section>
  )
}

export default OrderPage
