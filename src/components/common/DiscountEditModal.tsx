import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";
import { updateUnits } from "../../redux/features/unit/unitSlice";
import { updateDiscounts } from "@/redux/features/dicount/dicountSlice";

const DiscountEditModal = ({ handleModalOpen, data = {level: 0, minumumMeterSquare: 0, discountPercentage: 0,} }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(data);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDiscounts(formData)).then((res) => {
      if (res.payload) {
        const message = "Discount updated successfully";
        toast.success(message);
        setFormData({ level: 0, minumumMeterSquare: 0, discountPercentage: 0});
        handleModalOpen(false);
      }
    });
  };

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit}>
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">Edit {data.name}</h3>
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
              <div className="relative p-6 flex-auto">
                <div>
                  <label
                    htmlFor="level"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Level
                  </label>
                  <input
                    onChange={handleChange}
                    type="number"
                    value={formData.level}
                    name="level"
                    id="level"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="eg, Print"
                  />
                </div>
                <div>
                  <label
                    htmlFor="minumumMeterSquare"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Meter Square
                  </label>
                  <input
                    onChange={handleChange}
                    type="number"
                    value={formData.minumumMeterSquare}
                    name="minumumMeterSquare"
                    id="minumumMeterSquare"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="eg, 10"
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountPercentage"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Percentage %
                  </label>
                  <input
                    onChange={handleChange}
                    type="number"
                    value={formData.discountPercentage}
                    name="discountPercentage"
                    id="discountPercentage"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="eg, 10"
                  />
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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

export default DiscountEditModal;
