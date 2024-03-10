import { useEffect, useState } from "react";
import { CommissionRegistration } from "./CommissionRegistrationModal";
import { getCustomers, searchUsers } from "../../redux/features/customer/customerSlice";
import { useDispatch, useSelector } from "react-redux";
import { getCommissions } from "@/redux/features/commission/commissionSlice";


const CommissionSearchInput = ({ handleCommissionInfo, value }) => {
    const dispatch = useDispatch();
    const { commissions, searchTerm } = useSelector((state) => state.commission);

    const [searchInput, setSearchInput] = useState(value || "");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
      setSearchInput(value || "");
  }, [value]);

  useEffect(() => {
      dispatch(getCommissions());
  }, [dispatch]);
    
      const filteredCommission = commissions.filter(
        (commission) =>
          commission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          commission.id.toString().includes(searchTerm) ||
          commission.phone.toLowerCase().includes(searchTerm) ||
          commission.companyType.toLowerCase().includes(searchTerm)
      );
    
      const handleSearchUser = (e) => {
        setSearchInput(e.target.value);
        setIsDropdownOpen(true);
        dispatch(searchUsers(e.target.value));
      };
      const handleSelectCustomer = (commission) => {
        setSearchInput(commission.firstName);
        setIsDropdownOpen(false);
        handleCommissionInfo(commission);
      };

    const handleModalOpen = () => {
        setModalOpen((prev) => !prev);
      };
    
      useEffect(() => {
        const looseFocus = (e: MouseEvent) => {
          if ((e.target as HTMLInputElement).id !== "input-group-search") {
            setIsDropdownOpen(false);
          }
        };
        document.addEventListener("click", looseFocus);
        return () => {
          document.removeEventListener("click", looseFocus);
        };
      }, []);
 
    return (
    <>
        <div className="relative">
              <label
                htmlFor="input-group-search"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Customer
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
                  value={searchInput}
                  onChange={handleSearchUser}
                  type="text"
                  name="customerName"
                  id="input-group-search"
                  className="block w-full p-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search by name, phone, or company type"
                />
              </div>
            </div>

            {/* <!-- Dropdown menu --> */}
            <div
              id="dropdownSearch"
              className={`z-10 ${
                isDropdownOpen ? "" : "hidden"
              } bg-white rounded-lg rounded-t-none shadow dark:bg-gray-700 w-full absolute top-15 border border-gray-200 dark:border-gray-600 dark:border-opacity-50`}
            >
              <ul
                className="max-h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
              >
                {filteredCommission.length > 0 ? (
                  filteredCommission.map((commission) => (
                    <li key={commission.id}>
                      <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input
                          onChange={() => handleSelectCustomer(commission)}
                          value={searchInput}
                          id={`checkbox-item-${commission.id}`}
                          type="radio"
                          name="customerPhone"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor={`checkbox-item-${commission.id}`}
                          className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                        >
                          {commission.firstName}, {commission.phone}
                        </label>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No customer found</li>
                )}
              </ul>
              <button
                onClick={handleModalOpen}
                type="button"
                className="w-full flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
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
                Add new customer
              </button>
            </div>
            {modalOpen && <CommissionRegistration handleModalOpen={handleModalOpen} />}
    </>
  )
}

export default CommissionSearchInput