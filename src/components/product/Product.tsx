import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/features/product/productSlice";
import { FaRegEdit, FaUserPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CiMenuKebab } from "react-icons/ci";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";

const Product = () => {
    const { products, isLoading, error } = useSelector((state: RootState) => state.product);
    const { user } = useSelector((state: RootState) => state.auth);
    const [showPopover, setShowPopover] = useState(null);
    const dispatch = useDispatch();   

   useEffect(() => {
    dispatch(getProducts());
   }, [dispatch]); 

   const handleAction = (index: number) => {
    setShowPopover((prevIndex) => (prevIndex === index ? null : index));
  };

    const handleDeleteProduct = (id: number) => {
        // dispatch(deleteProduct(id));
        }

    if (isLoading) {
      return  <Loading />
    }
    if (error) {
        return <ErroPage error={error} />
    }

    const productListContent = products
    ? products.map((product, index: number) => (
        <tbody key={product.id}>
          <tr className="bg-white border-b hover:bg-gray-50">
            <td className="w-4 p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-table-1"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="checkbox-table-1" className="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
            >
              <img
                className="w-10 h-10 rounded-full"
                src={product.image}
                alt="Jese image"
              />
              <div className="ps-3">
                <div className="text-base font-semibold">
                  {product.name} 
                </div>
                <div className="font-normal text-gray-500">{product.description}</div>
              </div>
            </th>
            <td className="px-6 py-4">{product.price}</td>
            <td className="px-6 py-4 truncate">{product.attributes.map((item)=>item.name).join(", ")}</td>
            <td className="px-6 py-4">product reg date</td>
            <td className="px-6 py-4">
              <button
                onClick={() => handleAction(index)}
                title="action"
                data-popover-target={`popover-bottom-${index}`}
                data-popover-trigger="click"
                id={`dropdownAvatarNameButton-${user.id}-${index}`}
                type="button"
                className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                <CiMenuKebab />
              </button>
              {showPopover === index && (
                <div className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                  {/* Dropdown content */}
                  <div className="px-4 py-3 text-sm text-gray-900">
                    <div className="font-medium">Name: {product.name}</div>
                    <div className="truncate font-medium">Product Id: {product.id}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        // onClick={() => handleUpdateModal(user.id)}
                        type="button"
                        className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                      >
                        <FaRegEdit />
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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
        </tbody>
      ))
    : null;
    
  return (
    <>
    <div className="p-4 h-[550px] overflow-y-scroll">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div>
          <button
            // onClick={handleModalOpen}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            <FaUserPlus />
            <span className="ml-2">Add New Product</span>
          </button>
        </div>

        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
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
            type="text"
            id="table-search-products"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for products"
          />
        </div>
      </div>

      {/* {isModalOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            {/* <UserRegistration
              handleModalOpen={handleModalOpen}
              errors={registrationError}
            /> 
          </div>
        </div>
      )} */}

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  "
                />
                <label htmlFor="checkbox-all" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
                Attributes
            </th>
            <th scope="col" className="px-6 py-3">
                Created At
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        {productListContent}
      </table>
      
    </div>
    <div className="flex items-center gap-4 mt-4">
        <button
          disabled
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            ></path>
          </svg>
          Previous
        </button>
        <div className="flex items-center gap-2">
          <button
            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              1
            </span>
          </button>
          <button
            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              2
            </span>
          </button>
          <button
            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              3
            </span>
          </button>
          <button
            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              4
            </span>
          </button>
          <button
            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              5
            </span>
          </button>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            ></path>
          </svg>
        </button>
      </div>
    </>
  )
}

export default Product