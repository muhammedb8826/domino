import { toast } from "react-toastify";
import ErroPage from "../common/ErroPage";
import { GoBack } from "../common/GoBack";
import Loading from "../common/Loading";
import { getOrderStatus, getOrders, updateOrderStatus } from "@/redux/features/order/orderSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createPrintedTransaction } from "@/redux/features/printedTransactionsSlice";

export const OperatorNotification = () => {

    const { user, isLoading, error } = useSelector(
        (state: RootState) => state.auth
      );
      const { orders, orderStatus } = useSelector(
        (state: RootState) => state.order
      );
      const dispatch = useDispatch();
      useEffect(() => {
        dispatch(getOrderStatus());
        dispatch(getOrders());
      }, [dispatch]);

      const [operatorNotification, setOperatorNotification] = useState(0);

      useEffect(() => {
        const editedOrder = orderStatus.filter(
          (order) => order.status === "received"
        );
        const operatorNotification = editedOrder.map((item) =>
        item.orderItems.filter((item) => item.status === "approved")
      );
      setOperatorNotification(
        operatorNotification.reduce((a, b) => a + b.length, 0)
      );
      }, [orderStatus]);
    
      const handleClick = (id, index) => {
        const findOrderStatusId = orderStatus.find((item) => item.id === id);
        const updatedStatus = findOrderStatusId.orderItems.map((item, i) => {
          if (index === i) {
            return {
              ...item,
              status: "printed",
              adminApproval: true,
            };
          }
          return item;
        });

        const data = {
          ...findOrderStatusId,
          orderItems: updatedStatus,
        };
        const orderId = data.orderId;  
        const findItem = orders.find((item) => item.id === orderId);
        const filteredOrder = findItem.orderItems.find(
          (_, i) => i === index
        ); 

        const printedData = {
          ...filteredOrder,
          width: findItem?.orderMeasures[index].width,
          height: findItem?.orderMeasures[index].height,
          quantity: findItem?.orderMeasures[index].quantity,
          orderId: findItem?.id,
        };

        dispatch(createPrintedTransaction(printedData));
        dispatch(updateOrderStatus(data));
        // console.log(data);
        
        const message = "Order status updated successfully";
        toast.success(message);
      };    
    
      const handleReject = (id, index) => {
        const findOrderStatusId = orderStatus.find((item) => item.id === id);
        const updatedStatus = findOrderStatusId.orderItems.map((item, i) => {
          if (index === i) {
            return {
              ...item,
              status: "rejected",
              adminApproval: false,
            };
          }
          return item;
        });
    
        const data = {
          ...findOrderStatusId,
          orderItems: updatedStatus,
        };
        dispatch(updateOrderStatus(data));
        const message = "Order status updated successfully";
        toast.success(message);
      };
    
      if (isLoading) {
        return <Loading />;
      }
      if (error) {
        return <ErroPage error={error} />;
      }

  return (
    <section className="bg-white dark:bg-gray-900 wrapper py-4 border p-0 min-h-screen">
    <GoBack goback="/dashboard" />
    <h2 className="m-4 relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Notifications
      <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-danger border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">{operatorNotification}</div>
    </h2>
    <hr />
    {operatorNotification === 0 && (
      <p className="text-center text-2xl font-bold text-black dark:text-white">
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
                  (order) => order.id === status.orderId && item.status === "approved"
                             
                );
                return (
                  filteredOrder && (
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
                        className="text-white bg-gradient-to-br from-success to-primary hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded text-sm px-6 py-1 text-center me-5 mb-1 ease-linear transition-all duration-150"
                        onClick={() => handleClick(status.id, itemIndex)}
                        type="button"
                      >
                        Print
                      </button>
                      <button
                        className="bg-danger text-white active:bg-danger font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        onClick={() => handleReject(status.id, itemIndex)}
                        type="button"
                      >
                        reject
                      </button>
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
