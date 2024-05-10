import { GoBack } from "../common/GoBack";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import {getOrdersById,updateOrder} from "../../redux/features/order/orderSlice";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Datepicker } from "flowbite-react";
import CustomerSearchInput from "../customer/CustomerSearchInput";
import { FaChevronDown, FaChevronUp, FaRegEdit } from "react-icons/fa";
import { CiMenuKebab, CiSettings } from "react-icons/ci";
import Select from "react-select";
import { getServices } from "../../redux/features/service/servicesSlice";
import { getprice } from "../../redux/features/price/pricingSlice";
import { MdDelete, MdOutlinePayment } from "react-icons/md";
import { StatusEditModal } from "./StatusEditModal";
import { getDiscounts } from "@/redux/features/dicount/dicountSlice";
import { SalesPartnerSearchInput } from "../commission/SalesPartnerSearchInput";
import {
  getCommissions,
  updateCommission,
} from "@/redux/features/commission/commissionSlice";
import Swal from "sweetalert2";
import {getCustomers} from "@/redux/features/customer/customerSlice";
import { RootState } from "@/redux/store";
import { getProducts } from "@/redux/features/product/productSlice";
import { getJobOrdersProducts } from "@/redux/features/jobOrderProductsSlice";
import { getPayments, updatePayment } from "@/redux/features/paymentSlice";
import { getSalesPartners } from "@/redux/features/salesPartnersSlice";
import { IoMdClose } from "react-icons/io";
import Loader from "@/common/Loader";

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);

interface CustomerType {
  phone: string;
  firstName: string;
  email: string;
}

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { singleOrder, isLoading, error } = useSelector(
    (state) => state.order
  );
  const { prices } = useSelector((state) => state.price);
  const { services } = useSelector((state) => state.service);
  const { jobOrderProducts } = useSelector((state) => state.jobOrderProduct);
  const { products } = useSelector((state) => state.product);
  const { payments } = useSelector((state) => state.payment);
  const { customers } = useSelector((state) => state.customer);
  const { discounts } = useSelector((state) => state.discount);
  const { user } = useSelector((state: RootState) => state.auth);
  const { salesPartners } = useSelector((state) => state.salesPartner);
  const { commissions } = useSelector((state) => state.commission);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersById(id))
    .then((res) => {
      if (res.payload) {
        const order = res.payload;
        setOrderInfo({
          series: order.series,
          date: order.date,
          deliveryDate: order.deliveryDate,
          orderSource: order.orderSource,
          description: order.description,
          customerId: order.customerId,
          salesPartnerId: order.salesPartnerId,
          status: order.status,
        });
        setFormData(order.orderItems);
        setTotalBirr(order.totalBirr);
        setTotalQuantity(order.totalQuantity);
        setFileName(order.fileNames);
        setGrandTotal(order.grandTotal);
        setTax(order.tax);
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
    });
    dispatch(getprice());
    dispatch(getServices());
    dispatch(getDiscounts());
    dispatch(getCommissions()).then((res)=>{
      if(res.payload){
        const findCommission = res.payload.find((commission) => commission.orderId === id)
        setCommission(findCommission.transactions)
        setTotalCommission(findCommission.totalCommission)
      }
    })
    dispatch(getCustomers());
    dispatch(getProducts());
    dispatch(getJobOrdersProducts());
    dispatch(getSalesPartners());
    dispatch(getPayments()).then((res)=>{
      if(res.payload){
        const findPayment = res.payload.find((payment) => payment.orderId === id)
        setPayment(findPayment.transactions)
        setTotalTransaction(findPayment.totaTransaction),
        setRemainingAmount(findPayment.remainingAmount)
      }
    })
  }, [dispatch, id]);

  const [fileName, setFileName] = useState([]);
  const [tooltipMessages, setTooltipMessages] = useState([]);

  const [icons, setIcons] = useState([]);
  const inputRefs = useRef(Array(fileName.length).fill(null));
  const [invisibleTooltip, setInvisibleTooltip] = useState(false);

  const handleMouseEnter = () => {
    setInvisibleTooltip(true);
  };

  const handleMouseLeave = () => {
    setInvisibleTooltip(false);
  };
  useEffect(() => {
    setIcons(Array(fileName.length).fill("default"));
    setTooltipMessages(Array(fileName.length).fill("Copy to clipboard"));
  }, [fileName]);

  const copyToClipboard = (index) => {
    inputRefs.current[index].select();
    try {
      navigator.clipboard.writeText(fileName[index]);
      setTooltipMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = "Copied!";
        return newMessages;
      });
      setIcons((prevIcons) => {
        const newIcons = [...prevIcons];
        newIcons[index] = "success";
        return newIcons;
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
      setTooltipMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = "Copy failed";
        return newMessages;
      });
    }

    setTimeout(() => {
      setTooltipMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[index] = "Copy to clipboard";
        return newMessages;
      });
      setIcons((prevIcons) => {
        const newIcons = [...prevIcons];
        newIcons[index] = "default";
        return newIcons;
      });
    }, 1500);
  };


  const [showPopover, setShowPopover] = useState<number | null>(null);
  const [showPopover2, setShowPopover2] = useState<number | null>(null);

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


  const popoverRef = useRef<HTMLDivElement>(null);

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

  const handleAction = (index: number) => {
    setShowPopover((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleAction2 = (index: number) => {
    setDropdownOpen(!dropdownOpen);
    setShowPopover2(index);
  };

  const [orderInfo, setOrderInfo] = useState({
    series: "SAL-ORD-YYYY-",
    date: formattedDate,
    deliveryDate: formattedDate,
    orderSource: "",
    description: "",
    customerId: "",
    salesPartnerId: "",
    status: "received",
  });

console.log(singleOrder);


  const [formData, setFormData] = useState([
    {
      productId: "",
      serviceId: "",
      priceId: "",
      unitPrice: null,
      width: "",
      height: "",
      quantity: "",
      unit: 0,
      discount: 0,
      level: 0,
      total: 0,
      isDiscounted: false,
      status: "received",
      note: "",
      printed: false,
      adminApproval: false,
      completed: false
    }
  ]);

  const [payment, setPayment] = useState([
    {
      date: formattedDate,
      paymentMethod: "cash",
      reference: "",
      amount: 0,
      status: "pending",
      description: "",
    }
  ]);
  const [commission, setCommission] = useState([
    {

      date: formattedDate,
      amount: 0,
      percent: 0,
      description: "",
      status: "pending",
    }
  ]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalBirr, setTotalBirr] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [userInputDiscount, setUserInputDiscount] = useState(0);
  const [totalCommission, setTotalCommission] = useState(null);
  const [collapseDisount, setCollapseDiscount] = useState(false);
  const [totaTransaction, setTotalTransaction] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  const handleCustomerInfo = (customer: CustomerType) => {
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      customerId: customer.id,
    }));
  };

  const handleSalesPerson = (commission: CustomerType) => {
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      salesPartnerId: commission.id,
    }));
  };

  const handleFormChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPayment((prev) => {
      const updatedData = prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      });
      const totalTransaction = updatedData.reduce(
        (acc, c) => acc + Number(c.amount || 0),
        0
      );
      setTotalTransaction(totalTransaction);
      setRemainingAmount(grandTotal - totalTransaction);
      return updatedData;
    });
  };

  const handlePaymentMethod = (index, e) => {
    setPayment((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        paymentMethod: e.target.value,
      };
      return updatedData;
    });
  };

  const handlePayPayment = (index) => {
    const updatedTransactionsStatus = payment.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          status: "paid",
        };
      }
      return item; // Return unchanged items
    });
    setPayment(updatedTransactionsStatus);
    setDropdownOpen(!dropdownOpen)
  };

  const handlePayCommission = (index: number) => {
    const updatedTransactionsStatus = commission.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          status: "paid",
        };
      }
      return item; // Return unchanged items
    });
    setCommission(updatedTransactionsStatus);
    setDropdownOpen(!dropdownOpen)
  };

  const handleAddPaymentRow = () => {
    setPayment((prev) => [
      ...prev,
      {
        date: formattedDate,
        paymentMethod: "cash",
        reference: "",
        amount: 0,
        status: "pending",
        description: "",
      }
    ])
  };


  const handleCancelPayment = (index: number) => {
    const updatedTransactions = [...payment];
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The transaction has been deleted.",
          icon: "success",
        }).then(() => {
          const filteredData = updatedTransactions.filter(
            (_, i) => i !== index
          );
          // dispatch(updateCustomer({id, data: filteredData}));
          setPayment(filteredData);
        });
      }
    });
  };

  const handleCollapseDiscount = () => {
    setCollapseDiscount((prev) => !prev);
  };

  const handleModalOpen = (index) => {
    setModalOpen((prev) => !prev);
    setDataIndex(index);
  };


  const handleAddRow = () => {
    setFormData((prevFormData) => [
      ...prevFormData,
      {
        productId: "",
        serviceId: "",
        priceId: "",
        unitPrice: null,
        width: "",
        height: "",
        quantity: "",
        unit: 0,
        discount: 0,
        level: 0,
        total: 0,
        isDiscounted: false,
        status: "received",
        note: "",
        printed: false,
        adminApproval: false,
        completed: false
      },
    ]);
    setCommission((prev) => [
      ...prev,
      {
        date: formattedDate,
        amount: 0,
        percent: 0,
        description: "",
        status: "pending",
      }
    ]);
  };


  useEffect(() => {
    const totalBirr = formData.reduce((acc, c) => acc + c.total || 0, 0);
    const totalQuantity = formData.reduce((acc, c) => acc + Number(c.quantity) || 0, 0);
    setTotalBirr(totalBirr);
    setTotalQuantity(totalQuantity);
    setTax(totalBirr * 0.15);
    const granTotal = totalBirr + totalBirr * 0.15;
    setGrandTotal(granTotal);

    if (commission.length > 0) {
      const totalCommission = commission.reduce((acc, c) => acc + c.amount || 0, 0);
      setTotalCommission(totalCommission);
    }

    const combination = formData.map((item) => {
      const customer = customers.find((customer) => customer.id === orderInfo.customerId);
      const product = products.find((product) => product.id === item.productId);
      if (!customer || !product) return "";
      return `${customer?.firstName}-${product?.name}-${item.width}x${item.height}`;
    });
    setFileName(combination);
  }, [formData, orderInfo.customerId, customers, products, commission]);

  // customer and order info handling
  const handleOrderInfo = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      [name]: value,
    }));
  };

  const handleCancel = (index) => {
    const updatedFormData = [...formData];
    const filteredData = updatedFormData.filter((_, i) => i !== index);
    setFormData(filteredData);
    const updatedCommission = [...commission];
    const filteredCommission = updatedCommission.filter((_, i) => i !== index);
    setCommission(filteredCommission);
  };

  //  commission handling

  const handleDatePickerChange = (date: Date) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      date: formattedDate,
    }));
  };

  const handleDeliveryDatePickerChange = (date: Date) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      deliveryDate: formattedDate,
    }));
  };

  const productOptions = jobOrderProducts?.map((item) => {
    const product = products?.find((product) => product.id === item.productId);
    const value = item.product?.id || (product ? product.id : null);
    const label = item.product?.name || (product ? product.name : null);
    return {
      value,
      label,
    };
  });

  const serviceOptions = services?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  useEffect(() => {
    const totalBirr = formData.reduce((acc, c) => acc + c.total || 0, 0);
    const totalQuantity = formData.reduce((acc, c) => acc + Number(c.quantity) || 0, 0);
    setTotalBirr(totalBirr);
    setTotalQuantity(totalQuantity)
    const granTotal = totalBirr + totalBirr * 0.15;
    setGrandTotal(granTotal);

    const combination = formData.map((item) => {
      const customer = customers.find((customer) => customer.id === orderInfo.customerId);
      const product = products.find((product) => product.id === item.productId);
      if (!customer || !product) return "";
      return `${customer?.firstName}-${product?.name}-${item.width}x${item.height}`;
    });
    setFileName(combination);
  }, [formData, orderInfo.customerId, customers, products]);


  const handleInputChanges = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      return prevFormData.map((item, i) => {
        if (i !== index) return item; // If not the target item, return as is

        // Create a new object with updated values for the target item
        const updatedItem = {
          ...item,
          [name]: value,
          unitPrice: calculateUnitPrice(item),
          unit: (parseFloat(item.width) * parseFloat(item.height)) * parseFloat(item.quantity) || 0,
          // Rest of the logic for discount calculation
        };

        // Recalculate discount if the checkbox is checked
        if (updatedItem.isDiscounted) {
          const unit = updatedItem.unit;

          // Find the appropriate discount data based on the unit's range
          const discountData = discounts.find(discount => {
            const minSquare = parseFloat(discount.minumumMeterSquare);
            const nextDiscount = discounts.find(d => parseFloat(d.minumumMeterSquare) > minSquare);
            const maxSquare = nextDiscount ? parseFloat(nextDiscount.minumumMeterSquare) : Infinity;
            return unit >= minSquare && unit < maxSquare;
          });

          // If discount data is found, apply the discount
          if (discountData) {
            updatedItem.level = discountData.level;
            const discountPercentage = parseFloat(discountData.discountPercentage) / 100;
            updatedItem.discount = discountPercentage * updatedItem.unitPrice;
            updatedItem.total = updatedItem.unitPrice - updatedItem.discount;
          } else {
            // If no discount data is found, reset level and discount
            updatedItem.level = 0;
            updatedItem.discount = 0;
            updatedItem.total = updatedItem.unitPrice;
          }
        } else {
          // If checkbox is not checked, reset level, discount, and total
          updatedItem.level = 0;
          updatedItem.discount = 0;
          updatedItem.total = updatedItem.unitPrice;
        }

        return updatedItem;
      });
    });
  };

  const handleDiscountChange = (index, e) => {
    const { checked } = e.target;
    setFormData((prevFormData) => {
      const updatedData = [...prevFormData];
      updatedData[index] = {
        ...updatedData[index],
        isDiscounted: checked,
      };

      // Calculate discount if the checkbox is checked
      if (checked) {
        const unit = updatedData[index].unit;

        // Find the appropriate discount data based on the unit's range
        const discountData = discounts.find(discount => {
          const minSquare = parseFloat(discount.minumumMeterSquare);
          const nextDiscount = discounts.find(d => parseFloat(d.minumumMeterSquare) > minSquare);
          const maxSquare = nextDiscount ? parseFloat(nextDiscount.minumumMeterSquare) : Infinity;
          return unit >= minSquare && unit < maxSquare;
        });

        // If discount data is found, apply the discount
        if (discountData) {
          updatedData[index].level = discountData.level;
          const discountPercentage = parseFloat(discountData.discountPercentage) / 100;
          updatedData[index].discount = discountPercentage * updatedData[index].unitPrice;
          updatedData[index].total = updatedData[index].unitPrice - updatedData[index].discount;
        } else {
          // If no discount data is found, reset level and discount
          updatedData[index].level = 0;
          updatedData[index].discount = 0;
          updatedData[index].total = updatedData[index].unitPrice;
        }
      } else {
        // If checkbox is not checked, reset level, discount, and total
        updatedData[index].level = 0;
        updatedData[index].discount = 0;
        updatedData[index].total = updatedData[index].unitPrice;
      }

      return updatedData;
    });
  };


  const calculateUnitPrice = (formDataItem) => {
    const { width, height, quantity, priceId, } = formDataItem;
    const price = prices?.find((price) => price.id === priceId.toString());
    if (width && height && quantity && price) {
      return ((parseFloat(width) * parseFloat(height)) * parseFloat(quantity)) * parseFloat(price.unitPrice);
    }
    return null;
  };

  const findSellingPrice = (productId, serviceId) => {
    const price = prices.find(
      (price) => price.productId === productId && price.serviceId === serviceId
    );
    return price ? price.id : "";
  };

  const handleProductSelect = (selectedOption, index) => {
    const { value } = selectedOption;
    const serviceId = formData[index].serviceId;
    const priceId = findSellingPrice(value, serviceId);

    setFormData((prevFormData) => {
      return prevFormData.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            productId: value,
            priceId: priceId?.toString(),
            unitPrice: calculateUnitPrice({
              ...item,
              productId: value,
              priceId: priceId?.toString(),
            }),
          };
        }
        return item;
      });
    });
  };

  const handleServiceSelect = (selectedOption, index) => {
    const { value } = selectedOption;
    const productId = formData[index].productId;
    const priceId = findSellingPrice(productId, value);

    setFormData((prevFormData) => {
      return prevFormData.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            serviceId: value,
            priceId: priceId?.toString(),
            unitPrice: calculateUnitPrice({
              ...item,
              serviceId: value,
              priceId: priceId?.toString(),
            }),
          };
        }
        return item;
      });
    });
  };

  const handleCommissionChange = (index, e) => {
    const { name, value } = e.target;
    setCommission((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        [name]: value,
      };
      return updatedData;
    });

    const percent = parseFloat(value); // Parse string to float
    if (!isNaN(percent)) { // Check if parsing was successful
      const amount = (percent / 100) * (formData[index]?.unitPrice || 0); // Check formData[index] existence and unitPrice validity
      const updatedCommission = [...commission];
      updatedCommission[index] = {
        ...updatedCommission[index],
        percent,
        amount,
      };
      setCommission(updatedCommission);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInfo.customerId) {
      const message = "Please select a customer";
      toast.error(message);
      return;
    }

    const orderData = {
      ...orderInfo,
      orderItems: formData,
      totalBirr,
      tax,
      fileNames: fileName,
      totalQuantity,
      grandTotal,
      id: id,
    };

    dispatch(updateOrder(orderData)).then((res) => {
      if (res.payload) {
        const message = "Order updated successfully";
        toast.success(message);
      }
    });

    const findPayment = payments?.find((payment) => payment.orderId === id);
    const findCommission = commissions?.find((commission) => commission.orderId === id);

    const paymentData = {
      ...findPayment,
      transactions: payment
    };

    dispatch(updatePayment(paymentData)).then((res) => {
      if (res.payload) {
        setPayment(res.payload.transactions);
      }
    });
    setGrandTotal(grandTotal);
    const commissionData = {
      ...findCommission,
      transactions: commission,
    }
    dispatch(updateCommission(commissionData)).then((res) => {
      if (res.payload) {
        setCommission(res.payload.transactions);
      }
    });
  };

  const [active, setActive] = useState("order");
  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };

  if (error) {
    return <ErroPage error={error} />;
  }

  return isLoading ? (<Loader />) : (
    <>
      <section className="max-w-[1250px] mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 mb-10">
        <GoBack goback="/dashboard" />
        <h2 className="px-4 text-title-md2 font-semibold text-black dark:text-white">
          Order Details
        </h2>
        <form onSubmit={handleSubmit}>
        <nav className="flex justify-between gap-4 items-center px-4">
          <ul className="list-reset py-4 rounded flex bg-white dark:bg-boxdark dark:text-white">
            <li className="text-gray-500 text-sm dark:text-gray-400">
              <button
                type="button"
                onClick={() => handleButtonClick("order")}
                className={`${active === "order" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Order
              </button>
            </li>
            <li className="text-gray-500 text-sm dark:text-gray-400">
              <button
                type="button"
                onClick={() => handleButtonClick("payment")}
                className={`${active === "payment" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Payment
              </button>
            </li>
            <li className="text-gray-500 text-sm dark:text-gray-400">
              <button
                type="button"
                onClick={() => handleButtonClick("commission")}
                className={`${active === "commission" ? "text-white bg-black" : ""
                  } px-5 py-1.5 font-medium text-graydark`}
              >
                Commission
              </button>
            </li>
          </ul>
          <button
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
           Update
          </button>
        </nav>
          {active === "order" && (
            <>
              <div className="grid sm:grid-cols-3 sm:gap-6 mb-4 p-4">
                <div className="w-full">
                  <label
                    htmlFor="series"
                    className="mb-3 block text-black dark:text-white"
                  >
                    Series
                  </label>
                  <input
                    type="text"
                    name="series"
                    value={singleOrder?.series}
                    readOnly
                    id="series"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="date"
                    className="mb-3 block text-black dark:text-white"
                  >
                    Date
                  </label>
                  <Datepicker
                    title="date"
                    onSelectedDateChanged={handleDatePickerChange}
                    style={{
                      width: '100%',
                      borderRadius: '3px',
                      borderWidth: '1px',
                      borderColor: '#ccc',
                      backgroundColor: 'transparent',
                      paddingTop: '0.6rem',
                      paddingBottom: '0.6rem',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      fontWeight: '500', // equivalent to font-medium
                      outline: 'none',
                      transition: 'border 0.3s',
                      '&:focus': {
                        borderColor: 'primary',
                      },
                      '&:active': {
                        borderColor: 'primary',
                      },
                      '&:disabled': {
                        cursor: 'default',
                        // backgroundColor: 'whiter',
                        borderColor: '#3d4d60', // assuming this is a valid Tailwind class
                        backgroundColor: '#1d2a39', // assuming this is a valid Tailwind class
                        '&:focus': {
                          borderColor: 'primary',
                        },
                      },
                      '&:disabled:focus': {
                        borderColor: 'primary',
                      },
                    }}
                    value={orderInfo.date}
                  />
                </div>
                <div className="w-full relative">
                  <CustomerSearchInput
                    handleCustomerInfo={handleCustomerInfo}
                    value={customers.find((customer) => customer.id === orderInfo.customerId)?.firstName}
                  />
                </div>
                <div>
                  <label
                    htmlFor="orderSource"
                    className="mb-3 block text-black dark:text-white"
                  >
                    Order source
                  </label>
                  <select
                    defaultValue="telegram"
                    name="orderSource"
                    onChange={handleOrderInfo}
                    value={orderInfo.orderSource}
                    id="orderSource"
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  >
                    <option value="">Select order source</option>
                    <option value="telegram">Telegram</option>
                    <option value="phone">Phone</option>
                    <option value="In person">In person</option>
                    <option value="whatsapp">Whatsapp</option>
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="deliveryDate"
                    className="mb-3 block text-black dark:text-white"
                  >
                    Delivery date
                  </label>
                  <Datepicker
                    title="Delivery date"
                    onSelectedDateChanged={handleDeliveryDatePickerChange}
                    value={orderInfo.deliveryDate}
                    style={{
                      width: '100%',
                      borderRadius: '3px',
                      borderWidth: '1px',
                      borderColor: '#ccc',
                      backgroundColor: 'transparent',
                      paddingTop: '0.6rem',
                      paddingBottom: '0.6rem',
                      paddingLeft: '2.5rem',
                      paddingRight: '1rem',
                      fontWeight: '500', // equivalent to font-medium
                      outline: 'none',
                      transition: 'border 0.3s',
                      '&:focus': {
                        borderColor: 'primary',
                      },
                      '&:active': {
                        borderColor: 'primary',
                      },
                      '&:disabled': {
                        cursor: 'default',
                        // backgroundColor: 'whiter',
                        borderColor: '#3d4d60', // assuming this is a valid Tailwind class
                        backgroundColor: '#1d2a39', // assuming this is a valid Tailwind class
                        '&:focus': {
                          borderColor: 'primary',
                        },
                      },
                      '&:disabled:focus': {
                        borderColor: 'primary',
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="text-black dark:text-white w-full py-2 px-4 border-t border-b border-[#eee] mb-4 font-semibold flex items-center gap-4">
                  Orders List{" "}
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
                          className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white"
                        >
                          Amount
                        </th>
                        <th
                          className="py-4 px-4 font-medium text-black dark:text-white"
                        >
                          Unit
                        </th>
                        <th
                          className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                        >
                          Discount
                        </th>
                        <th
                          className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white"
                        >
                          Total
                        </th>
                        <th
                          className="py-4 px-4 font-medium text-black dark:text-white"
                        >
                          Status
                        </th>
                        <th
                          className="py-4 px-4 font-medium text-black dark:text-white"
                        >
                          {/* Action */}
                          <span className="font-semibold flex justify-center items-center">
                            <CiSettings className="text-xl font-bold" />
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData && formData.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center">
                            No data found
                          </td>
                        </tr>
                      )}
                      {formData &&
                        formData.map((data, index) => (
                          <tr
                            key={index}
                          >
                            <td className="border-b text-graydark border-[#eee] py-2 px-4 dark:border-strokedark">
                              {index + 1}
                            </td>
                            <td
                              className="font-medium text-graydark whitespace-nowrap dark:text-white"
                            >
                              <Select
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    border: "none",
                                    borderColor: state.isFocused ? "grey" : "none",
                                  }),
                                }}
                                options={productOptions}
                                onChange={(selectedOption) =>
                                  handleProductSelect(selectedOption, index)
                                }
                                value={productOptions.find(
                                  (option) => option.value === data.productId
                                )}
                                className="w-full"
                                required
                              />
                            </td>
                            <td
                              className="font-medium text-graydark whitespace-nowrap dark:text-white"
                            >
                              <Select
                                styles={{
                                  control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    border: "none",
                                    borderColor: state.isFocused ? "grey" : "none",
                                  }),
                                }}
                                options={serviceOptions}
                                onChange={(selectedOption) =>
                                  handleServiceSelect(selectedOption, index)
                                }
                                value={serviceOptions.find((option) => option.value === data.serviceId)}
                                required
                              />
                            </td>
                            <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                              <input
                                title="width"
                                type="number"
                                name="width"
                                id="width"
                                onChange={(e) => handleInputChanges(index, e)}
                                value={data.width}
                                className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                placeholder="0"
                                required
                                min={0}
                              />
                            </td>
                            <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                              <input
                                title="height"
                                type="number"
                                name="height"
                                id="height"
                                onChange={(e) => handleInputChanges(index, e)}
                                value={data.height}
                                className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                placeholder="0"
                                required
                                min={0}
                              />
                            </td>
                            <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                              <input
                                title="quantity"
                                type="number"
                                name="quantity"
                                id="quantity"
                                onChange={(e) => handleInputChanges(index, e)}
                                value={data.quantity}
                                className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                placeholder="0"
                                required
                                min={0}
                              />
                            </td>
                            <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                              {data.unitPrice}
                            </td>
                            <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                              {data.unit}
                            </td>
                            <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                              <div className="flex items-center gap-2 relative">
                                <span className="flex-1 px-2">
                                  {data.discount}
                                </span>
                                {data.discount > 0 ? (
                                  <sup className="absolute right-0 -top-2 text-black ">
                                    Level {data.level}
                                  </sup>
                                ) : null}
                                <label
                                  key={index}
                                  className="inline-flex items-center cursor-pointer w-1/4"
                                  htmlFor={`isDiscounted-${index}`}
                                >
                                  <input
                                    onChange={(e) => handleDiscountChange(index, e)}
                                    type="checkbox"
                                    name="isDiscounted"
                                    id={`isDiscounted-${index}`}
                                    checked={data.isDiscounted}
                                    className="sr-only peer"
                                  />
                                  <div className="relative w-8 h-4 bg-bodydark1 peer-focus:outline-none rounded-full peer dark:bg-graydark peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:start-[2px] after:bg-white after:border-gray-3 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-graydark peer-checked:bg-primary"></div>
                                </label>
                              </div>
                            </td>
                            <td className="px-4 py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                              {data.total}
                            </td>
                            <td className="px-4 py-2 border border-[#eee] dark:border-strokedark">
                              {singleOrder && (
                                <div
                                  onMouseEnter={handleMouseEnter}
                                  onMouseLeave={handleMouseLeave}
                                  className="flex items-center justify-center w-full relative"
                                >
                                  {data.status ===
                                    "received" && (
                                      <span className="bg-primary text-white text-xs font-medium  px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                        {data.status}
                                      </span>
                                    )}
                                  {data.status ===
                                    "Edited" && (
                                      <span className="bg-warning text-white text-xs font-medium px-2.5 py-0.5 rounded">
                                        {data.status}
                                      </span>
                                    )}
                                  {data.status ===
                                    "Rejected" && (
                                      <span className="bg-danger text-white text-xs font-medium px-2.5 py-0.5 rounded dark:danger dark:text-white">
                                        {data.status}
                                      </span>
                                    )}
                                  {data.status ===
                                    "Approved" && (
                                      <span className="bg-success text-white text-xs font-medium px-2.5 py-0.5 rounded dark:bg-success dark:text-white">
                                        {data.status}
                                      </span>
                                    )}
                                  {data.status ===
                                    "Printed" && (
                                      <span className="text-white bg-gradient-to-br from-danger to-warning hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {data.status}
                                      </span>
                                    )}
                                  {data.status ===
                                    "Paid" && (
                                      <span className="text-white bg-blend-hue hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-100 dark:bg-sky-400 dark:hover:bg-sky-500 dark:focus:ring-sky-600 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {data.status}
                                      </span>
                                    )}
                                  {data.status ===
                                    "Delivered" && (
                                      <span className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                        {data.status}
                                      </span>
                                    )}
                                  {invisibleTooltip && ( // Show tooltip only if visibleTooltip state is true
                                    <>
                                      {data.note !== "" ?
                                        (
                                          <div
                                            role="tooltip"
                                            className="absolute z-10 inline-block p-1 text-xs font-medium text-gray-100 bg-gray-800 border border-gray-300 rounded-lg shadow-sm tooltip"
                                          >
                                            {data.note}
                                            <div
                                              className="tooltip-arrow"
                                              data-popper-arrow
                                            ></div>
                                          </div>
                                        ) : null}
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="border border-[#eee] dark:border-strokedark">
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
                                    <li
                                      className={`${user?.email !== "admin@domino.com" &&
                                        user?.roles !== "reception"
                                        ? "hidden"
                                        : ""
                                        }`}
                                    >
                                      <button
                                        onClick={() => handleCancel(index)}
                                        type="button"
                                        className="text-left text-danger flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                                      >
                                        <MdDelete /> Delete
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="py-4 flex items-center justify-between">
                    <button
                      onClick={handleAddRow}
                      type="button"
                      className="flex items-center justify-center rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      Add row
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>


                <div className="flex justify-between pt-4 px-4">
                  <strong className="text-graydark">
                    Totals
                  </strong>
                  <div className="text-graydark">
                    <p className="flex gap-4 justify-between">
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Total quantity
                      </span>
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {totalQuantity}
                      </span>
                    </p>
                    <p className="flex gap-4 justify-between">
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Untaxed amount
                      </span>
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {totalBirr}
                      </span>
                    </p>
                    <p className="flex gap-4 justify-between">
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Tax(15%)
                      </span>
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {tax}
                      </span>
                    </p>
                    <p className="flex gap-4 justify-between">
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Grand total
                      </span>
                      <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {grandTotal}
                      </span>
                    </p>
                  </div>
                </div>
                {user?.email === "admin@domino.com" && (
                  <>
                    <div className="pt-4">
                      <button
                        onClick={handleCollapseDiscount}
                        type="button"
                        className="text-black dark:text-white w-full py-2 px-4 border-t border-[#eee] border-b mb-4 font-semibold flex items-center gap-4"
                      >
                        Additional Discount{" "}
                        <span className="font-thin">
                          {collapseDisount ? <FaChevronUp /> : <FaChevronDown />}{" "}
                        </span>{" "}
                      </button>
                    </div>
                    <div
                      className="flex justify-end items-center gap-4 pb-4"
                    >
                      <div
                        className={`${collapseDisount ? "hidden" : ""
                          } px-4 md:w-1/2`}
                      >
                        <label
                          htmlFor="userInputDiscount"
                          className="mb-3 block text-black dark:text-white"
                        >
                          Discount
                        </label>
                        <input
                          type="number"
                          name="userInputDiscount"
                          value={userInputDiscount}
                          id="userInputDiscount"
                          className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          onChange={(e) => setUserInputDiscount(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 flex justify-between gap-4">
                <div className="w-full">
                  <label
                    htmlFor="message"
                    className="mb-3 block text-black dark:text-white"
                  >
                    Your message
                  </label>
                  <textarea
                    onChange={handleOrderInfo}
                    value={orderInfo.description}
                    name="description"
                    id="message"
                    rows={4}
                    className="text-black dark:text-white w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="Leave a comment..."
                  ></textarea>
                </div>
                <div className="w-full">
                  <p className="block mb-2 text-sm font-medium text-graydark dark:text-white">
                    File Names
                  </p>

                  <ul className="space-y-4 text-left text-graydark dark:text-gray-400">
                    {fileName.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-3 rtl:space-x-reverse"
                      >
                        <div className="w-full relative">
                          <label
                            htmlFor={`npm-install-copy-button-${index}`}
                            className="sr-only"
                          >
                            Label
                          </label>
                          <input
                            id={`npm-install-copy-button-${index}`}
                            type="text"
                            className="text-black dark:text-white w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            value={item}
                            disabled
                            readOnly
                            ref={(el) => (inputRefs.current[index] = el)}
                          />
                          <button
                            type="button"
                            title={tooltipMessages[index]}
                            onClick={() => copyToClipboard(index)}
                            className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                          >
                            {icons[index] === "default" ? (
                              <svg
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 18 20"
                              >
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                              </svg>
                            ) : (
                              <span className="inline-flex items-center">
                                <svg
                                  className="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 16 12"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 5.917 5.724 10.5 15 1.5"
                                  />
                                </svg>
                              </span>
                            )}
                          </button>
                          <div
                            role="tooltip"
                            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
                          >
                            <span>{tooltipMessages[index]}</span>
                            <div className="tooltip-arrow" data-popper-arrow></div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}


          {active === "payment" && (
            <div
              className={`${user?.email !== "admin@domino.com" && user?.roles !== "finance"
                ? "hidden"
                : ""
                }`}
            >
              <div className="flex justify-between pt-4 px-4">
                <strong className="text-graydark">
                  Totals
                </strong>
                <div className="text-graydark">
                  <p className="flex gap-4 justify-between">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Grand total:
                    </span>
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {grandTotal}
                    </span>
                  </p>
                  <p className="flex gap-4 justify-between">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Total payment :
                    </span>
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {totaTransaction}
                    </span>
                  </p>
                  <p className="flex gap-4 justify-between">
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Remaining amount :
                    </span>
                    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      {remainingAmount}
                    </span>
                  </p>
                </div>
              </div>

              {/* transactions */}
              <div className="max-w-full overflow-x-auto px-4">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        No
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Date
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Payment method
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Description
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Payment amount
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Reference
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Status
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        {/* Action */}
                        <span className="font-semibold flex justify-center items-center">
                          <CiSettings className="text-xl font-bold" />
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment && payment.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                    {payment &&
                      payment.map((data, index) => (
                        <tr key={index}>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            {index + 1}
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            {data?.date}
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <label
                              htmlFor={`${data?.paymentMethod}-${index}`}
                              className="sr-only peer"
                            >
                              Select an option
                            </label>
                            <select
                              title="paymentMethod"
                              onChange={(e) => handlePaymentMethod(index, e)}
                              name="paymentMethod"
                              value={data?.paymentMethod}
                              id={`${data?.paymentMethod}-${index}`}
                              className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            >
                              <option value="cash">Cash</option>
                              <option value="bank-transfer">Bank Transfer</option>
                              <option value="mobile-banking">Mobile Banking</option>
                              <option value="check">Check</option>
                            </select>
                          </td>

                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <label
                              htmlFor={`${data?.description}-${index}`}
                              className="sr-only peer"
                            >
                              Description
                            </label>
                            <input
                              type="text"
                              name="description"
                              value={data?.description}
                              id={`${data?.description}-${index}`}
                              className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              onChange={(e) => handleFormChange(index, e)}
                            />
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <label
                              htmlFor={`${data?.amount}-${index}`}
                              className="sr-only peer"
                            >
                              Payment amount
                            </label>
                            <input
                              type="number"
                              name="amount"
                              required
                              value={data?.amount}
                              id={`${data?.amount}-${index}`}
                              className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              onChange={(e) => handleFormChange(index, e)}
                            />
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <label
                              htmlFor={`${data?.reference}-${index}`}
                              className="sr-only peer"
                            >
                              Reference
                            </label>
                            <input
                              type="text"
                              name="reference"
                              value={data?.reference}
                              id={`${data?.reference}-${index}`}
                              className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              onChange={(e) => handleFormChange(index, e)}
                            />
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <span
                              className={`${data?.status === "paid"
                                ? "bg-success/10 text-success/80 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-success/90 dark:text-success/30"
                                : "bg-primary/10 text-primary/80 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-primary/90 dark:text-primary/30"
                                }`}
                            >
                              {data?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 relative">
                            <Link
                              to="#"
                              onClick={(event) => {
                                handleAction2(index);
                                event.stopPropagation();
                              }}
                              ref={triggerRef}
                              className="flex items-center gap-4"
                            >
                              <CiMenuKebab />
                            </Link>

                            {/* <!-- Dropdown Start --> */}
                            {showPopover2 === index && (
                              <div
                                ref={dropdownRef}
                                onFocus={() => setDropdownOpen(true)}
                                onBlur={() => setDropdownOpen(false)}
                                className={`absolute right-14 mt-0 flex w-47.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? "block" : "hidden"
                                  }`}
                              >
                                <ul className="flex flex-col gap-2 border-b border-stroke p-3 dark:border-strokedark">
                                  <li>
                                    <NavLink
                                      onClick={() => handlePayPayment(index)}
                                      to="#"
                                      className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                    >
                                      <MdOutlinePayment />
                                      Pay
                                    </NavLink>
                                  </li>
                                  <li>
                                    <NavLink
                                      onClick={() => handleCancelPayment(index)}
                                      to="#"
                                      className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-danger lg:text-base"
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
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 flex items-center justify-between">
                <button
                  onClick={handleAddPaymentRow}
                  type="button"
                  className="flex items-center justify-center rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Add row
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {active === "commission" && (
            <>
              <div
                className={`grid grid-cols-2 gap-4 px-4 mb-4`}>
                <div className="w-full relative">
                  <SalesPartnerSearchInput
                    handleCommissionInfo={handleSalesPerson}
                    value={salesPartners.find((partner) => partner.id === orderInfo.salesPartnerId)?.firstName}
                  />
                </div>
                <div className="">
                  <label
                    htmlFor="totalCommission"
                    className="mb-3 block text-black dark:text-white"
                  >
                    Total Commission
                  </label>
                  <input
                    value={totalCommission?.toFixed(2) || ""}
                    readOnly
                    type="number"
                    name="totalCommission"
                    id="totalCommission"
                    className="text-black dark:text-white w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="max-w-full overflow-x-auto px-4">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        No
                      </th>
                      <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                        Date
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Product
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Services
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Description
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Commission %
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Amount
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Status
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        {/* Action */}
                        <span className="font-semibold flex justify-center items-center">
                          <CiSettings className="text-xl font-bold" />
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {commission && commission.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                    {
                      formData.map((data, index) => (
                        <tr key={index}>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            {index + 1}
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            {commission[index]?.date}
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            {products?.find((product) => product.id === data.productId)?.name}
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            {services?.find((service) => service.id === data.serviceId)?.name}
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <input
                              type="text"
                              name="description"
                              id="description"
                              className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              placeholder="Description"
                              value={commission[index]?.description}
                              onChange={(e) => handleCommissionChange(index, e)}
                            />
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <input
                              title="percentage"
                              type="number"
                              name="percent"
                              id="percent"
                              className="w-full rounded bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              required
                              min="0"
                              value={commission[index]?.percent}
                              onChange={(e) => handleCommissionChange(index, e)}
                            />
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            {commission[index]?.amount.toFixed(2)}
                          </td>
                          <td className="py-2 border-b text-graydark border-[#eee] dark:border-strokedark">
                            <span
                              className={`${commission[index]?.status === "paid"
                                ? "bg-success/10 text-success/80 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-success/90 dark:text-success/30"
                                : "bg-primary/10 text-primary/80 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-primary/90 dark:text-primary/30"
                                }`}
                            >
                              {commission[index]?.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 relative">
                            <Link
                              to="#"
                              onClick={(event) => {
                                handleAction2(index);
                                event.stopPropagation();
                              }}
                              ref={triggerRef}
                              className="flex items-center gap-4"
                            >
                              <CiMenuKebab />
                            </Link>

                            {/* <!-- Dropdown Start --> */}
                            {showPopover2 === index && (
                              <div
                                ref={dropdownRef}
                                onFocus={() => setDropdownOpen(true)}
                                onBlur={() => setDropdownOpen(false)}
                                className={`absolute right-14 mt-0 flex w-47.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? "block" : "hidden"
                                  }`}
                              >
                                <ul className="flex flex-col gap-2 border-b border-stroke p-3 dark:border-strokedark">
                                  <li>
                                    <NavLink
                                      onClick={() => handlePayCommission(index)}
                                      to="#"
                                      className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                                    >
                                      <MdOutlinePayment />
                                      Pay
                                    </NavLink>
                                  </li>
                                  {/* <li>
                                    <NavLink
                                      onClick={() => handleCancelCommission(index)}
                                      to="#"
                                      className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-danger lg:text-base"
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
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </form>


      </section>
      {modalOpen && (
        <StatusEditModal
          handleModalOpen={handleModalOpen}
          dataIndex={dataIndex}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </>
  );
};
export default OrderDetailsPage;
