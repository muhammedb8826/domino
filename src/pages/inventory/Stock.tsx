import ErroPage from "@/components/common/ErroPage";
import { getPurchases } from "@/redux/features/purchaseSlice";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Loader from "@/common/Loader";
import { getProducts } from "@/redux/features/product/productSlice";
import CardOne from "@/components/CardOne";
import CardTwo from "@/components/CardTwo";
import { FcSalesPerformance } from "react-icons/fc";
import { BiPurchaseTag } from "react-icons/bi";
import { getSales } from "@/redux/features/saleSlice";
import { getStock, updateStock } from "@/redux/features/stockSlice";
import { Link, NavLink } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";

export const Stock = () => {
  const { purchases } = useSelector((state: RootState) => state.purchase);
  const { products, isLoading, error } = useSelector(
    (state: RootState) => state.product
  );
  const { sales } = useSelector((state: RootState) => state.sale);
  const {stock} = useSelector((state: RootState) => state.stock);
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPurchases());
    dispatch(getProducts());
    dispatch(getSales());
    dispatch(getStock());
  }, [dispatch]);

  const [showPopover, setShowPopover] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);

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

  const filteredSalesStatus = sales?.filter(
    (sale) => sale.status === "stocked-out"
  );

  const filteredPurchasesStatus = purchases?.filter(
    (sale) => sale.status === "received"
  );

  const totalSales = filteredSalesStatus?.reduce(
    (acc, sale) => acc + Number(sale.totalQuantity),
    0
  );  

  const totalPurchases = filteredPurchasesStatus?.reduce(
    (acc, purchase) => acc + Number(purchase.totalQuantity),
    0
  );

  const handleTotalSales = (id: string) => {
    // Filter sales that contain the product with the given id
    const salesWithProduct = filteredSalesStatus?.filter(sale => sale.products?.some(product => product.productId === id));
  
    // Calculate total quantity of the product across all filtered sales
    const totalQuantity = salesWithProduct?.reduce((acc, sale) => {
      // Find the product in the sale's products array
      const product = sale.products.find(product => product.productId === id);
      if (product) {
        // Add the quantity of this product to the accumulator
        return acc + parseInt(product.quantity);
      }
      return acc;
    }, 0);
  
    return totalQuantity || 0; // Return 0 if totalQuantity is undefined or null
  }


  const handleTotalPurchases = (id: string) => {
    // Filter purchases that contain the product with the given id
    const purchasesWithProduct = filteredPurchasesStatus?.filter(purchase => purchase.products?.some(product => product.productId === id));
  
    // Calculate total quantity of the product across all filtered purchases
    const totalQuantity = purchasesWithProduct?.reduce((acc, purchase) => {
      // Find the product in the purchase's products array
      const product = purchase.products.find(product => product.productId === id);
      if (product) {
        // Add the quantity of this product to the accumulator
        return acc + parseInt(product.quantity);
      }
      return acc;
    }, 0);
    return totalQuantity || 0; // Return 0 if totalQuantity is undefined or null
  }

  if (error) {
    return <ErroPage error={error} />;
  }

  const productListContent = stock?.map((s, index) => {
    const product = products?.find((product) => product.id === s.productId);
  
    const isLowStock = Number(s.quantity) <= Number(product?.minStockLevel);
    const rowClassName = isLowStock ? "bg-danger/25 dark:bg-danger/80" : "";

    return (
      <tr key={s.id} className={rowClassName}>
      <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
      {product?.name}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
        {s.quantity}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
      {product?.initialStock}
      </td>
      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
      {product?.minStockLevel}
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
                  onClick={() => handleEditModalOpen(s.productId)}
                  to="#"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <FaRegEdit />
                  Edit
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  onClick={() => handleDeleteProduct(product.id)}
                  to="#"
                  className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                  <MdDelete />
                  Delete
                </NavLink>
              </li> */}
            </ul>
          </div>
        )}
        {/* <!-- Dropdown End --> */}
      </td>
    </tr>
    );
  });

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardOne icons={<FcSalesPerformance />} text="Total Sales" count={totalSales} />
        <CardTwo icons={<BiPurchaseTag />} text="Total Purchases" count={totalPurchases}  />
        {/* <CardThree />
        <CardFour /> */}
      </div>

      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 py-4">
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
        <div className="max-w-full overflow-hidden overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                  Product name
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Quantity
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Initial stock
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Min stock level
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
      {/* {isEditModalOpen && (
        <PurchaseDetailsModal
          handleEditModalOpen={handleEditModalOpen}
          data={data}
        />
      )} */}
    </>
  );
};