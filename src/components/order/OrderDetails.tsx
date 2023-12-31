import { SiVirustotal } from "react-icons/si";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdApproval } from "react-icons/md";
import { IoBagAdd } from "react-icons/io5";
import { useState } from "react";

const OrderDetails = () => {
  const [toggle, setToggle] = useState(false);

  const handlePopup = () => {
    setToggle(!toggle);
  };

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
        <button
          onClick={handlePopup}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <IoBagAdd />
          <span className="ml-2">Add New Order</span>
        </button>

        <div className="bg-white h-screen mt-4">orders table</div>
      </div>

      {toggle && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-[50%] h-[75%] overflow-y-scroll">
            <div className="flex justify-between items-center p-4">
              <h1 className="text-2xl font-bold">Add New Order</h1>
              <button onClick={handlePopup} className="text-2xl font-bold">
                &times;
              </button>
            </div>
            <hr />
            <form className="p-4">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Full Name
                </label>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="email"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phone number"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="phone number"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Phone Number
                  </label>
                </div>
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="projectName"
                  id="projectName"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 ark:focus:border-blue-500d focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="projectName"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Project Name
                </label>
              </div>

              <label htmlFor="projectType" className="sr-only">
                Project Type
              </label>
              <select
                id="projectType"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-600 appearance-none focus:outline-none focus:ring-0 focus:border-gray-600 peer"
              >
                <option value="" disabled selected hidden>
                  Please select an option
                </option>
                <option value="" disabled>
                  DOCUMENT PRINTING
                </option>
                <option value="color-copies">Color Copies</option>
                <option value="black-white-copies">
                  Black And White Copies
                </option>
                <option value="" disabled>
                  GRAPHICS PRINTING
                </option>
                <option value="mini-posters">Mini Posters</option>
                <option value="posters">Posters</option>
                <option value="banners">Banners</option>
                <option value="" disabled>
                  MARKETING PRINTING
                </option>
                <option value="business-cards">Business Cards</option>
                <option value="flyers">Flyers</option>
                <option value="brochures">Brochures</option>
                <option value="postcards">Postcards</option>
                <option value="door-hangers">Door Hangers</option>
                <option value="folders">Folders</option>
                <option value="stickers">Stickers</option>
                <option value="menus">Menus</option>
                <option value="rack-cards">Rack Cards</option>
                <option value="" disabled>
                  BOOKLETS PRINTING
                </option>
                <option value="saddle-sticked-booklets">
                  Saddle-Sticked Booklets
                </option>
                <option value="perfect-bound-booklets">
                  Perfect Bound Booklets
                </option>
                <option value="wire-o-booklets">Wire-O Booklets</option>
                <option value="spiral-bound-booklets">
                  Spiral Bound Booklets
                </option>
              </select>

              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Project Details"
              ></textarea>

              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
                Upload file
              </label>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                id="file_input"
                type="file"
              />

              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none mt-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
