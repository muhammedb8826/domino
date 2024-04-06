import { getOrderStatus, getOrders, updateOrderStatus } from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoBack } from "../common/GoBack";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { toast } from "react-toastify";

export const ReceptionistNotification = () => {
    const {orders, orderStatus} = useSelector((state: RootState) => state.order);
    const {user, isLoading, error} = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getOrderStatus());
        dispatch(getOrders());
    }, [dispatch]);

    const [receptionistNotification, setReceptionistNotification] = useState(0);

    useEffect(() => {
        const editedOrder = orderStatus.filter(
          (order) => order.status === "received"
        );
        const receptionistNotification = editedOrder.map((item) =>
        item.orderItems.filter((item) => item.status === "paid")
      );
      setReceptionistNotification(
        receptionistNotification.reduce((a, b) => a + b.length, 0)
      );
    }, [orderStatus]);

    const handleClick = (id, index) => {
        const findOrderStatusId = orderStatus.find((item) => item.id === id);
        const updatedStatus = findOrderStatusId.orderItems.map((item, i) => {
          if (index === i) {
            return {
              ...item,
              status: "delivered",
              adminApproval: true,
            };
          }
          return item;
        });
    
        const data = {
          ...findOrderStatusId,
          orderItems: updatedStatus,
        };
        dispatch(updateOrderStatus(data));
        const message = "Payment status updated successfully";
        toast.success(message);
      };    

    if (isLoading) {
        return <Loading />;
    }
    if(error) {
        <ErroPage error={error} />
    }
  return (
    <section className="bg-white dark:bg-gray-900 wrapper py-4 border p-0 min-h-screen">
    <GoBack goback="/dashboard" />
    <h2 className="m-4 relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Finance Notifications
      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{receptionistNotification}</div>
    </h2>
    <hr />
    {receptionistNotification === 0 && (
      <p className="text-center text-2xl font-bold text-gray-900 dark:text-white">
        No notifications
      </p>
    )}
          {orderStatus.map((status, index) => (
        <div key={status.id} className="grid grid-cols-1 p-4">
          <table
            className="
               col-span-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="p-4 w-4 border border-gray-300">
                  No
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-300">
                  Order
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-300">
                  Customer Name
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-300">
                  Date
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-300">
                  Delivery date
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-300">
                  payment status
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-300">
                  Order status
                </th>
                <th scope="col" className="px-4 py-2 border border-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {status.orderItems.map((item, itemIndex) => {
                const filteredOrder = orders.find(
                  (order) => order.id === status.orderId && item.status === "paid"
                             
                );
                return (
                    filteredOrder && filteredOrder.paymentInfo?.paymentStatus === "paid" && receptionistNotification > 0 && (
                  <tr
                    key={itemIndex}
                    className="bg-white border-b m-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-2 w-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {itemIndex + 1}
                    </td>
                    <td
                      scope="row"
                      className="px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300"
                    >
                      {filteredOrder && filteredOrder.id}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {filteredOrder &&
                        filteredOrder.customerFirstName}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {filteredOrder &&
                        filteredOrder.date}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {filteredOrder &&
                        filteredOrder.deliveryDate}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {filteredOrder &&
                        filteredOrder.paymentInfo?.paymentStatus}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {item.status}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      <button
                        className="bg-danger text-white active:bg-primary font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        onClick={() => handleClick(status.id, itemIndex)}
                        type="button"
                      >
                        Approve delivery
                      </button>
                      {/* <button
                        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        onClick={() => handleReject(status.id, itemIndex)}
                        type="button"
                      >
                        reject
                      </button> */}
                    </td>
                  </tr>
                )
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  )
}
