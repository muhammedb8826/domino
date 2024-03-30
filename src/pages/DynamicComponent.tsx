import TopBar from "@/components/dashboard/TopBar";
import OrderDetailsPage from "@/components/order/OrderDetailsPage";
import { Outlet, useMatches, useParams } from "react-router-dom";

const DynamicComponent = () => {
    const { activeComponent } = useParams();
  const match = useMatches();

console.log(match, activeComponent);


  let componentToRender = null;
  switch (activeComponent) {
    case 'order':
      componentToRender = <OrderDetailsPage />;
      break;
    default:
      componentToRender = <div>Component Not Found</div>;
  }

  return (
    <>
    <TopBar />
    {componentToRender}
    <Outlet />
  </>
  )
}

export default DynamicComponent