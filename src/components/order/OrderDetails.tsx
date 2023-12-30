import { SiVirustotal } from "react-icons/si";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";

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
          <p>
            <SiVirustotal />
          </p>
          <div className="">
            <p>34</p>
            <p>Total Order</p>
          </div>
          <div className="progress ml-auto">
            <span>progeress</span>
          </div>
        </div>

        <div className="total-order flex items-center gap-4 shadow-sm bg-white rounded-md p-4 w-[30%]">
          <p>
            <MdOutlinePendingActions />
          </p>
          <div className="">
            <p>34</p>
            <p>Total Order Pending</p>
          </div>
          <div className="progress ml-auto">
            <span>progeress</span>
          </div>
        </div>

        <div className="total-order flex items-center gap-4 shadow-sm bg-white rounded-md p-4 w-[30%]">
          <p>
            <MdApproval />
          </p>
          <div className="">
            <p>34</p>
            <p>Total Order Approved</p>
          </div>
          <div className="progress ml-auto">
            <span>progeress</span>
          </div>
        </div>
      </div>

      <div className="rounded h-screen">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            className="w-3.5 h-3.5 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 21"
          >
            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
          </svg>
          Add New Order
        </button>

        <div className="bg-white h-screen mt-4">
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
