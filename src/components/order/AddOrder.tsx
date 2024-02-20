import { useEffect, useState } from "react";
import { CustomerRegistration } from "../customer/CustomerRegistrationModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomers,
  searchUsers,
} from "../../redux/features/customer/customerSlice";
import { FiPlusCircle } from "react-icons/fi";
import { VscCollapseAll } from "react-icons/vsc";
import OrderForm from "./OrderForm";
import { GoBack } from "../common/GoBack";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";

const AddOrder = () => {
  const { customers, isLoading, error, searchTerm } = useSelector(
    (state) => state.customer
  );

  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toString().includes(searchTerm) ||
      customer.phone.toLowerCase().includes(searchTerm) ||
      customer.companyType.toLowerCase().includes(searchTerm)
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [addOrder, setAddOrder] = useState(["order #1"]);
  const [count, setCount] = useState(1);

  const handleSearchUser = (e) => {
    setSearchInput(e.target.value);
    setIsDropdownOpen(true);
    dispatch(searchUsers(e.target.value));
  };
  const handleSelectCustomer = (customer) => {
    setSearchInput(customer.firstName);
    setIsDropdownOpen(false);
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

  console.log(searchInput);

  const handleAddOrder = () => {
    setCount((prev) => prev + 1);
    setAddOrder((prev) => [...prev, `order #${count + 1}`]);
  };

  const handleDeleteOrder = (index) => {
    if(addOrder.length === 1) return alert('You cannot delete the last order');
    setAddOrder((prevOrders) => {
      const newOrders = prevOrders.filter((order, i) => i !== index);
      setCount((prev) => prev === 1 ? 1 : prev - 1);
      return newOrders.map((order, index) => `order #${index + 1}`);
    });
  };

  const handleCollapse = (index) => {
   const element = document.querySelectorAll('.order-form')[index];
    element.classList.toggle('hidden');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  }

if(isLoading) return <Loading />
if(error) return <ErroPage error={error} />

  return (
    <section className="wrapper p-4">
      <GoBack goback="/dashboard" />
      <h2 className="text-2xl font-semibold mb-4">Add Order</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="md:flex gap-4 relative">
        <button
          onClick={handleAddOrder}
            type="button"
            className="absolute left-[-25px] top-2.5 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-base p-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            <FiPlusCircle  />
            {/* <span className="ml-2">Add New Order</span> */}
          </button>
          <div className="flex-1 px-4">
          {addOrder.map((order, index) => (
            <div key={order} className="order-container mb-4">
              <button
              onClick={()=>handleCollapse(index)}
                type="button"
                className="h-16 bg-gray-300 w-full p-4 flex justify-between items-center"
              >
                <span className="text-2xl">{order}</span>
                <span className="text-2xl"><VscCollapseAll /></span>
              </button>
              <div className="order-form">
                <OrderForm />
              {index > 0 && <button onClick={()=>handleDeleteOrder(index)} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">Delete</button>}
                </div>
            </div>
          ))}

          </div>
          <div className="md:w-1/4 border">
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
                  value={searchInput}
                  onChange={handleSearchUser}
                  type="text"
                  id="input-group-search"
                  className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search by name, phone, or company type"
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
                className="max-h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownSearchButton"
              >
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <li key={customer.id}>
                      <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <input
                          onChange={() => handleSelectCustomer(customer)}
                          value={searchInput}
                          id={`checkbox-item-${customer.id}`}
                          type="radio"
                          name="user"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          htmlFor={`checkbox-item-${customer.id}`}
                          className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                        >
                          {customer.firstName}, {customer.phone}
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
          </div>
        </div>
      </form>
      {modalOpen && <CustomerRegistration handleModalOpen={handleModalOpen} />}
    </section>
  );
};

export default AddOrder;
