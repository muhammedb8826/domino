import { createPurchase } from "@/redux/features/purchaseSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io"
import { useDispatch } from "react-redux";

export const PurchaseRegistration = ({handleModalOpen}) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        company: "",
        address: "",
        tinNumber: "",
      });

    //   const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData({ ...formData, [name]: value });
    //   };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createPurchase(formData)).then((res) => {
          if (res.payload) {
            const message = "Purchase registered successfully";
            toast.success(message);
            setFormData({
              firstName: "",
              lastName: "",
              phone: "",
              email: "",
              company: "",
              address: "",
              tinNumber: "",
            });
            handleModalOpen(false);
          }
        });
      };
  return (
    <>
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999 bg-black/50 outline-none focus:outline-none">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-auto my-6 mx-auto max-w-3xl ">
          {/*content*/}
          <div className="border-0 rounded-lg relative flex flex-col w-full bg-white shadow-default dark:border-strokedark dark:bg-boxdark outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark rounded-t">
              <h3 className="text-3xl text-black dark:text-white font-semibold text">Add supplier</h3>
              <button
                title="close"
                type="button"
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => handleModalOpen(false)}
              >
                <span className="bg-transparent text-black dark:text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <IoMdClose />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">

            </div>
            {/*footer*/}
            <div className="flex items-center justify-end gap-4.5 border-t border-stroke py-4 px-6.5 dark:border-strokedark rounded-b">
                <button
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  type="button"
                  onClick={() => handleModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
