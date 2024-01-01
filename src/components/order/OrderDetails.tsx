import { SiVirustotal } from "react-icons/si";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { IoBagAdd } from "react-icons/io5";
import { NavLink } from "react-router-dom";

const OrderDetails = () => {

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
            <p className="font-bold text-2xl">34</p>
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
                  stroke-width="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                {/* <!-- Progress circle --> */}
                <circle
                  className="text-blue-500  progress-ring__circle stroke-current"
                  stroke-width="10"
                  stroke-linecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke-dashoffset="calc(400 - (400 * 45) / 100)"
                ></circle>

                {/* <!-- Center text --> */}
                <text
                  x="50"
                  y="50"
                  font-family="Verdana"
                  font-size="20"
                  text-anchor="middle"
                  alignment-baseline="middle"
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
                  stroke-width="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                {/* <!-- Progress circle --> */}
                <circle
                  className="text-blue-500  progress-ring__circle stroke-current"
                  stroke-width="10"
                  stroke-linecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke-dashoffset="calc(400 - (400 * 45) / 100)"
                ></circle>

                {/* <!-- Center text --> */}
                <text
                  x="50"
                  y="50"
                  font-family="Verdana"
                  font-size="20"
                  text-anchor="middle"
                  alignment-baseline="middle"
                >
                  70%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded h-screen">
        <NavLink to="/add-order"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <IoBagAdd />
          <span className="ml-2">Add New Order</span>
        </NavLink>

        <div className="bg-white h-screen mt-4">orders table</div>
      </div>
    </div>
  );
};

export default OrderDetails;
