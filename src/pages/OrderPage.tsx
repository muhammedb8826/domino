import OrderDetails from "../components/order/OrderDetails"
import { SideBar } from "../components/order/SideBar"
import TopBar from "../components/order/TopBar"

const OrderPage = () => {
  return (
    <section>
      <SideBar />
      <TopBar />
      <OrderDetails />
      </section>
  )
}

export default OrderPage
