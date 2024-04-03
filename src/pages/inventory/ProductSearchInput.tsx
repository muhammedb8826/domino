import {
  getProducts,
  searchProducts,
} from "@/redux/features/product/productSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductRegistration } from "./ProductRegistration";
import { FaProductHunt } from "react-icons/fa6";

export const ProductSearchInput = ({ handleProductInfo, value }) => {

  const dispatch = useDispatch();
  const { products, searchTerm } = useSelector((state) => state.product);

  const [searchInput, setSearchInput] = useState(value || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setSearchInput(value || "");
  }, [value]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id?.toString().includes(searchTerm)
  );

  const handleSearchProduct = (e) => {
    setSearchInput(e.target.value);
    setIsDropdownOpen(true);
    dispatch(searchProducts(e.target.value));
  };

  const handleSelectProduct = (product) => {
    setSearchInput(product.name);
    setIsDropdownOpen(false);
    handleProductInfo(product);
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
          className="sr-only mb-3 block text-black dark:text-white"
        >
          Product
        </label>
        <div className="relative">
          {/* <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
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
          </div> */}
          <input
            value={searchInput}
            onChange={handleSearchProduct}
            type="text"
            name="productName"
            id="input-group-search"
            className="w-full rounded-lg bg-transparent px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:text-white"
            placeholder=""
          />
        </div>
      </div>

      {/* <!-- Dropdown menu --> */}
      <div
        id="dropdownSearch"
        className={`z-10 ${
          isDropdownOpen ? "" : "hidden"
        } bg-white rounded-lg rounded-t-none border-stroke bg-transparent shadow dark:bg-gray-700 w-full absolute top-12`}
      >
        <ul
          className="max-h-48 px-3 pb-3 overflow-y-auto text-sm text-black dark:text-white"
          aria-labelledby="dropdownSearchButton"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product.id}>
                <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                  <input
                    onChange={() => handleSelectProduct(product)}
                    value={searchInput}
                    id={`checkbox-item-${product.id}`}
                    type="radio"
                    name="productName"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`checkbox-item-${product.id}`}
                    className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                  >
                    {product.name}
                  </label>
                </div>
              </li>
            ))
          ) : (
            <li className="py-2 ms-2 text-sm font-medium">No product found</li>
          )}
        </ul>
        <button
          onClick={handleModalOpen}
          type="button"
          className="w-full flex items-center p-3 text-sm font-medium text-primary border-[1.5px] border-stroke bg-transparent border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
        >
            <FaProductHunt className="w-5 h-5 me-2" />
          Add new product
        </button>
      </div>
      {modalOpen && <ProductRegistration handleModalOpen={handleModalOpen} />}
    </>
  );
};
