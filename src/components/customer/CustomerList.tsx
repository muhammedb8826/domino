'use client';
import { IoBagAdd } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { useEffect, useState } from "react";
import { getCustomers } from "../../redux/features/customer/customerSlice";
import { CustomerRegistration } from "./CustomerRegistrationModal";
import { CiMenuKebab } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";


export const CustomerList = () => {
    const {customers, isLoading, error} = useSelector((state)=>state.customer);
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [showPopover, setShowPopover] = useState(null);

    const handleModalOpen = () => {
        setOpenModal((prev)=>!prev);
    }
    useEffect(()=>{
     dispatch(getCustomers());
    },[dispatch])
    console.log(customers);

    const handleAction = (index: number) => {
        setShowPopover((prevIndex) => (prevIndex === index ? null : index));
      };

    // const handleCustomer = (id) => {
    //     Swal.fire({
    //       title: "Are you sure?",
    //       text: "You want to delete this order!",
    //       icon: "warning",
    //       showCancelButton: true,
    //       confirmButtonColor: "#3085d6",
    //       cancelButtonColor: "#d33",
    //       confirmButtonText: "Yes, delete it!",
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //         Swal.fire({
    //           title: "Deleted!",
    //           text: "The order has been deleted.",
    //           icon: "success",
    //         }).then(() => {
    //           dispatch(deleteCustomer(id));
    //         });
    //       }
    //       setShowPopover(null);
    //     });
    //   }
 
    
    if(isLoading) return <Loading/>
    if(error) return <ErroPage error={error}/>
  return (
<div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
<div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <div>
        <button
        type="button"
            onClick={handleModalOpen}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <IoBagAdd />
            <span className="ml-2">Add New Customer</span>
          </button>
        </div>
        <label htmlFor="table-search" className="sr-only">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
            </div>
            <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for customers"/>
        </div>
    </div>


    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="p-4">
                    <div className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                </th>
                <th scope="col" className="px-6 py-3">
                    Customer name
                </th>
                <th scope="col" className="px-6 py-3">
                    Phone number
                </th>
                <th scope="col" className="px-6 py-3">
                    Company type
                </th>
                <th scope="col" className="px-6 py-3">
                    Order
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {customers.map((customer, index)=>
            <tr key={customer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                    </div>
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {customer.firstName}
                </th>
                <td className="px-6 py-4">
                    {customer.phone}
                </td>
                <td className="px-6 py-4">
                    {customer.companyType}
                </td>
                <td className="px-6 py-4">
                    customer orders
                </td>
                <td className="px-6 py-4 relative">
                <button
                onClick={() => handleAction(index)}
                title="action"
                data-popover-target={`popover-bottom-${index}`}
                data-popover-trigger="click"
                id={`dropdownAvatarNameButton-${customer.id}-${index}`}
                type="button"
                className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <CiMenuKebab />
              </button>
              {showPopover === index && (
                <div className="absolute z-40 right-40 -top-14 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                  {/* Dropdown content */}
                  <div className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">Pro User</div>
                    <div className="truncate">email</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        type="button"
                        className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                      >
                        <FaRegEdit />
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        // onClick={() => handleDeleteOrder(customer.id)}
                        type="button"
                        className="text-left text-red-500 flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                      >
                        <MdDelete /> Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
                </td>
            </tr>
            )}
        </tbody>
    </table>
    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
                <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
            </li>
            <li>
                <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
            </li>
            <li>
                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
            </li>
            <li>
        <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
            </li>
        </ul>
    </nav>
    {openModal && <CustomerRegistration handleModalOpen={handleModalOpen}/>}
</div>

  )
}
