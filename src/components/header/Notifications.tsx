import {
  getOrderStatus,
  getOrders,
  updateOrderStatus,
} from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { GoBack } from "../common/GoBack";
import { toast } from "react-toastify";

export const Notifications = () => {
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

  const handleClick = (id, index) => {
    const findOrderStatusId = orderStatus.find((item) => item.id === id);
    const updatedStatus = findOrderStatusId.orderItems.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          status: "approved",
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
      <h2 className="ps-4 my-4 text-2xl font-bold text-gray-900 dark:text-white">
        Notifications
      </h2>
      <hr />
      {orders.length === 0 && (
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
                  (order) => order.id === status.orderId
                );
                return (
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
                        filteredOrder.paymentInfo?.paymentStatus}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {item.status}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      <button
                        className="bg-green-500 text-white active:green-blue-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        onClick={() => handleClick(status.id, itemIndex)}
                        type="button"
                      >
                        approve
                      </button>
                      <button
                        className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        onClick={() => handleReject(status.id, itemIndex)}
                        type="button"
                      >
                        reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
};
