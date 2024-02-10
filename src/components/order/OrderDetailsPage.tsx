import { GoBack } from "../common/GoBack";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { getOrdersById} from "../../redux/features/order/orderSlice";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);

const OrderDetailsPage = () => {
  const {id} = useParams();
const {singleOrder, isLoading, error} = useSelector((state) => state.order);

console.log(singleOrder);

const dispatch = useDispatch();
useEffect(() => {
  dispatch(getOrdersById(id));
}
, [dispatch, id]);

if (isLoading) {
  return <Loading />;
}
if (error) {
  return <ErroPage error={error} />;
}

return (
  <div className="wrapper">
    <GoBack goback="/dashboard" />
    <h1>Order Details</h1>
    <div>
      <p>Order ID: {singleOrder.id}</p>
      <p>Customer Name: {singleOrder.customerFirstName}</p>
      <p>Order Date: {formattedDate}</p>
      <p>Order Status: {singleOrder.status}</p>
    </div>
  </div>
);

}
export default OrderDetailsPage