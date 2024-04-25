import { BiPurchaseTag } from "react-icons/bi";
import { OperatorStoreDetailsModal, PurchaseDetailsModal } from "./OperatorStoreSaleDetails";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import Loader from "@/common/Loader";
import { MdDelete } from "react-icons/md";
import { BsTicketDetailed } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import ErroPage from "@/components/common/ErroPage";
import { deleteSale, getSales } from "@/redux/features/saleSlice";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getPrintedTransactions } from "@/redux/features/printedTransactionsSlice";
import { getProducts } from "@/redux/features/product/productSlice";
import { getUnits } from "@/redux/features/unit/unitSlice";

export const OperatorStore = () => {

        const { sales, isLoading, error } = useSelector((state) => state.sale);
        const { printedTransactions } = useSelector((state) => state.printedTransaction);
        const { products } = useSelector((state) => state.product);
        const { user } = useSelector((state: RootState) => state.auth);
        const { units } = useSelector((state) => state.unit);
      
        const dispatch = useDispatch();
        const navigate = useNavigate();
      
        useEffect(() => {
          if (!user) {
            navigate("/signin");
          }
        }, [user, navigate]);
      
        useEffect(() => {
          dispatch(getSales());
          dispatch(getPrintedTransactions())
          dispatch(getProducts());
          dispatch(getUnits())
        }, [dispatch]);
      
        const [showPopover, setShowPopover] = useState(null);
        const [dropdownOpen, setDropdownOpen] = useState(false);
        const triggerRef = useRef<any>(null);
        const dropdownRef = useRef<any>(null);
        const [active, setActive] = useState('home');

        const handlChangeTab = (newActiveState) => {
          setActive(newActiveState);
        }
      
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

          const handleRequestedArea = (productName) => {
            // Calculate total area for requested quantities for the productName
            let totalRequestedArea = 0;
          
            filteredSalesStatus.forEach((sale) => {
              sale.products.forEach((product) => {
                if (product.productName === productName) {
                  const matchingUnit = units.find((unit) => unit.id === product.unitId);
                  console.log(matchingUnit);
                  
                  if(matchingUnit){
                  const width = matchingUnit.width;
                  const height = matchingUnit.height;
                  const quantity = parseInt(product.quantity, 10);
                  totalRequestedArea += parseInt(width) * parseInt(height) * quantity;
                  }
                }
              });
            });
          
            return totalRequestedArea;
          };

          const handlePrintedArea = (productName) => {
            // Calculate total area for printed quantities for the productName
            let totalPrintedArea = 0;
          
            printedTransactions.forEach((transaction) => {
              if (transaction.material.toLowerCase() === productName.toLowerCase()) {
                const width = parseFloat(transaction.width);
                const height = parseFloat(transaction.height);
                const quantity = parseInt(transaction.quantity, 10);
                totalPrintedArea += width * height * quantity;
              }
            });
          
            return totalPrintedArea;
          };

          const handleUnitName = (unitId) => {
            const unit = units.find((unit) => unit.id === unitId);
            return unit ? unit.name : "";
          };
        
        if (error) {
          return <ErroPage error={error} />;
        }
      

        const listContent = products.map((data) =>  {
          const requestedArea = handleRequestedArea(data.name);
          const printedArea = handlePrintedArea(data.name);
          const unitName = handleUnitName(data.unitId);
          return (
          <tr key={data.id}>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {data.name}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {requestedArea}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {printedArea}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {requestedArea - printedArea}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {unitName}
            </td>
          </tr>
          );
        });

        const productListContent = filteredSalesStatus.map((sale, index) => (
          <tr key={sale.id}>
            <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
             {sale.id}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {sale.orderDate}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {sale.operatorFirstName}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {sale.products.map((product) => product.quantity).reduce((a, b) => a + Number(b), 0)}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {sale.status}
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
                      <Link
                      to={`/dashboard/inventory/operator-store/${sale.id}`}
                        // onClick={() => handleEditModalOpen(sale.id)}
                        // type="button"
                        className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                      >
                        <BsTicketDetailed />
                        Details
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              {/* <!-- Dropdown End --> */}
            </td>
          </tr>
        ));
      
        const printedListContent = printedTransactions.map((data, index) => (
          <tr key={data.id}>
            <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
             {data.orderId}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {data.material}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {data.service}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {data.date}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {data.operator}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {data.quantity}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {data.width} x {data.height}
            </td>
            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
              {Number(data.quantity) * Number(data.width) * Number(data.height)}
            </td>
          </tr>
        ));
      
        return isLoading ? (
          <Loader />
        ) : (
          <>
            {/* <Breadcrumb pageName="Operator store" /> */}
            <nav>
              <ul className="list-reset py-4 pl-4 rounded flex bg-white dark:bg-boxdark dark:text-white">
                <li className="text-gray-500 text-sm dark:text-gray-400">
                  <button type="button" onClick={() => handlChangeTab("home")} className={`${active === 'home' ? 'text-white bg-black': ''} px-5 py-1.5 font-medium text-gray-900`}>Home</button> 
                </li>
                <li className="text-gray-500 text-sm dark:text-gray-400">
                <button type="button" onClick={() => handlChangeTab("printed")} className={`${active === 'printed' ? 'text-white bg-black': ''} px-5 py-1.5 font-medium text-gray-900`}>Printed transactions</button> 
                </li>
                <li className="text-gray-500 text-sm dark:text-gray-400">
                <button type="button" onClick={() => handlChangeTab("requested")} className={`${active === 'requested' ? 'text-white bg-black': ''} px-5 py-1.5 font-medium text-gray-900`}>Requested transactions</button> 
                </li>
              </ul>
            </nav>
            {active === 'home' && (
               <>
               <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
                         <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                           Material
                         </th>
                         <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                           Requested (in units)
                         </th>
                         <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                           Printed (in units)
                         </th>
                         <th className="py-4 px-4 font-medium text-black dark:text-white">
                           Available stock (in units)
                         </th>
                         <th className="py-4 px-4 font-medium text-black dark:text-white">
                            Unit
                         </th>
                       </tr>
                     </thead>
                     <tbody>{listContent}</tbody>
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
               </>
            )}

            {active === 'printed' && (
              <>
            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
                  id="table-search-printed"
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
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Reference
                      </th>
                      <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                        Material
                      </th>
                      <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                        Service
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Date
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Operator
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Quantity
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Printed unit
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Total printed unit
                      </th>
                    </tr>
                  </thead>
                  <tbody>{printedListContent}</tbody>
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
            </>
            )}

            {active === 'requested' && (
                            <>
                            <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
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
                                  id="table-search-requested"
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
                                        Reference
                                      </th>
                                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                        Order Date
                                      </th>
                                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                        Operator
                                      </th>
                                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                        Quantity
                                      </th>
                                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                        Status
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
                            </>
              )}
            {/* {isEditModalOpen && (
              <OperatorStoreDetailsModal
                handleEditModalOpen={handleEditModalOpen}
                data={data}
              />
            )} */}
          </>
        );

}
