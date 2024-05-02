import { useEffect, useState } from "react";
import { SalesPartnerRegistration } from "./SalesPartnerRegistrationModal";
import { useDispatch, useSelector } from "react-redux";
import { getSalesPartners, setSearchTerm } from "@/redux/features/salesPartnersSlice";
import Loader from "@/common/Loader";


export const SalesPartnerSearchInput = ({ handleCommissionInfo, value }) => {
    const dispatch = useDispatch();
    const { salesPartners, isLoading, searchTerm } = useSelector((state) => state.salesPartner);

    const [searchInput, setSearchInput] = useState(value || "");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
      setSearchInput(value || "");
  }, [value]);

  useEffect(() => {
      dispatch(getSalesPartners());
  }, [dispatch]);
    
      const filteredCommission = salesPartners.filter(
        (commission) =>
          commission.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          commission.id?.toString().includes(searchTerm) ||
          commission.phone?.toLowerCase().includes(searchTerm) ||
          commission.companyType?.toLowerCase().includes(searchTerm)
      );
    
      const handleSearchUser = (e) => {
        setSearchInput(e.target.value);
        setIsDropdownOpen(true);
        dispatch(setSearchTerm(e.target.value));
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
 
    return isLoading ? (<Loader/>):(
    <>
        <div className="relative">
        <label
                htmlFor="input-group-search"
                className="mb-3 block text-black dark:text-white"
              >
                Sales partner
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
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-8 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>

            {/* <!-- Dropdown menu --> */}
            <div
              id="dropdownSearch"
              className={`z-10 ${
                isDropdownOpen ? "" : "hidden"
              } bg-white rounded-lg rounded-t-none border-stroke bg-transparent shadow dark:bg-gray-700 w-full absolute top-20`}
            >
              <ul
                className="max-h-48 px-3 pb-3 overflow-y-auto text-sm text-black dark:text-white"
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
                className="w-full flex items-center p-3 text-sm font-medium text-primary border-[1.5px] border-stroke bg-transparent border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
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
                Add sales partner
              </button>
            </div>
            {modalOpen && <SalesPartnerRegistration handleModalOpen={handleModalOpen} />}
    </>
  )
}
