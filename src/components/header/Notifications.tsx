import {
  getOrderStatus,
  getOrders,
  updateOrderStatus,
} from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { GoBack } from "../common/GoBack";
import { toast } from "react-toastify";
import { getSales, updateSale } from "@/redux/features/saleSlice";
import Loader from "@/common/Loader";
import { MdDelete } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { BsTicketDetailed } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";

export const Notifications = () => {
  const { sales, isLoading } = useSelector((state: RootState) => state.sale);
  const { user, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { orders, orderStatus } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSales());
    dispatch(getOrderStatus());
    dispatch(getOrders());
  }, [dispatch]);

  const [showPopover, setShowPopover] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !dropdownOpen ||
        dropdownRef.current.contains(target) ||
        triggerRef.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleAction = (index) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover(index);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [data, setData] = useState({});

  const handleApproveSale = (id: string) => {
    const findSale = sales.find((sale) => sale.id === id);
    const updatedFindSale = { ...findSale, status: "approved" };
    dispatch(updateSale(updatedFindSale)).then(() => {
      const message = "Sale approved successfully";
      toast.success(message);
    });
  };

  const handleRejectSale = (id: string) => {
    const findSale = sales.find((sale) => sale.id === id);
    const updatedFindSale = { ...findSale, status: "rejected" };
    dispatch(updateSale(updatedFindSale)).then(() => {
      const message = "Sale rejected successfully";
      toast.success(message);
    });
  };

  const filteredSalesStatus = sales?.filter(
    (sale) => sale.status === "requested"
  );

  const [adminNotification, setAdminNotification] = useState(0);

  useEffect(() => {
    const editedOrder = orderStatus.filter(
      (order) => order.status === "received"
    );
    const notification = editedOrder.map((item) =>
      item.orderItems.filter(
        (item) => item.status === "edited" || item.status === "rejected"
      )
    );
    const filteredSalesStatus = sales?.filter(
      (sale) => sale.status === "requested"
    );
    setAdminNotification(notification.reduce((a, b) => a + b.length, 0));
    setAdminNotification((prev) => prev + filteredSalesStatus.length);
  }, [orderStatus, sales]);

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

  const productListContent = filteredSalesStatus.length > 0 && filteredSalesStatus?.map((sale, index) => (
    <tr key={sale.id}>
      <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
        {sale.id}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {sale.orderDate}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {sale.operatorFirstName}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {sale.products.map((product) => product.quantity).reduce((a, b) => a + Number(b), 0)}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {sale.status}
      </td>
      <td className="px-4 py-5 flex">
        <button
          className="bg-success text-white active:bg-success font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none me-5 mb-1 ease-linear transition-all duration-150"
          onClick={() => handleApproveSale(sale.id)}
          type="button"
        >
          approve
        </button>
        <button
          className="bg-danger text-white active:bg-danger font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          onClick={() => handleRejectSale(sale.id)}
          type="button"
        >
          reject
        </button>
        {/* <Link
          to="#"
          onClick={(event) => {
            handleAction(index);
            event.stopPropagation();
          }}
          ref={triggerRef}
          className="flex items-center gap-4"
        >
          <CiMenuKebab />
        </Link> */}

        {/* <!-- Dropdown Start --> */}
        {/* {showPopover === index && (
          <div
            ref={dropdownRef}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
            className={`absolute right-14 mt-0 flex w-47.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
              dropdownOpen ? "block" : "hidden"
            }`}
          >
            <ul className="flex flex-col gap-2 border-b border-stroke p-3 dark:border-strokedark">
              <li>
                <button
                  onClick={() => handleApproveSale(sale.id)}
                  type="button"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <BsTicketDetailed />
                  Approve
                </button>
              </li>
              <li>
                <NavLink
                  onClick={() => handleRejectSale(sale.id)}
                  to="#"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <MdDelete />
                  Reject
                </NavLink>
              </li>
            </ul>
          </div>
        )} */}
        {/* <!-- Dropdown End --> */}
      </td>
    </tr>
  ));

  if (error) {
    return <ErroPage error={error} />;
  }
  return isLoading ? (
    <Loader />
  ) : (
    <section className="bg-white dark:bg-gray-900 wrapper py-4  p-0 min-h-screen">
      {/* <GoBack goback="/dashboard" /> */}
      <h2 className="m-4 relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Notifications
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-danger border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
          {adminNotification}
        </div>
      </h2>
      <hr />
      {adminNotification === 0 && (
        <p className="text-center text-2xl font-bold text-black dark:text-white">
          No notifications
        </p>
      )}
      <p className="text-black dark:text-white font-medium p-4">
        {" "}
        Sales notifications
      </p>
      {user?.email === "admin@domino.com" && (
        <>
          <div className="max-w-full overflow-x-auto mb-10">
            {filteredSalesStatus.length === 0 ? (
              <p className="text-center text-2xl font-bold text-black dark:text-white">
                No sales notifications
              </p>
            ) : (
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Reference
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Order Date
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Operator
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Quantity
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{productListContent}</tbody>
              </table>
            )}
          </div>
        </>
      )}

      <p className="text-black dark:text-white font-medium p-4 border-t">
        {" "}
        Orders notifications
      </p>

      {user?.email === "admin@domino.com" && (
        <>

          <div className="grid grid-cols-1 p-4">
            <table
              className="
               col-span-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4 w-4 border border-gray-300">
                    No
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border border-gray-300"
                  >
                    Order
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border border-gray-300"
                  >
                    Customer Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border border-gray-300"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border border-gray-300"
                  >
                    Delivery date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border border-gray-300"
                  >
                    payment status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border border-gray-300"
                  >
                    Order status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 border border-gray-300"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              {orderStatus.map((status, index) => (
                <tbody key={status.id}>
                  {status.orderItems.map((item, itemIndex) => {
                    const filteredOrder = orders.find(
                      (order) =>
                        (order.id === status.orderId &&
                          item.status === "edited") ||
                        item.status === "rejected"
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
                            {filteredOrder && filteredOrder.customerFirstName}
                          </td>
                          <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                            {filteredOrder && filteredOrder.date}
                          </td>
                          <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                            {filteredOrder && filteredOrder.deliveryDate}
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
                              className="bg-success text-white active:bg-success font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none me-5 mb-1 ease-linear transition-all duration-150"
                              onClick={() => handleClick(status.id, itemIndex)}
                              type="button"
                            >
                              approve
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
              ))}
            </table>
          </div>
        </>
      )}
    </section>
  );
};
