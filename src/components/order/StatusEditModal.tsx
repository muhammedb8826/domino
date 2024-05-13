import { updateOrder } from "@/redux/features/order/orderSlice";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const StatusEditModal = ({
  handleModalOpen,
  dataId,
  data,
  statusValues,
  onUpdateStatus
}) => {


  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const [note, setNote] = useState(data.orderItems.find((item) => item.id === dataId)?.note);

  const handleChange = (e) => {
    setStatus(e.target.value);
  };
  const handleChangeNote = (e) => {
    setNote(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Find the index of the matching order item
    const updatedOrderItems = data.orderItems.map((item) => {
      if (item.id === dataId) {        
        // Create a new object with updated status and note for the matching item
        return {
          ...item,
          status: status,
          note: note,
        };
      }
      // Return the original item if the id doesn't match
      return item;
    });

    const formData = {
      id: data.id,
      ...data,
      orderItems: updatedOrderItems,
    };


    dispatch(updateOrder(formData)).then((res) => {
      if (res.payload) {
        const message = "Order status updated successfully";
        toast.success(message);
        onUpdateStatus(updatedOrderItems);
        handleModalOpen(false);
      } else {
        // If the update fails, show error message
        const message = "Something went wrong!";
        toast.error(message);
      }
    });
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit} className="w-full md:w-1/2">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">Edit order status</h3>
                <button
                  title="close"
                  type="button"
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => handleModalOpen(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    <IoMdClose />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto grid grid-cols-2 gap-4">
                <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                  <input
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    id="bordered-radio-1"
                    type="radio"
                    value={statusValues.statusValue1}
                    name="bordered-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="bordered-radio-1"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {statusValues.statusValue1}
                  </label>
                </div>
                <div className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
                  <input
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    id="bordered-radio-2"
                    type="radio"
                    value={statusValues.statusValue2}
                    name="bordered-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="bordered-radio-2"
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {statusValues.statusValue2}
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="note"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Note
                  </label>
                  <textarea
                    onChange={handleChangeNote}
                    value={note}
                    id="note"
                    rows={4}
                    name="note"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-danger background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="bg-primary text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};
