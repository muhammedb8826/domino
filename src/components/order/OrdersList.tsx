import { SiVirustotal } from "react-icons/si";
import { MdDelete, MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { IoBagAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  deleteOrder,
  deleteOrderStatus,
  getOrders,
} from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { FaFirstOrderAlt, FaRegEdit } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import Swal from "sweetalert2";
import CardOne from "../CardOne";
import CardTwo from "../CardTwo";
import CardThree from "../CardThree";
import CardFour from "../CardFour";
import Loader from "@/common/Loader";
import Breadcrumb from "../Breadcrumb";
// import { getCommissions, updateCommission } from "@/redux/features/commission/commissionSlice";

interface User {
  email: string;
  roles: string;
}

// const getCurrentDateFormatted = () => {
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const currentDate = new Date();
//   const monthIndex = currentDate.getMonth();
//   const day = currentDate.getDate();
//   const year = currentDate.getFullYear();

//   const formattedDate = `${months[monthIndex]} ${day}, ${year}`;
//   return formattedDate;
// };

// const date = new Date();
// const options = { month: "short", day: "numeric", year: "numeric" };
// const formattedDate = date.toLocaleDateString("en-US", options);

const OrdersList = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, orderStatus, isLoading, error } = useSelector(
    (state: RootState) => state.order
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const [selectedOption, setSelectedOption] = useState("all");
  const [search, setSearch] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleDateSearch = (e) => {
    if (e.target.name === "start") {
      setStart(e.target.value);
    } else {
      setEnd(e.target.value);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const filteredOrders = () => {
    switch (selectedOption) {
      case "paid":
        return orders.filter(
          (order) => order.paymentInfo.paymentStatus === "paid"
        );
      case "partial":
        return orders.filter(
          (order) => order.paymentInfo.paymentStatus === "partial"
        );
      case "not-paid":
        return orders.filter(
          (order) => order.paymentInfo.paymentStatus === "not paid"
        );
      case "date":
        return orders
          .slice()
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      case "delivery-date":
        return orders
          .slice()
          .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
      default:
        return orders;
    }
  };

  const displayedOrders = filteredOrders();

  const filteredOrder = displayedOrders.filter(
    (order) =>
      order.customerFirstName?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerLastName?.toLowerCase().includes(search.toLowerCase()) ||
      order.series?.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone?.toLowerCase().includes(search.toLowerCase()) ||
      order.grandTotal?.toString().includes(search) ||
      order.deliveryDate?.toLowerCase().includes(search.toLowerCase()) ||
      order.paymentInfo.paymentStatus
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      order.orderItems.some((item) =>
        item.material.toLowerCase().includes(search.toLowerCase())
      ) ||
      order.orderItems.some((item) =>
        item.status.toLowerCase().includes(search.toLowerCase())
      )
  );

  const filterDate = filteredOrder.filter((order) => {
    if (start === "" || end === "") {
      return order;
    } else {
      return (
        new Date(order.date) >= new Date(start) &&
        new Date(order.date) <= new Date(end)
      );
    }
  });

  // const {commissions} = useSelector((state: RootState) => state.commission);

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
          const orderStatusId = orderStatus.find(
            (order) => order.orderId === id
          );
          dispatch(deleteOrderStatus(orderStatusId?.id));
        });
      }
      setShowPopover(null);
    });
  };

  if (error) {
    return <ErroPage error={error} />;
  }

  const orderListContent =
    filterDate.length > 0
      ? filterDate.map((order, index: number) => (
          <tr key={order.id}>
            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
              <h5 className="font-medium text-black dark:text-white">
                <NavLink
                  to={`/order/${order.id}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  {order.series}
                </NavLink>{" "}
              </h5>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {/* <FaFirstOrderAlt className="w-8 h-8 rounded-full" /> */}
              <div className="ps-3">
                <div className="text-base font-semibold">
                  {order.customerFirstName}
                  {order.customerLastName}
                </div>
                <div className="font-normal text-gray-500">
                  {order.customerPhone}
                </div>
              </div>
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {order.grandTotal?.toLocaleString()}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {order.paymentInfo?.paymentStatus === "not paid" && (
                <span className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                  {order.paymentInfo?.paymentStatus}
                </span>
              )}
              {order.paymentInfo?.paymentStatus === "partial" && (
                <span className="inline-flex rounded-full bg-warning bg-opacity-10 py-1 px-3 text-sm font-medium text-warning">
                  {order.paymentInfo?.paymentStatus}
                </span>
              )}
              {order.paymentInfo?.paymentStatus === "paid" && (
                <span className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                  {order.paymentInfo?.paymentStatus}
                </span>
              )}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {order.date}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {order.deliveryDate}
            </td>
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

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {/* <Breadcrumb pageName="Order List" /> */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne />
        <CardTwo />
        <CardThree />
        <CardFour />
      </div>

      <div
        className={`flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 py-4`}
      >
        <div
          className={`${
            user?.email !== "admin@domino.com" && user?.roles !== "reception"
              ? "hidden"
              : ""
          }`}
        >
          <NavLink
            to="/add-order"
            className="inline-flex items-center justify-center rounded bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            <IoBagAdd />
            <span className="ml-2">Add New Order</span>
          </NavLink>
        </div>

        <div className="mb-4.5">
          <label className="sr-only mb-2.5 block text-black dark:text-white">
            Subject
          </label>
          <div className="relative z-20 bg-transparent dark:bg-form-input">
            <select
              id="filter-order"
              title="filter-order"
              defaultValue="all"
              value={selectedOption}
              onChange={(e) => handleSelectChange(e)}
              className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="not-paid">Not Paid</option>
              <option value="date">Date</option>
              <option value="delivery-date">Delivery date</option>
            </select>
            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill=""
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </div>

        <div date-rangepicker className="flex items-center">
          <div className="relative">
            <input
              name="start"
              type="date"
              onChange={(e) => handleDateSearch(e)}
              value={start}
              className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Select date start"
            />
          </div>
          <span className="mx-4 text-gray-500">to</span>

          <div className="relative">
            <input
              name="end"
              onChange={(e) => handleDateSearch(e)}
              value={end}
              type="date"
              className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Select date end"
            />
          </div>
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
            onChange={(e) => handleSearch(e)}
            value={search}
            type="text"
            id="table-search-users"
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 ps-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Search for orders"
          />
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          {orders && (
            <>
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                      id
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Customer
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Price
                    </th>
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Date
                    </th>
                    <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                      Delivery Date
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
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
      </div>
    </>
  );
};

export default OrdersList;
