import { useEffect, useRef, useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit, FaUserPlus } from "react-icons/fa";
import { ProductRegistration } from "./ProductRegistration";
import Breadcrumb from "../../components/Breadcrumb";
import userImage from "../../assets/images/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  getProducts,
} from "@/redux/features/product/productSlice";
import Loader from "@/common/Loader";
import { Link, NavLink } from "react-router-dom";
import ErroPage from "@/components/common/ErroPage";
import { MdDelete, MdOutlineProductionQuantityLimits } from "react-icons/md";
import Swal from "sweetalert2";
import { ProductEditModal } from "./ProductEditModal";

export const Products = () => {
  const { products, isLoading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const [showPopover, setShowPopover] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (
        !dropdownOpen ||
        dropdownRef.current.contains(target) ||
        triggerRef.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const handleAction = (index) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover(index);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [data, setData] = useState({});
  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEditModalOpen = (id: string) => {
    const findData = products.find((data) => data.id === id);
    setData(findData);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleDeleteProduct = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The media has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteProduct(id));
        });
      }
    });
  };

  if (error) {
    return <ErroPage error={error} />;
  }

  const productListContent = products.map((product, index) => (
    <tr key={product.id}>
      <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
        <img
          className="w-10 h-10 rounded-full"
          src={userImage}
          alt="Jese image"
        />
        <div className="ps-3">
          <div className="text-base font-semibold text-black dark:text-white">
            {product.name}
          </div>
          {/* <div className="font-normal text-gray-500">{supplier.email}</div> */}
        </div>
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {product.description}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {product.unitPrice}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {product.quantity}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {product.category.name}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {product.stockLevel}
      </td>
      <td className="px-6 py-4 relative">
        <Link
          to="#"
          onClick={(event) => {
            handleAction(index);
            event.stopPropagation();
          }}
          ref={triggerRef}
          className="flex items-center gap-4"
        >
          <CiMenuKebab />
        </Link>

        {/* <!-- Dropdown Start --> */}
        {showPopover === index && (
          <div
            ref={dropdownRef}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
            className={`absolute right-14 mt-0 flex w-47.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
              dropdownOpen ? "block" : "hidden"
            }`}
          >
            <ul className="flex flex-col gap-2 border-b border-stroke p-3 dark:border-strokedark">
              <li>
                <NavLink
                  onClick={() => handleEditModalOpen(product.id)}
                  to="#"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <FaRegEdit />
                  Edit
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => handleDeleteProduct(product.id)}
                  to="#"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <MdDelete />
                  Delete
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        {/* <!-- Dropdown End --> */}
      </td>
    </tr>
  ));

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Breadcrumb pageName="Products" />

      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div>
          <button
            onClick={handleModalOpen}
            className="inline-flex items-center justify-center rounded bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
            type="button"
          >
            <MdOutlineProductionQuantityLimits />
            <span className="ml-2">Add Products</span>
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
            className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 ps-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="Search for products"
          />
        </div>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                  Product name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Unit price
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Quantity
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Category
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Stock Level
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>{productListContent}</tbody>
          </table>
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                1-10
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                1000
              </span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 bg-gray-2 text-left dark:bg-meta-4">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  4
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  5
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      {isModalOpen && <ProductRegistration handleModalOpen={handleModalOpen} />}
      {isEditModalOpen && (
        <ProductEditModal
          handleEditModalOpen={handleEditModalOpen}
          data={data}
        />
      )}
    </>
  );
};
