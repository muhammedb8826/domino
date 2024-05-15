import { getOrdersById, updateOrder } from "@/redux/features/order/orderSlice";
import { RootState } from "@/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import { getSales } from "@/redux/features/saleSlice";
import Loader from "@/common/Loader";
import { useParams } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";
import { getProducts } from "@/redux/features/product/productSlice";
import { getServices } from "@/redux/features/service/servicesSlice";
import { NotificationTable } from "./NotificationTable";
import toast from "react-hot-toast";
import { getPayments } from "@/redux/features/paymentSlice";
export const Notifications = () => {
  const { id } = useParams<{ id: string }>()
  const { user, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { singleOrder, isLoading } = useSelector(
    (state: RootState) => state.order
  );
  const { payments } = useSelector((state) => state.payment);

  const { products } = useSelector((state: RootState) => state.product);
  const [active , setActive] = useState("proofReady");
  const { services } = useSelector((state: RootState) => state.service);
  const [formData, setFormData] = useState([]);
  const [proofReadyOrders, setProofReadyOrders] = useState([]);
  const [pendingApprovalOrders, setPendingApprovalOrders] = useState([]);
  const [printReadyOrders, setPrintReadyOrders] = useState([]);
  const [qualityControl, setQualityControl] = useState([]);
  const [delivery, setDelivery] = useState([]);
  const [showPopover, setShowPopover] = useState<number | null>(null);
  const [showPopover2, setShowPopover2] = useState<number | null>(null);
  const [showPopover3, setShowPopover3] = useState<number | null>(null);
  const [showPopover4, setShowPopover4] = useState<number | null>(null);
  const [showPopover5, setShowPopover5] = useState<number | null>(null);
  const [forcePayment, setForcePayment] = useState(true);
  const [totaTransaction, setTotalTransaction] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverRef2 = useRef<HTMLDivElement>(null);
  const popoverRef3 = useRef<HTMLDivElement>(null);
  const popoverRef4 = useRef<HTMLDivElement>(null);
  const popoverRef5 = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<any>(null);
  const dropdownRef = useRef<any>(null);
  const dispatch = useDispatch();


    const handleClickOutside = useCallback((event: MouseEvent) => {
    if (showPopover !== null && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
      setShowPopover(null);
    }
    if (showPopover2 !== null && popoverRef2.current && !popoverRef2.current.contains(event.target as Node)) {
      setShowPopover2(null);
    }
    if (showPopover3 !== null && popoverRef3.current && !popoverRef3.current.contains(event.target as Node)) {
      setShowPopover3(null);
    }
    if (showPopover4 !== null && popoverRef4.current && !popoverRef4.current.contains(event.target as Node)) {
      setShowPopover4(null);
    }
    if (showPopover5 !== null && popoverRef5.current && !popoverRef5.current.contains(event.target as Node)) {
      setShowPopover5(null);
    }
  }, [showPopover, showPopover2, showPopover3, showPopover4, showPopover5]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopover, showPopover2, handleClickOutside]);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdownRef.current || !dropdownOpen || dropdownRef.current.contains(target) || triggerRef.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (dropdownOpen && key === 'Escape') setDropdownOpen(false);
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
        setPrintReadyOrders(orderItems?.filter(item => item.status === "Approved"));
        setQualityControl(orderItems?.filter(item => item.status === "Printed"));
        setDelivery(orderItems?.filter(item => item.status === "Completed" || item.printed === true || item.adminApproval === true));
      }
    });
    dispatch(getPayments()).then((res)=>{
      if(res.payload){
        const findPayment = res.payload.find((payment) => payment.orderId === id)
        setForcePayment(findPayment.forcePayment)
        setTotalTransaction(findPayment.totaTransaction)
      }
    })
    dispatch(getProducts());
    dispatch(getServices());
  }, [dispatch, id]);

  const handleAction = (index: number) => setShowPopover(prevIndex => (prevIndex === index ? null : index));

  const handlePendingApprovalAction = (index: number) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover2(prevIndex => (prevIndex === index ? null : index));
  };

  const handlePrintReadyAction = (index: number) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover3(prevIndex => (prevIndex === index ? null : index));
  };

  const handleQualityControlAction = (index: number) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover4(prevIndex => (prevIndex === index ? null : index));
  };

  const handleDeliveryAction = (index: number) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover5(prevIndex => (prevIndex === index ? null : index));
  };

  const handleUpdateProofReady = (id, status, index) => {
    const updatedOrderItems = proofReadyOrders.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setProofReadyOrders(updatedOrderItems);
    setFormData([...updatedOrderItems, ...pendingApprovalOrders, ...printReadyOrders, ...qualityControl, ...delivery]);
    handleAction(index)
  };
  
  const handleUpdatePendingApproval = (id, status, index) => {
    if(!forcePayment){
    const updatedOrderItems = pendingApprovalOrders.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setPendingApprovalOrders(updatedOrderItems);
    setFormData([...updatedOrderItems, ...proofReadyOrders, ...printReadyOrders, ...qualityControl, ...delivery]);
    handlePendingApprovalAction(index)
    } else {
       if(status === "Approved" && totaTransaction < singleOrder?.grandTotal){
        const message = "Please complete payment first before approving the order";
        toast.error(message);
    }
    else {
      const updatedOrderItems = pendingApprovalOrders.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setPendingApprovalOrders(updatedOrderItems);
    setFormData([...updatedOrderItems, ...proofReadyOrders, ...printReadyOrders, ...qualityControl, ...delivery]);
    handlePendingApprovalAction(index)
    }
  }
  };

  const handleUpdatePrintReady = (id, status, index) =>{
    const updatedOrderItems = printReadyOrders.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setPrintReadyOrders(updatedOrderItems);
    setFormData([...updatedOrderItems, ...proofReadyOrders, ...pendingApprovalOrders, ...qualityControl, ...delivery]);
    handlePrintReadyAction(index)
  }

const handleUpdateQualityControl = (id, status, index) => {
  if(status === "Completed"){
 const updatedOrderItems = qualityControl.map((item) =>
      item.id === id ? { ...item, status: status, printed: true, adminApproval: true  } : item
    );
    setQualityControl(updatedOrderItems);
    setFormData([...updatedOrderItems, ...proofReadyOrders, ...pendingApprovalOrders, ...printReadyOrders, ...delivery]);
    handleQualityControlAction(index)
  }
  else {
    const updatedOrderItems = qualityControl.map((item) =>
      item.id === id ? { ...item, status: status, printed: false, adminApproval: false } : item
    );
    setQualityControl(updatedOrderItems);
    setFormData([...updatedOrderItems, ...proofReadyOrders, ...pendingApprovalOrders, ...printReadyOrders, ...delivery]);
    handleQualityControlAction(index)
  }
  };
  

  const handleUpdateDelivery = (id, status, index) => {
  const updatedOrderItems = delivery.map((item) =>
      item.id === id ? { ...item, status: status, completed: true } : item
    );
    setDelivery(updatedOrderItems);
    setFormData([...updatedOrderItems, ...proofReadyOrders, ...pendingApprovalOrders, ...printReadyOrders, ...qualityControl]);
    handleDeliveryAction(index)
  };

  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
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
        setPrintReadyOrders(orderItems?.filter((item) => item.status === "Approved"));
        setQualityControl(orderItems?.filter((item) => item.status === "Printed"));
        setDelivery(orderItems?.filter((item) => item.status === "Completed" || item.printed === true || item.adminApproval === true));
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
              <button
                type="button"
                onClick={() => handleButtonClick("proofReady")}
                className={`${active === "proofReady" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Proof Ready
              </button>
            </li>
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
            <li className="text-gray-500 text-sm dark:text-gray-400">
              <button
                type="button"
                onClick={() => handleButtonClick("printReady")}
                className={`${active === "printReady" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Print Ready
              </button>
            </li>
            <li className="text-gray-500 text-sm dark:text-gray-400">
              <button
                type="button"
                onClick={() => handleButtonClick("qualityControl")}
                className={`${active === "qualityControl" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Quality Control
              </button>
            </li>
            <li className="text-gray-500 text-sm dark:text-gray-400">
              <button
                type="button"
                onClick={() => handleButtonClick("delivery")}
                className={`${active === "delivery" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Delivery
              </button>
            </li>
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
          status1={{label: "Edit", value: "Edited"}}
          status2={{label: "Reject", value: "Rejected"}}
        />
      )}
      {active === "pending" && (
        <NotificationTable
          title="Pending approval orders"
          orders={pendingApprovalOrders}
          handleAction={handlePendingApprovalAction}
          showPopover={showPopover2}
          handleModalOpen={handleUpdatePendingApproval}
          popoverRef={popoverRef2}
          user={user}
          products={products}
          services={services}
          status1={{label: "Approve", value: "Approved"}}
          status2={{label: "Reject", value: "Rejected"}}
        />
      )}
      {active === "printReady" && (
        <NotificationTable
          title="Print ready orders"
          orders={printReadyOrders}
          handleAction={handlePrintReadyAction}
          showPopover={showPopover3}
          handleModalOpen={handleUpdatePrintReady}
          popoverRef={popoverRef3}
          user={user}
          products={products}
          services={services}
          status1={{label: "print", value: "Printed"}}
          status2={{label: "Reject", value: "Edited"}}
        />
      )}
      {active === "qualityControl" && (
        <NotificationTable
          title="Quality control and approval"
          orders={qualityControl}
          handleAction={handleQualityControlAction}
          showPopover={showPopover4}
          handleModalOpen={handleUpdateQualityControl}
          popoverRef={popoverRef4}
          user={user}
          products={products}
          services={services}
          status1={{label: "Approve", value: "Completed"}}
          status2={{label: "Reject", value: "Approved"}}
        />
      )}
      {active === "delivery" && (
        <NotificationTable
          title="Delivery and shipping"
          orders={delivery}
          handleAction={handleDeliveryAction}
          showPopover={showPopover5}
          handleModalOpen={handleUpdateDelivery}
          popoverRef={popoverRef5}
          user={user}
          products={products}
          services={services}
          status1={{label: "Deliver", value: "Delivered"}}
          status2={{label: "", value: ""}}
        />
      )}
      </div>
    </>
  );
  
};
