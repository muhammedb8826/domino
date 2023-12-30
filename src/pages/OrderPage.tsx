import OrderDetails from "../components/order/OrderDetails"
import { SideBar } from "../components/order/SideBar"
import TopBar from "../components/order/TopBar"

const OrderPage = () => {
  return (
    <section className="w-screen flex justify-between">
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
