import { SiVirustotal } from "react-icons/si";
import { MdDelete, MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { IoBagAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { deleteOrder, deleteOrderStatus, getOrders } from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { FaFirstOrderAlt, FaRegEdit } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import Swal from "sweetalert2";
// import { getCommissions, updateCommission } from "@/redux/features/commission/commissionSlice";

interface User {
  email: string;
  roles: string;
}


const OrdersList = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, orderStatus, isLoading, error } = useSelector(
    (state: RootState) => state.order
  );
  // const {commissions} = useSelector((state: RootState) => state.commission);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
    // dispatch(getCommissions());
  }, [dispatch]);
  
  const [showPopover, setShowPopover] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(null);
      }
    };

    if (showPopover !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  const handleAction = (index: number) => {
    setShowPopover((prevIndex) => (prevIndex === index ? null : index));
  };

  const receivedStatus =
    orders &&
    orders.map((item, index) => {
      return item.orderItems.filter((order) => order.status === "received");
    });

  const handleDeleteOrder = (id) => {
    orderStatus.map((order) => {
      if (order.id === id) {
        if (order.status === "approved") {
          return Swal.fire({
            title: "Error!",
            text: "You can't delete a received order",
            icon: "error",
          });
        }
      }
    });

    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this order!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteOrder(id));
          const orderStatusId = orderStatus.find((order) => order.orderId === id);
          dispatch(deleteOrderStatus(orderStatusId?.id));
        });
      }
      setShowPopover(null);
    });
  };


  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErroPage error={error} />;
  }

  const orderListContent = orders
    ? orders.map((order, index: number) => (
        <tr
          key={order.id}
          className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <td className="px-6 py-4">
            <NavLink
              to={`/order/${order.id}`}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              {order.series}
            </NavLink>{" "}
          </td>
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center"
          >
            <FaFirstOrderAlt className="w-8 h-8 rounded-full" />
            <div className="ps-3">
              <div className="text-base font-semibold">
                {order.customerFirstName}{order.customerLastName}
              </div>
              <div className="font-normal text-gray-500">
                {order.customerPhone}
              </div>
            </div>
          </th>
          <td className="px-6 py-4">
            {order.orderItems.map((item, index) => (
              <span key={index}>
                {item.material}
                {","}
              </span>
            ))}
          </td>
          <td className="px-6 py-4">{order.grandTotal?.toLocaleString()}</td>
          <td className="px-6 py-4">
          {order.paymentInfo?.paymentStatus === "not paid" && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-0.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
              {order.paymentInfo?.paymentStatus}
            </span>
          )}
          {order.paymentInfo?.paymentStatus === "partial" && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-0.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              {order.paymentInfo?.paymentStatus}
            </span>
          )}
          {order.paymentInfo?.paymentStatus === "paid" && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-0.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              {order.paymentInfo?.paymentStatus}
            </span>
          )}
          </td>
          <td className="px-6 py-4">{order.deliveryDate}</td>
          <td className="px-6 py-4 relative">
            <button
              onClick={() => handleAction(index)}
              title="action"
              type="button"
              className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <CiMenuKebab />
            </button>
            {showPopover === index && (
              <div
                ref={popoverRef}
                className="absolute z-40 right-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
              >
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <NavLink
                      to={`/order/${order.id}`}
                      className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                    >
                      <FaRegEdit />
                      Edit
                    </NavLink>{" "}
                  </li>
                  {user?.email === "admin@domino.com" && (
                  <li>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      type="button"
                      className="text-left text-red-500 flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                    >
                      <MdDelete /> Delete
                    </button>
                  </li>
                   )}
                </ul>
              </div>
            )}
          </td>
        </tr>
      ))
    : null;

  return (
    <div className="p-4 overflow-y-scroll h-screen">
      <h1 className="flex items-center gap-4">
        <span className="text-2xl font-bold">Orders List</span>
      </h1>

      <div className="cards flex items-center justify-between py-4">
        <div className="total-order flex items-center gap-4 shadow-sm bg-white rounded-md p-4 w-[30%]">
          <p className="text-xl">
            <SiVirustotal />
          </p>
          <div className="">
            <p className="font-bold text-2xl">{orders.length}</p>
            <p className="text-gray-400">Total Order</p>
          </div>
        </div>

        <div className="total-order flex items-center gap-4 shadow-sm bg-white rounded-md p-4 w-[30%]">
          <p className="text-xl">
            <MdOutlinePendingActions />
          </p>
          <div className="">
            <p className="font-bold text-2xl">{receivedStatus.length}</p>
            <p className="text-gray-400">Total received orders</p>
          </div>
          <div className="progress ml-auto">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* <!-- Background circle --> */}
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                {/* <!-- Progress circle --> */}
                <circle
                  className="text-blue-500  progress-ring__circle stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDashoffset="calc(400 - (400 * 45) / 100)"
                ></circle>

                {/* <!-- Center text --> */}
                <text
                  x="50"
                  y="50"
                  fontFamily="Verdana"
                  fontSize="20"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  70%
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="total-order flex items-center gap-4 shadow-sm bg-white rounded-md p-4 w-[30%]">
          <p className="text-xl">
            <MdApproval />
          </p>
          <div className="">
            <p className="font-bold text-2xl">34</p>
            <p className="text-gray-400">Total Order Approved</p>
          </div>
          <div className="progress ml-auto">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* <!-- Background circle --> */}
                <circle
                  className="text-gray-200 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                {/* <!-- Progress circle --> */}
                <circle
                  className="text-blue-500  progress-ring__circle stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDashoffset="calc(400 - (400 * 45) / 100)"
                ></circle>

                {/* <!-- Center text --> */}
                <text
                  x="50"
                  y="50"
                  fontFamily="Verdana"
                  fontSize="20"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  70%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className={`${user?.email !== 'admin@domino.com' && user?.roles !== 'reception' ? 'hidden' : ''} flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4`}>
        <div>
          <NavLink
            to="/add-order"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <IoBagAdd />
            <span className="ml-2">Add New Order</span>
          </NavLink>
        </div>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for users"
          />
        </div>
      </div>
      {orders && (
        <>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  id
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Orders
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  payment
                </th>
                <th scope="col" className="px-6 py-3">
                  Delivery Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{orderListContent}</tbody>
          </table>
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                1-10
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                1000
              </span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  4
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  5
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </>
      )}
      {orders.length === 0 && (
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              stroke="currentColor"
              viewBox="0 0 52 52"
            >
              <circle
                className="fill-transparent stroke-current stroke-2"
                cx="26"
                cy="26"
                r="25"
              ></circle>
              <path
                className="stroke-current stroke-2"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 16l20 20m0 0l-20-20"
              ></path>
            </svg>
            <p className="text-gray-600">No orders found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
