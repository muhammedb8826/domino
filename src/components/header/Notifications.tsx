import { getOrdersById, updateOrder } from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import { getSales } from "@/redux/features/saleSlice";
import Loader from "@/common/Loader";
import { useParams } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { StatusEditModal } from "../order/StatusEditModal";
import Breadcrumb from "../Breadcrumb";
import { getProducts } from "@/redux/features/product/productSlice";
import { getServices } from "@/redux/features/service/servicesSlice";
import { NotificationTable } from "./NotificationTable";
import toast from "react-hot-toast";
export const Notifications = () => {
  const { id } = useParams<{ id: string }>()
  const { user, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { singleOrder, isLoading } = useSelector(
    (state: RootState) => state.order
  );
  const { products } = useSelector((state: RootState) => state.product);
  const [active , setActive] = useState("proofReady");
  const { services } = useSelector((state: RootState) => state.service);
  const [formData, setFormData] = useState([]);
  const [proofReadyOrders, setProofReadyOrders] = useState([]);
  const [pendingApprovalOrders, setPendingApprovalOrders] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataId, setDataId] = useState("");
  const [statusValues, setStatusValues] = useState({ statusValue1: "", statusValue2: "" });
  const [showPopover, setShowPopover] = useState<number | null>(null);
  const [showPopover2, setShowPopover2] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverRef2 = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);
  const dispatch = useDispatch();


    const handleClickOutside = (event: MouseEvent) => {
    if (showPopover !== null && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setShowPopover(null);
    }
    if (showPopover2 !== null && popoverRef2.current && !popoverRef2.current.contains(event.target as Node)) {
      setShowPopover2(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopover, showPopover2]);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current || !dropdownOpen || dropdownRef.current.contains(target) || triggerRef.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (dropdownOpen && keyCode === 27) setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    dispatch(getSales());
    dispatch(getOrdersById(id)).then((res) => {
      if (res.payload) {
        const { orderItems } = res.payload;
        setProofReadyOrders(orderItems?.filter(item => item.status === "Rejected" || item.status === "Received"));
        setPendingApprovalOrders(orderItems?.filter(item => item.status === "Edited"));
      }
    });
    dispatch(getProducts());
    dispatch(getServices());
  }, [dispatch, id]);

  const handleAction = (index: number) => setShowPopover(prevIndex => (prevIndex === index ? null : index));

  const handlePendingApprovalAction = (index: number) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover2(index);
  };

  const handleUpdateProofReady = (id, status) => {
    const updatedOrderItems = proofReadyOrders.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setProofReadyOrders(updatedOrderItems);
    setFormData([...updatedOrderItems, ...pendingApprovalOrders]);
  };
  
  const handleUpdateStatus = (id, status) => {
    const updatedOrderItems = pendingApprovalOrders.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setPendingApprovalOrders(updatedOrderItems);
    setFormData([...updatedOrderItems, ...proofReadyOrders]);
  };
  
  const handleButtonClick = (newActiveState) => {
    setActive(newActiveState);
    dispatch(getOrdersById(id)).then((res) => {
      if (res.payload) {
        const { orderItems } = res.payload;
        setProofReadyOrders(orderItems?.filter((item) => item.status === "Rejected" || item.status === "Received"));
        setPendingApprovalOrders(orderItems?.filter((item) => item.status === "Edited"));
      }
    });
  };
  
  const handleSubmit = () => {
    const data = {
      id: singleOrder?.id,
      ...singleOrder,
      orderItems: formData,
    };
  
    dispatch(updateOrder(data)).then((res) => {
      if (res.payload) {
        console.log("res", res.payload);
        const { orderItems } = res.payload;
        setProofReadyOrders(orderItems?.filter((item) => item.status === "Rejected" || item.status === "Received"));
        setPendingApprovalOrders(orderItems?.filter((item) => item.status === "Edited"));
        const message = "Order status updated successfully";
        toast.success(message);
      } else {
        const message = "Something went wrong!";
        toast.error(message);
      }
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
      <div className="rounded-sm border border-stroke border-t-0 bg-white px-4 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <nav className="flex justify-between gap-4 items-center px-4">
          <ul className="list-reset py-4 rounded flex bg-white dark:bg-boxdark dark:text-white">
            <li className="text-gray-500 text-sm dark:text-gray-400">
              {isLoading ? <Loader /> : (
              <button
                type="button"
                onClick={() => handleButtonClick("proofReady")}
                className={`${active === "proofReady" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Proof Ready
              </button>
              )}
            </li>
            {isLoading ? <Loader /> : (
            <li className="text-gray-500 text-sm dark:text-gray-400">
              <button
                type="button"
                onClick={() => handleButtonClick("pending")}
                className={`${active === "pending" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Pending
              </button>
            </li>
            )}
          </ul>
          < button
            type="submit"
            onClick={handleSubmit}
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Save changes
          </button>
        </nav>
        {active === "proofReady" && (
        <NotificationTable
          title="Proof ready orders"
          orders={proofReadyOrders}
          handleAction={handleAction}
          showPopover={showPopover}
          handleModalOpen={handleUpdateProofReady}
          popoverRef={popoverRef}
          user={user}
          products={products}
          services={services}
          status1="Edited"
          status2="Rejected"
        />
      )}
      {active === "pending" && (
        <NotificationTable
          title="Pending approval orders"
          orders={pendingApprovalOrders}
          handleAction={handlePendingApprovalAction}
          showPopover={showPopover2}
          handleModalOpen={handleUpdateStatus}
          popoverRef={popoverRef2}
          user={user}
          products={products}
          services={services}
          status1={"Approved"}
          status2={"Rejected"}
        />
      )}
      </div>
    </>
  );
  
};
