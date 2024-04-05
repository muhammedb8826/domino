import { getSuppliers, searchSuppliers } from "@/redux/features/supplier/suppliersSlice";
import { useEffect, useState } from "react";
import { FaProductHunt } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { SupplierRegistration } from "./SupplierRegistration";

export const SupplierSearchInput = ({ handleSupplierInfo, value }) => {
    const dispatch = useDispatch();
    const { suppliers, searchTerm } = useSelector((state) => state.supplier);
  
    const [searchInput, setSearchInput] = useState(value || "");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
  
    useEffect(() => {
      setSearchInput(value || "");
    }, [value]);
  
    useEffect(() => {
      dispatch(getSuppliers());
    }, [dispatch]);
  
    const filteredSuppliers = suppliers.filter(
      (supplier) =>
        supplier.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.id?.toString().includes(searchTerm) ||
        supplier.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.company?.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  
    const handleSearchSupplier = (e) => {
      setSearchInput(e.target.value);
      setIsDropdownOpen(true);
      dispatch(searchSuppliers(e.target.value));
    };
  
    const handleSelectSupplier = (supplier) => {
      setSearchInput(supplier.firstName);
      setIsDropdownOpen(false);
      handleSupplierInfo(supplier);
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
        <div className="relative gap-4">
          <label
            htmlFor="input-group-search"
            className="mb-3 block text-black dark:text-white"
          >
            Vendor
          </label>
          <div className="relative flex-1">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center pointer-events-none">
            </div>
            <input
              value={searchInput}
              onChange={handleSearchSupplier}
              type="text"
              name="supplierFirstName"
              id="input-group-search"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Type vendor"
            />
          </div>
        </div>
  
        {/* <!-- Dropdown menu --> */}
        <div
          id="dropdownSearch"
          className={`z-50 ${
            isDropdownOpen ? "" : "hidden"
          } bg-white rounded-lg rounded-t-none border-stroke shadow dark:bg-gray-700 w-full absolute top-19.5`}
        >
          <ul
            className="max-h-48 px-3 pb-3 bg-white dark:bg-black overflow-y-auto text-sm text-black dark:text-white"
            aria-labelledby="dropdownSearchButton"
          >
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <li key={supplier.id}>
                  <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      onChange={() => handleSelectSupplier(supplier)}
                      value={searchInput}
                      id={`checkbox-item-${supplier.id}`}
                      type="radio"
                      name="supplierFirstName"
                      className="bg-white w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={`checkbox-item-${supplier.id}`}
                      className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                    >
                      {supplier.firstName}
                    </label>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-2 ms-2 text-sm font-medium">No supplier found</li>
            )}
          </ul>
          <button
            onClick={handleModalOpen}
            type="button"
            className="w-full flex bg-white dark:bg-black items-center p-3 text-sm font-medium text-primary border-[1.5px] border-stroke border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
          >
              <FaProductHunt className="w-5 h-5 me-2" />
            Add new supplier
          </button>
        </div>
        {modalOpen && <SupplierRegistration handleModalOpen={handleModalOpen} />}
      </>
    );
  };