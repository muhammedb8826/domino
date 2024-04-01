import { createSupplier } from "@/redux/features/supplier/suppliersSlice";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const SupplierRegistration = ({ handleModalOpen }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSupplier(formData)).then((res) => {
      if (res.payload) {
        const message = "Supplier registered successfully";
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
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      First name
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.firstName}
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Last name
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.lastName}
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Email address
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.email}
                      name="email"
                      type="email"
                      id="email"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="john.doe@company.com"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="tinNumber"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Tin number
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.tinNumber}
                      name="tinNumber"
                      type="text"
                      id="tinNumber"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Phone number
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.phone}
                      name="phone"
                      type="tel"
                      id="phone"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="123-45-678"
                      pattern="[0-9]{2}-[0-9]{4}-[0-9]{4}"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Company
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.company}
                      type="text"
                      id="company"
                      name="company"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="Domino"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Address
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.address}
                      type="text"
                      id="address"
                      name="address"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="Adress"
                    />
                  </div>
                </div>
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
  );
};
