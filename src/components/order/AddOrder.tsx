import { useState } from "react";
import { CustomerRegistration } from "../common/CustomerRegistrationModal";

const AddOrder = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)

  // const toggleDropdown = () => {
  //   setIsDropdownOpen((prevState) => !prevState);
  // };

  const handleSearchUser = (e) => {
    if(e.target.value === "") {
      setIsDropdownOpen(false);
    } else {
      setIsDropdownOpen(true);
    }
  }

  const handleModalOpen = () => {
    setModalOpen((prev)=>!prev)
  }

  return (
    <section className="wrapper p-4">
      <form action="">
        <div className="md:flex gap-4">
          <div className="flex-1 border-r-2 border-blue-100">order</div>
          <div className="md:w-1/4 border border-green-400">

             <div className="p-3">
                <label htmlFor="input-group-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                  onChange={handleSearchUser}
                    type="text"
                    id="input-group-search"
                    className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search user"
                  />
                </div>
              </div>

            {/* <!-- Dropdown menu --> */}
            <div
              id="dropdownSearch"
              className={`z-10 ${
                isDropdownOpen ? "" : "hidden"
              } bg-white rounded-lg shadow dark:bg-gray-700 w-full`}
            >
              <ul
                className="px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
              >
                <li>
                  <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id="checkbox-item-11"
                      type="radio"
                      name="user"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="checkbox-item-11"
                      className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      Bonnie Green
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id="checkbox-item-12"
                      type="radio"
                      name="user"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor="checkbox-item-12"
                      className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      Mame Ber
                    </label>
                  </div>
                </li>
              </ul>
              <button
              onClick={handleModalOpen}
                type="button"
                className="w-full flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:blue-red-500 hover:underline"
              >
                <svg
                  className="w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Zm11-3h-6a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2Z" />
                </svg>
                Add user
              </button>
            </div>
          </div>
        </div>
      </form>
      {modalOpen && <CustomerRegistration handleModalOpen={handleModalOpen}/>}
          
    </section>
  );
};

export default AddOrder;
