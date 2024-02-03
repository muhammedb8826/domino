import { SiVirustotal } from "react-icons/si";
import { MdDelete, MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { IoBagAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOrders } from "../../redux/features/order/orderSlice";
import { RootState } from "../../redux/store";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { FaFirstOrderAlt, FaRegEdit } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import ModalPage from "../common/ModalPage";

const OrdersList = () => {
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch();
  const [showPopover, setShowPopover] = useState(null);
  const handleAction = (index: number) => {
    setShowPopover((prevIndex) => (prevIndex === index ? null : index));
  };

  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const handleModalOpen = (id) => {
    setShowModal(!showModal);
    setId(id);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErroPage error={error} />;
  }

  const orderListContent = orders
    ? orders.map((order, index: number) => (
        <tbody key={index}>
          <tr className="bg-white border-b hover:bg-gray-50">
            <td className="w-4 p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-1"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="checkbox-table-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
            >
              <FaFirstOrderAlt className="w-10 h-10 rounded-full" />
              {/* <img
                className="w-10 h-10 rounded-full"
                src="hhh"
                alt="Jese image"
              /> */}
              <div className="ps-3">
                <div className="text-base font-semibold">
                  <NavLink to={`/order/${order.orderId}`} className="text-blue-500">
                    {order.order.map((o) => o.media)}
                  </NavLink>{" "}
                  by {order.firstName} {order.lastName}
                </div>
                <div className="font-normal text-gray-500">{order.email}</div>
              </div>
            </th>
            <td className="px-6 py-4">{order.order.map((o) => o.status)}</td>
            <td className="px-6 py-4">
              {order.orderId}-{order.phoneNumber}
            </td>
            <td className="px-6 py-4">{order.order.map((o) => o.dueDate)}</td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleAction(index)}
                title="action"
                data-popover-target={`popover-bottom-${index}`}
                data-popover-trigger="click"
                id={`dropdownAvatarNameButton-${order.orderId}-${index}`}
                type="button"
                className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <CiMenuKebab />
              </button>
              {showPopover === index && (
                <div className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                  {/* Dropdown content */}
                  <div className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">Pro User</div>
                    <div className="truncate">{order.email}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        type="button"
                        className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                      >
                        <FaRegEdit />
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="text-left text-red-500 flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                      >
                        <MdDelete /> Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      ))
    : null;

  return (
    <div className="p-4 overflow-y-scroll">
      <h1 className="flex items-center gap-4">
        <span className="text-2xl font-bold">Order Details</span>
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
          You have 3 pending notification
        </span>
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
            <p className="font-bold text-2xl">34</p>
            <p className="text-gray-400">Total Order Pending</p>
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

      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
                d="M16 16l20 20m0-20L16 36"
              ></path>
            </svg>
            <p className="text-gray-600">No orders found</p>
          </div>
        </div>
      )}
      {orders.length > 0 && (
        <>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  "
                    />
                    <label htmlFor="checkbox-all" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Order name
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Order Id
                </th>
                <th scope="col" className="px-6 py-3">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            {orderListContent}
          </table>

          {showModal && (
            <div
              className="fixed z-10 inset-0 overflow-y-auto"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                  aria-hidden="true"
                ></div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <ModalPage
                  handleModalOpen={handleModalOpen}
                  id={id}
                  orders={orders}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <button
              disabled
              className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                ></path>
              </svg>
              Previous
            </button>
            <div className="flex items-center gap-2">
              <button
                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  1
                </span>
              </button>
              <button
                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  2
                </span>
              </button>
              <button
                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  3
                </span>
              </button>
              <button
                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  4
                </span>
              </button>
              <button
                className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  5
                </span>
              </button>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                ></path>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersList;
