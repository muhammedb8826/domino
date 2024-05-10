import { getOrdersById } from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import { getSales} from "@/redux/features/saleSlice";
import Loader from "@/common/Loader";
import { useParams } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { StatusEditModal } from "../order/StatusEditModal";
import Breadcrumb from "../Breadcrumb";
import { getProducts } from "@/redux/features/product/productSlice";
import { getServices } from "@/redux/features/service/servicesSlice";
export const Notifications = () => {
  const { id } = useParams<{ id: string }>()
  const { user, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { singleOrder, isLoading } = useSelector(
    (state: RootState) => state.order
  );
  const { products } = useSelector((state: RootState) => state.product);
  const { services } = useSelector((state: RootState) => state.service);
  const [formData, setFormData] = useState(singleOrder?.orderItems);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSales());
    dispatch(getOrdersById(id)).then((res) => {
      if(res.payload) {
        setFormData(res.payload.orderItems);
      }
    });   
    dispatch(getProducts());
    dispatch(getServices());
  }, [dispatch, id]);


  const [showPopover, setShowPopover] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState(0);
  const triggerRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(null);
      }
    };

    if (showPopover !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

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


  const popoverRef = useRef<HTMLDivElement>(null);

  const handleModalOpen = (index) => {
    setModalOpen((prev) => !prev);
    setDataIndex(index);
  };

  const handleChaneStatus = (index, status) => {
   setFormData((prev) => {
      const updatedOrderItems = prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            status: status,
          };
        }
        return item;
      });
      return updatedOrderItems;
    });
  };


  if (error) {
    return <ErroPage error={error} />;
  }

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Breadcrumb pageName="Notifications" />
      <div className="rounded-sm border border-stroke border-t-0 bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div>
            <button
              type="button"
              className="text-black dark:text-white w-full py-2 px-4 border-t border-b border-[#eee] mb-4 font-semibold flex items-center gap-4"
            >
              Orders Series | {singleOrder?.series}
            </button>
            <div className="max-w-full px-4">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      No
                    </th>
                    <th
                      className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                    >
                      Product
                    </th>
                    <th
                      className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                    >
                      Services
                    </th>
                    <th
                      className="py-4 px-4 font-medium text-black dark:text-white"
                    >
                      Width
                    </th>
                    <th
                      className="py-4 px-4 font-medium text-black dark:text-white"
                    >
                      Height
                    </th>
                    <th
                      className="py-4 px-4 font-medium text-black dark:text-white"
                    >
                      Quantity
                    </th>
                    <th
                      className="py-4 px-4 font-medium text-black dark:text-white"
                    >
                      Status
                    </th>
                    <th
                      className="py-4 px-4 font-medium text-black dark:text-white"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No data found
                      </td>
                    </tr>
                  )}
                  {formData && formData.length > 0 && formData.map((data, index) => {
                      const product = data.productId && products?.find((product) => product.id === data.productId);
                      const service = data.serviceId && services?.find((service) => service.id === data.serviceId);
                      return (
                        <tr
                          key={index}
                        >
                          <td className="border-b text-graydark border-[#eee] py-2 px-4 dark:border-strokedark">
                            {index + 1}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {product?.name}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {service?.name}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {data.width}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {data.height}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {data.quantity}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            {data.status}
                          </td>
                          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                            <button
                              onClick={() => handleAction(index)}
                              title="action"
                              type="button"
                              className="text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                              <CiMenuKebab />
                            </button>
                            {showPopover === index && (
                              <div
                                ref={popoverRef}
                                className="absolute z-40 right-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                              >
                                <ul className="py-2 text-sm text-gray-700">
                                  {data.adminApproval === false && (
                                    <li
                                      className={`${user?.email !== "admin@domino.com" &&
                                        user?.roles !== "graphic-designer"
                                        ? "hidden"
                                        : ""
                                        }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => handleModalOpen(index)}
                                        className="flex items-center w-full gap-2 px-4 py-2 font-medium text-primary dark:text-primary hover:underline hover:bg-gray-100"
                                      >
                                        <FaRegEdit />
                                        Edit
                                      </button>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <StatusEditModal
          handleModalOpen={handleModalOpen}
          dataIndex={dataIndex}
          data={singleOrder}
          handleChaneStatus={handleChaneStatus}
          statusValue1="Edited"
          statusValue2="Rejected"
        />
      )}
    </>
  );
};
