import { SiVirustotal } from "react-icons/si";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { IoBagAdd} from "react-icons/io5";

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
        <IoBagAdd />
        <span className="ml-2">Add New Order</span>
        </button>

        <div className="bg-white h-screen mt-4">
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
