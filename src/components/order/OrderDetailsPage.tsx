import { GoBack } from "../common/GoBack";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import {
  getOrderStatus,
  getOrdersById,
  updateOrder,
  updateOrderStatus,
} from "../../redux/features/order/orderSlice";
import { useNavigate, useParams } from "react-router-dom";
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
import { MdDelete } from "react-icons/md";
import { StatusEditModal } from "./StatusEditModal";
import { getDiscounts } from "@/redux/features/dicount/dicountSlice";
import CommissionSearchInput from "../commission/CommissionSearchInput";
import {
  createCommissionTransaction,
  getCommissionTransactions,
  getCommissions,
  updateCommissionTranscation,
} from "@/redux/features/commission/commissionSlice";
import Swal from "sweetalert2";
import {
  getCustomers,
  getPaymentTransactions,
  updateCustomer,
  updatePaymentTransaction,
} from "@/redux/features/customer/customerSlice";
import { RootState } from "@/redux/store";

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
  const { singleOrder, orderStatus, isLoading, error } = useSelector(
    (state) => state.order
  );
  const { prices } = useSelector((state) => state.price);
  const { services } = useSelector((state) => state.service);
  const { discounts } = useSelector((state) => state.discount);
  const { user } = useSelector((state: RootState) => state.auth);

  const findOrderStatus = orderStatus.find((status) => status.orderId === id);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getprice());
    dispatch(getServices());
    dispatch(getDiscounts());
    dispatch(getCommissions());
    dispatch(getOrderStatus()).then((res) => {
      if (res.payload) {
        const status = res.payload.find((status) => status.orderId === id);
        setOrderStatus(status);
      }
    });
    dispatch(getPaymentTransactions()).then((res) => {
      if (res.payload) {
        const customer = res.payload.find(
          (customer) => customer.order?.id === id
        );
        setTransactionData(customer);
        setPaymentTransaction(customer.transactions);
      }
    });
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getOrdersById(id))
      .then((res) => {
        if (res.payload) {
          const order = res.payload;
          setOrderInfo({
            series: order.series,
            date: order.date,
            deliveryDate: order.deliveryDate,
            orderType: order.orderType,
            description: order.description,
            customerPhone: order.customerPhone,
            customerFirstName: order.customerFirstName,
            commissionId: order.commissionId,
            customerEmail: order.customerEmail,
            commissionPhone: order.commissionPhone,
            commissionFirstName: order.commissionFirstName,
            commissionEmail: order.commissionEmail,
          });
          setFormData(order.orderItems);
          setMeasuresFormData(order.orderMeasures);
          setTotalBirr(order.totalBirr);
          setTotalQuantity(order.totalQuantity);
          setFileName(order.fileNames);
          setDiscountPerItem(order.discounts);
          setLevels(order.levels);
          setTotalBirrAfterDiscount(order.totalBirrAfterDiscount);
          setGrandTotal(order.grandTotal);
          setVat(order.vat);
          setUserInputDiscount(order.userInputDiscount);
          setPaymentInfo(order.paymentInfo);
          setCommissionPercent(
            order.orderItems.map((item) => item.commissionPercent)
          );
          setCommissionPrice(
            order.orderItems.map((item) => item.commissionPrice)
          );
          setTotalCommission(order.totalCommission);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
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
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(null);
      }
      if (
        popoverRef2.current &&
        !popoverRef2.current.contains(event.target as Node)
      ) {
        setShowPopover2(null);
      }
    };

    if (showPopover !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    if (showPopover2 !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover, showPopover2]);

  const handleAction = (index: number) => {
    setShowPopover((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleAction2 = (index: number) => {
    setShowPopover2((prevIndex) => (prevIndex === index ? null : index));
  };

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: "cash",
    paymentReference: "",
    paymentAmount: 0,
    paymentStatus: "not paid",
  });
  // const [collapseDisount, setCollapseDiscount] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    series: "SAL-ORD-YYYY-",
    date: formattedDate,
    deliveryDate: formattedDate,
    orderType: "",
    description: "",
    customerPhone: "",
    customerFirstName: "",
    customerEmail: "",
    commissionId: "",
    commissionPhone: "",
    commissionFirstName: "",
    commissionEmail: "",
  });

  const [formData, setFormData] = useState([
    {
      machine: "",
      material: "",
      service: "",
      unitPrice: null,
      status: "recieved",
      isDiscounted: false,
    },
  ]);

  const [measuresFormData, setMeasuresFormData] = useState([
    {
      unitName: null,
      width: null,
      height: null,
      quantity: null,
      unitPrice: null,
    },
  ]);

  const [calculatedUnitPrices, setCalculatedUnitPrices] = useState([]);
  const [totalUnits, setTotalUnits] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalBirr, setTotalBirr] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState(0);
  const [discountPerItem, setDiscountPerItem] = useState([
    formData.length ? Array(formData.length).fill(0) : [],
  ]);
  const [levels, setLevels] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [userInputDiscount, setUserInputDiscount] = useState(0);
  const [totalBirrAfterDiscount, setTotalBirrAfterDiscount] = useState([]);
  const [commissionPrice, setCommissionPrice] = useState([]);
  const [commissionPercent, setCommissionPercent] = useState([]);
  const [totalCommission, setTotalCommission] = useState(null);
  const [commissionForAll, setCommissionForAll] = useState(null);
  const [collapseCommission, setCollapseCommission] = useState(false);
  const [collapseDisount, setCollapseDiscount] = useState(false);
  const [totaTransaction, setTotalTransaction] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [orderStat, setOrderStatus] = useState(findOrderStatus);
  const [transactionData, setTransactionData] = useState({});
  const [paymentTransaction, setPaymentTransaction] = useState([
    {
      date: formattedDate,
      paymentMethod: "cash",
      description: "",
      paymentAmount: "",
      status: "pending",
      reference: "",
    },
  ]);

  useEffect(() => {
    const totalTransaction = paymentTransaction?.reduce(
      (acc, { paymentAmount }) => acc + Number(paymentAmount || 0),
      0
    );
    setTotalTransaction(totalTransaction);
    setRemainingAmount(grandTotal - totalTransaction);
  }, [paymentTransaction, grandTotal]);

  const handleFormChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPaymentTransaction((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        [name]: value,
      };
      return updatedData;
    });
  };

  const handlePaymentMethod = (index, e) => {
    setPaymentTransaction((prev) => {
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        paymentMethod: e.target.value,
      };
      return updatedData;
    });
  };

  const handleAddPaymentTransaction = () => {
    setPaymentTransaction((prev) => [
      ...prev,
      {
        date: formattedDate,
        paymentMethod: "cash", // "cash" or "bank transfer
        description: "",
        paymentAmount: "",
        status: "pending",
        reference: "",
      },
    ]);
  };

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = [...paymentTransaction];
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
          setPaymentTransaction(filteredData);
        });
      }
    });
  };

  const handleCollapseCommission = () => {
    setCollapseCommission((prev) => !prev);
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
        machine: "",
        material: "",
        service: "",
        unitPrice: null,
        status: "recieved",
        isDiscounted: false,
      },
    ]);
    setMeasuresFormData((prevFormData) => [
      ...prevFormData,
      {
        unitName: null,
        width: null,
        height: null,
        quantity: null,
        unitPrice: null,
      },
    ]);
    setOrderStatus((prev) => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          status: "received",
          note: "",
          printed: false,
          adminApproval: false,
          completed: false,
        },
      ],
    }));
  };

  const handleInputChanges = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setMeasuresFormData((prevFormData) => {
      const updatedFormData = prevFormData.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      });
      return updatedFormData;
    });
  };

  // calculate unit price and total quantity

  useEffect(() => {
    const totalQuantity = measuresFormData.reduce(
      (acc, { quantity }) => acc + Number(quantity || 0),
      0
    );
    setTotalQuantity(totalQuantity);
  }, [measuresFormData]);

  useEffect(() => {
    if (totalBirrAfterDiscount) {
      const totalBirr = totalBirrAfterDiscount.reduce(
        (acc, c) => acc + c || 0,
        0
      );
      let discount = 0;
      if (userInputDiscount > 0) {
        discount = userInputDiscount;
      }
      const vat = (totalBirr - discount) * 0.15;
      setTotalBirr(totalBirr);
      setVat(vat);
    }
  }, [totalBirrAfterDiscount, userInputDiscount]);

  useEffect(() => {
    const calculatedUnitPrices = measuresFormData.map((data, index) => {
      const matchingPrice = filteredData[index];
      if (!matchingPrice) {
        return 0;
      }
      const { width, height, quantity } = data;
      const { unitPrice } = matchingPrice;
      const calculatedUnitPrice = unitPrice * (width * height) * quantity;
      return calculatedUnitPrice;
    });
    setCalculatedUnitPrices(calculatedUnitPrices);
  }, [measuresFormData, filteredData]);

  useEffect(() => {
    const totalUnits = measuresFormData.map((data, index) => {
      const matchingPrice = filteredData[index];
      if (!matchingPrice) {
        return 0;
      }
      const { width, height, quantity } = data;
      const calculatedUnitPrice = width * height * quantity;
      return calculatedUnitPrice;
    });
    setTotalUnits(totalUnits);
  }, [measuresFormData, filteredData]);

  // calculate discount

  const calculateDiscount = useCallback(
    (price, totalUnit) => {
      if (!price) {
        return { discount: 0, level: null };
      }
      // Iterate through discounts array to find the appropriate discount level
      let discountPercentage = 0;
      let level = null;
      for (const discount of discounts) {
        if (totalUnit >= discount.minumumMeterSquare) {
          discountPercentage = parseFloat(discount.discountPercentage) / 100; // Convert percentage string to number
          level = discount.level;
        } else {
          break; // Break the loop when the first applicable discount level is found
        }
      }
      const discount = discountPercentage * price;
      return { discount, level };
    },
    [discounts]
  ); // Include discounts in the dependency array

  useEffect(() => {
    const updatedDiscounts = totalUnits.map((totalUnit, index) => {
      const totalUnitNum = parseFloat(totalUnit);
      const price = calculatedUnitPrices[index];
      const { discount, level } = calculateDiscount(price, totalUnitNum);
      setLevels((prevLevels = []) => {
        const updatedLevels = [...prevLevels];
        updatedLevels[index] = level;
        return updatedLevels;
      });
      return discount;
    });
    setDiscountPerItem(updatedDiscounts);
  }, [calculatedUnitPrices, totalUnits, calculateDiscount]);

  const handleDiscountChange = (index, e) => {
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index] = {
        ...updatedFormData[index],
        isDiscounted: e.target.checked,
      };
      return updatedFormData;
    });
  };

  useEffect(() => {
    const updatedDiscounts = formData.map((item, index) => {
      if (!item.isDiscounted) {
        return 0;
      }
      const price = calculatedUnitPrices[index];
      const totalUnit = totalUnits[index];
      const { discount, level } = calculateDiscount(price, totalUnit);
      setLevels((prevLevels) => {
        const updatedLevels = [...prevLevels];
        updatedLevels[index] = level;
        return updatedLevels;
      });
      return discount;
    });
    setDiscountPerItem(updatedDiscounts);
  }, [formData, calculatedUnitPrices, totalUnits, calculateDiscount]);

  useEffect(() => {
    if (discountPerItem) {
      const totalBirrAfterDiscount = calculatedUnitPrices.map(
        (price, index) => {
          return price - discountPerItem[index];
        }
      );
      setTotalBirrAfterDiscount(totalBirrAfterDiscount);
      let discount = 0;
      if (userInputDiscount > 0) {
        discount = userInputDiscount;
      }
      const grandTotal = totalBirr - discount + vat;
      setGrandTotal(grandTotal);
    }
  }, [
    discountPerItem,
    totalBirr,
    calculatedUnitPrices,
    vat,
    userInputDiscount,
  ]);

  // customer and order info handling
  const handleOrderInfo = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (totaTransaction > 0 && grandTotal > 0 && totaTransaction < grandTotal) {
      setPaymentInfo((prev) => ({
        ...prev,
        paymentStatus: "partial",
      }));
    }
    if (totaTransaction === grandTotal) {
      setPaymentInfo((prev) => ({
        ...prev,
        paymentStatus: "paid",
      }));
    }
    if (totaTransaction === 0) {
      setPaymentInfo((prev) => ({
        ...prev,
        paymentStatus: "not paid",
      }));
    }
  }, [grandTotal, totaTransaction]);

  const handleCustomerInfo = (customer: CustomerType) => {
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      customerPhone: customer.phone,
      customerFirstName: customer.firstName,
      customerEmail: customer.email,
    }));
  };

  //  commission handling

  const handleCommissionInfo = (commission: CustomerType) => {
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      commissionId: commission.id,
      commissionPhone: commission.phone,
      commissionFirstName: commission.firstName,
      commissionEmail: commission.email,
    }));
  };

  const handleCommissionPercent = (index, e) => {
    const { value } = e.target;
    setCommissionPercent((prevCommissionPercent) => {
      const updatedCommissionPercent = [...prevCommissionPercent];
      updatedCommissionPercent[index] = value;
      return updatedCommissionPercent;
    });
    setCommissionForAll(null);
  };

  // commission prices handling

  useEffect(() => {
    const commission = calculatedUnitPrices.map(
      (price, index) => price * (commissionPercent[index] / 100 || 0) // Ensure a default value of 0 if commission percent is not set
    );
    setCommissionPrice(commission);
  }, [calculatedUnitPrices, commissionPercent]);
  
  // Total commission
  useEffect(() => {
    const totalCommission = commissionPrice.reduce((acc, c) => acc + c, 0);
    setTotalCommission(totalCommission);
  }, [commissionPrice]);
  // resetting commission for all when the commission percent for each index changes

  const handleCommissionForAll = (e) => {
    const { value } = e.target;
    setCommissionForAll(value);
    setCommissionPercent(Array(formData.length).fill(value));
    const commission = calculatedUnitPrices.map(
      (price) => price * (value / 100)
    );
    setCommissionPrice(commission);
  };

  // reset commission for all when the commission percent changes

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

  // setting options for material and machine

  const uniqueMachineMaterialCombinations = new Set();
  prices.forEach(({ machine, material }) => {
    const combination = `${material.name}-(${machine.name})`;
    uniqueMachineMaterialCombinations.add(combination);
  });

  const uniqueOptions = Array.from(uniqueMachineMaterialCombinations).map(
    (combination) => ({
      value: combination,
      label: combination,
    })
  );

  const serviceName = services.map((data) => {
    return data.name;
  });

  const serviceOptions = [];
  for (let i = 0; i < services.length; i++) {
    const serviceLabel = `${serviceName[i]}`;
    const serviceValue = `${serviceName[i]}`;
    serviceOptions.push({ value: serviceValue, label: serviceLabel });
  }

  const handleCancel = (index) => {
    // const updatedFormData = [...formData];
    // const filteredData = updatedFormData.filter((_, i) => i !== index);
    // setFormData(filteredData);
    // // After filtering data, recalculate totalBirr and vat
    // const totalBirr = filteredData.reduce((acc, item) => acc + item.totalBirr || 0, 0);
    // const vat = totalBirr * 0.15;
    // setTotalBirr(totalBirr);
    // setVat(vat);
  };

  const handleMaterialSelect = (selectedOption, index) => {
    const { value } = selectedOption;
    const str = value;
    const parts = str.split("-("); // Split the string at "-("
    const material = parts[0]; // Extract "T-shirt"
    const machine = parts[1].substring(0, parts[1].length - 1); // Extract "DTF" by removing the last character ")"
    setFormData((prevFormData) => {
      const updatedFormData = prevFormData.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            machine: machine, // Update machine property
            material: material,
          };
        }
        return item;
      });
      return updatedFormData;
    });
  };

  const handleServiceSelect = (selectedOption, index) => {
    const { value } = selectedOption;
    setFormData((prevFormData) => {
      const updatedFormData = prevFormData.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            service: value, // Update service property
          };
        }
        return item;
      });
      return updatedFormData;
    });
  };

  useEffect(() => {
    const data = [...formData];
    const units = [...measuresFormData];
    const combination = data.map((item, index) => {
      return `${orderInfo.customerFirstName}-${item.machine}-${item.material}-${units[index].width}x${units[index].height}`;
    });
    setFileName(combination);
  }, [formData, measuresFormData, orderInfo.customerFirstName]);

  useEffect(() => {
    const matchingPriceData = formData.map((unitPrice) => {
      // Find the matching price data in the prices array
      const matchingPrice = prices.find(
        (price) =>
          price.machine?.name === unitPrice.machine &&
          price.material?.name === unitPrice.material &&
          price.service?.name === unitPrice.service
      );
      return matchingPrice;
    });
    setFilteredData(matchingPriceData);
  }, [formData, prices]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.length === 0) {
      alert("Please add order items");
      return;
    }
    if (orderInfo.customerPhone === "") {
      alert("Please add customer phone or name");
      return;
    }
    if (orderInfo.orderType === "") {
      alert("Please add order type");
      return;
    }
    if (orderInfo.deliveryDate === "") {
      alert("Please add delivery date");
      return;
    }

    const updatedFormData = formData.map((item, index) => {
      return {
        ...item,
        unitPrice: calculatedUnitPrices[index],
        commissionPrice: commissionPrice[index],
        commissionPercent: commissionPercent[index],
      };
    });

    const appendName = fileName.map((item) => {
      const nameAndFile = `${orderInfo.customerFirstName}-${item}`;
      return nameAndFile;
    });

    const orderData = {
      ...orderInfo,
      orderItems: updatedFormData,
      orderMeasures: measuresFormData,
      totalBirr,
      totalCommission,
      fileNames: appendName,
      totalQuantity,
      grandTotal,
      vat,
      discounts: discountPerItem,
      levels,
      userInputDiscount,
      totalBirrAfterDiscount,
      paymentInfo,
      commissionId: orderInfo.commissionId,
      id: singleOrder.id,
    };

    dispatch(updateOrder(orderData)).then((res) => {
      if (res.payload) {
        const message = "Order updated successfully";
        toast.success(message);
      }
    });

    const updatedTransactionsStatus = paymentTransaction.map((item) => {
      return {
        ...item,
        status: "paid",
      };
    });

    const transactions = {
      ...transactionData,
      transactions: updatedTransactionsStatus,
    };
    dispatch(updatePaymentTransaction(transactions)).then((res) => {
      if (res.payload) {
        setPaymentTransaction(res.payload.transactions);
      }
    });
    dispatch(updateOrderStatus(orderStat));
    setGrandTotal(grandTotal);
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErroPage error={error} />;
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900 wrapper py-4 mb-10 border p-0 min-h-screen">
        <GoBack goback="/dashboard" />
        <h2 className="ps-4 my-4 text-2xl font-bold text-gray-900 dark:text-white">
          Edit Order
        </h2>
        <div className={`grid gap-4 sm:grid-cols-3 sm:gap-6 mb-4 p-4`}>
          <div className="w-full">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Series
            </label>
            <input
              type="text"
              name="name"
              value={orderInfo.series}
              readOnly
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Type product name"
            />
          </div>
          <div className="w-full">
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Date
            </label>
            <Datepicker
              title="Registration date"
              name="date"
              onSelectedDateChanged={handleDatePickerChange}
              // value={orderInfo.date}
              style={{
                padding: "0.25rem",
                paddingLeft: "2.5rem",
                border: "1px solid #ccc",
                color: "#333",
              }}
            />
          </div>
          <div className="w-full relative">
            <CustomerSearchInput
              handleCustomerInfo={handleCustomerInfo}
              value={orderInfo.customerFirstName}
            />
          </div>
          <div>
            <label
              htmlFor="orderType"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Order Type
            </label>
            <select
              name="orderType"
              onChange={handleOrderInfo}
              value={orderInfo.orderType}
              id="orderType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option>Choose type</option>
              <option value="phone">Phone</option>
              <option value="telegram">Telegram</option>
              <option value="telegram">In person</option>
            </select>
          </div>
          <div className="w-full">
            <label
              htmlFor="deliveryDate"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Delivery date
            </label>
            <Datepicker
              title="Delivery date"
              onSelectedDateChanged={handleDeliveryDatePickerChange}
              // value={orderInfo.deliveryDate}
              style={{
                padding: "0.25rem",
                paddingLeft: "2.5rem",
                border: "1px solid #ccc",
                color: "#333",
              }}
            />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="pb-4">
            <button
              type="button"
              className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
            >
              Orders List{" "}
            </button>

            <div className="px-4">
              <table
                className="
               w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4 w-4 border border-gray-300">
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Material
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Services
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Width
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Height
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Total sqm
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Discount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
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
                        className="bg-white border-b m-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 w-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          {index + 1}
                        </td>
                        <td
                          scope="row"
                          className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300"
                        >
                          <Select
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                border: "none",
                                borderColor: state.isFocused ? "grey" : "none",
                              }),
                            }}
                            value={uniqueOptions.find(
                              (option) =>
                                option.value ===
                                `${data.material}-(${data.machine})`
                            )}
                            options={uniqueOptions}
                            onChange={(selectedOption) =>
                              handleMaterialSelect(selectedOption, index)
                            }
                            className="w-full"
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          <Select
                            styles={{
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                border: "none",
                                borderColor: state.isFocused ? "grey" : "none",
                              }),
                            }}
                            value={serviceOptions.find(
                              (option) => option.value === data.service
                            )}
                            options={serviceOptions}
                            onChange={(selectedOption) =>
                              handleServiceSelect(selectedOption, index)
                            }
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          <input
                            title="width"
                            type="number"
                            name="width"
                            id="width"
                            onChange={(e) => handleInputChanges(index, e)}
                            value={measuresFormData[index]?.width || ""}
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          <input
                            title="height"
                            type="number"
                            name="height"
                            id="height"
                            onChange={(e) => handleInputChanges(index, e)}
                            value={measuresFormData[index]?.height || ""}
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          <input
                            title="quantity"
                            type="number"
                            name="quantity"
                            id="quantity"
                            onChange={(e) => handleInputChanges(index, e)}
                            value={measuresFormData[index]?.quantity || ""}
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                          />
                        </td>
                        <td className="px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          {calculatedUnitPrices[index] || 0}
                        </td>
                        <td className="px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          {totalUnits[index] || 0}
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-40">
                          <div className="flex items-center gap-2">
                            <span className="flex-1 px-2">
                              {discountPerItem?.[index] !== undefined
                                ? discountPerItem[index]
                                : null}
                            </span>
                            {discountPerItem && discountPerItem[index] > 0 && (
                              <p className="text-gray-900 sm:text-sm flex items-center justify-center w-1/4">
                                {levels && levels[index] ? (
                                  levels[index] > 0 ? (
                                    <span className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded text-xs px-1  text-center">
                                      Level <sup>{levels[index]}</sup>
                                    </span>
                                  ) : (
                                    0
                                  )
                                ) : (
                                  0
                                )}
                              </p>
                            )}

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
                              <div className="relative w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-20">
                          <p className="p-1">
                            {totalBirrAfterDiscount
                              ? totalBirrAfterDiscount[index]
                              : 0}
                          </p>
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          {orderStat && (
                            <div
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="border flex items-center justify-center w-full relative"
                          >
                              {orderStat.orderItems[index].status ===
                                "received" && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium  px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                  {orderStat.orderItems[index].status}
                                </span>
                              )}
                              {orderStat.orderItems[index].status ===
                                "edited" && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                  {orderStat.orderItems[index].status}
                                </span>
                              )}
                              {orderStat.orderItems[index].status ===
                                "rejected" && (
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                  {orderStat.orderItems[index].status}
                                </span>
                              )}
                              {orderStat.orderItems[index].status ===
                                "approved" && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                  {orderStat.orderItems[index].status}
                                </span>
                              )}
                              {orderStat.orderItems[index].status ===
                                "printed" && (
                                <span className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {orderStat.orderItems[index].status}
                                </span>
                              )}
                              {orderStat.orderItems[index].status ===
                                "paid" && (
                                <span className="text-white bg-sky-500 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-100 dark:bg-sky-400 dark:hover:bg-sky-500 dark:focus:ring-sky-600 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {orderStat.orderItems[index].status}
                                </span>
                              )}
                              {orderStat.orderItems[index].status ===
                                "delivered" && (
                                <span className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {orderStat.orderItems[index].status}
                                </span>
                              )}
                              {invisibleTooltip && ( // Show tooltip only if visibleTooltip state is true
                                <>
                                {orderStat.orderItems[index].note !=="" ?
                                (
                                <div
                                  role="tooltip"
                                  className="absolute z-10 inline-block p-1 text-xs font-medium text-gray-100 bg-gray-800 border border-gray-300 rounded-lg shadow-sm tooltip"
                                >
                                  {orderStat.orderItems[index].note}
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
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-10 relative">
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
                                {orderStat?.orderItems[index].adminApproval === false && (
                                <li
                                  className={`${
                                    user?.email !== "admin@domino.com" &&
                                    user?.roles !== "graphic-designer"
                                      ? "hidden"
                                      : ""
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleModalOpen(index)}
                                    className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                                  >
                                    <FaRegEdit />
                                    Edit
                                  </button>
                                </li>
                                )}
                                <li
                                  className={`${
                                    user?.email !== "admin@domino.com" &&
                                    user?.roles !== "reception"
                                      ? "hidden"
                                      : ""
                                  }`}
                                >
                                  <button
                                    onClick={() => handleCancel(index)}
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
                    ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex items-center justify-between">
              <button
                onClick={handleAddRow}
                type="button"
                className="bg-gray-200 rounded px-2 font-semibold flex items-center gap-4"
              >
                New order
              </button>
              <button
                type="button"
                className="bg-gray-200 rounded px-2 font-semibold flex items-center gap-4"
              >
                Download
              </button>
            </div>
            <div className="px-4 flex justify-between items-center">
              <div>
                <label
                  htmlFor="totalQuantity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Total Quantity
                </label>
                <input
                  value={totalQuantity}
                  readOnly
                  type="number"
                  name="totalQuantity"
                  id="totalQuantity"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="totalBirr"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Sub Total
                </label>
                <input
                  value={totalBirr}
                  readOnly
                  type="number"
                  name="totalBirr"
                  id="totalBirr"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>
          <hr />

          <div className="px-4 grid grid-cols-2">
            <div>
              <strong>Totals</strong>
            </div>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex justify-between gap-4 items-center">
                <label
                  htmlFor="tax"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-[15%]"
                >
                  Vat
                </label>
                <input
                  value={vat}
                  readOnly
                  type="number"
                  name="tax"
                  id="tax"
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex justify-between gap-4 items-center">
                <label
                  htmlFor="grandTotal"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white w-[15%]"
                >
                  Total (Birr)
                </label>
                <input
                  value={grandTotal}
                  readOnly
                  type="number"
                  name="grandTotal"
                  id="grandTotal"
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-4 flex justify-between">
            <div className="w-1/2">
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your message
              </label>
              <textarea
                onChange={handleOrderInfo}
                value={orderInfo.description}
                name="description"
                id="message"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Leave a comment..."
              ></textarea>
            </div>
            <div className="w-[25%]">
              <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                File Names
              </p>

              <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
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
                        className="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          <div className="absolute top-56 end-44">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              update
            </button>
          </div>
        </form>
        {user?.email === "admin@domino.com" && (
          <>
            <div className="pt-4">
              <button
                onClick={handleCollapseDiscount}
                type="button"
                className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
              >
                Additional Discount{" "}
                <span className="font-thin">
                  {collapseDisount ? <FaChevronUp /> : <FaChevronDown />}{" "}
                </span>{" "}
              </button>
            </div>
            <div
              className="
            flex justify-end items-center gap-4 pb-4"
            >
              <div
                className={`${
                  collapseDisount ? "hidden" : ""
                } px-4 flex md:w-1/2`}
              >
                <label
                  htmlFor="userInputDiscount"
                  className="w-[15%] gap-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Discount
                </label>
                <input
                  type="number"
                  name="userInputDiscount"
                  value={userInputDiscount}
                  id="userInputDiscount"
                  className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                  onChange={(e) => setUserInputDiscount(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <button
          // onClick={handleCollapseDicount}
          type="button"
          className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
        >
          Payment{" "}
          {/* <span className="font-thin">
                {collapseDisount ? <FaChevronUp /> : <FaChevronDown />}{" "}
              </span>{" "} */}
        </button>

        <div
          className={`${
            user?.email !== "admin@domino.com" && user?.roles !== "finance"
              ? "hidden"
              : ""
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            <strong>Summary</strong>
            <div className="w-full py-4">
              <div className="flex items-center">
                <p className="w-1/4 gap-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Grand total :
                </p>
                <p className="flex-1">{grandTotal}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/4 gap-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Total payment :
                </p>
                <p className="flex-1">{totaTransaction}</p>
              </div>
              <div className="flex items-center">
                <p className="w-1/4 gap-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Remaining amount :
                </p>
                <p className="flex-1">{remainingAmount}</p>
              </div>
            </div>
          </div>

          {/* transactions */}
          <div className="px-4">
            <table
              className="
               col-span-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4 w-4 border border-gray-300">
                    No
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Payment method
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Payment amount
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Reference
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    {/* Action */}
                    <span className="font-semibold flex justify-center items-center">
                      <CiSettings className="text-xl font-bold" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentTransaction && paymentTransaction.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
                {paymentTransaction &&
                  paymentTransaction.map((data, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b m-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-4 w-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                        {index + 1}
                      </td>
                      <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                        {data.date}
                      </td>

                      <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                        <label
                          htmlFor={`${data.paymentMethod}-${index}`}
                          className="sr-only peer"
                        >
                          Select an option
                        </label>
                        <select
                          onChange={(e) => handlePaymentMethod(index, e)}
                          name="paymentMethod"
                          value={data.paymentMethod}
                          id={`${data.paymentMethod}-${index}`}
                          className="text-gray-900 text-sm border-0 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="cash">Cash</option>
                          <option value="bank-transfer">Bank Transfer</option>
                          <option value="mobile-banking">Mobile Banking</option>
                          <option value="check">Check</option>
                        </select>
                      </td>

                      <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                        <label
                          htmlFor={`${data.description}-${index}`}
                          className="sr-only peer"
                        >
                          Description
                        </label>
                        <input
                          type="text"
                          name="description"
                          value={data.description}
                          id={`${data.description}-${index}`}
                          className="text-gray-900 sm:text-sm block w-full border-0"
                          onChange={(e) => handleFormChange(index, e)}
                        />
                      </td>
                      <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                        <label
                          htmlFor={`${data.paymentAmount}-${index}`}
                          className="sr-only peer"
                        >
                          Payment amount
                        </label>
                        <input
                          type="number"
                          name="paymentAmount"
                          value={data.paymentAmount}
                          id={`${data.paymentAmount}-${index}`}
                          className="text-gray-900 sm:text-sm block w-full border-0"
                          placeholder="0"
                          onChange={(e) => handleFormChange(index, e)}
                          min={0}
                        />
                      </td>
                      <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                        <label
                          htmlFor={`${data.reference}-${index}`}
                          className="sr-only peer"
                        >
                          Reference
                        </label>
                        <input
                          type="text"
                          name="reference"
                          value={data.reference}
                          id={`${data.reference}-${index}`}
                          className="text-gray-900 sm:text-sm block w-full border-0"
                          placeholder="0"
                          onChange={(e) => handleFormChange(index, e)}
                        />
                      </td>
                      <td className="px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                        <span
                          className={`${
                            data.status === "paid"
                              ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                              : "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                          }`}
                        >
                          {data.status}
                        </span>
                      </td>
                      <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-10 relative">
                        <button
                          onClick={() => handleAction2(index)}
                          title="action"
                          type="button"
                          className="text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                          <CiMenuKebab />
                        </button>
                        {showPopover2 === index && (
                          <div
                            ref={popoverRef2}
                            className="absolute z-40 right-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                          >
                            <ul className="py-2 text-sm text-gray-700">
                              {user?.email === "admin@domino.com" && (
                                <li>
                                  <button
                                    onClick={() =>
                                      handleDeleteTransaction(index)
                                    }
                                    type="button"
                                    className="text-left text-red-500 flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                                  >
                                    <MdDelete /> Delete
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex items-center justify-between">
            <button
              onClick={handleAddPaymentTransaction}
              type="button"
              className="bg-gray-200 rounded px-2 font-semibold flex items-center gap-4"
            >
              Add transaction
            </button>
            <button
              type="button"
              className="bg-gray-200 rounded px-2 font-semibold flex items-center gap-4"
            >
              Download
            </button>
          </div>
        </div>
        {user?.email === "admin@domino.com" && (
          <>
            <div className="pt-4 relative">
              <button
                onClick={handleCollapseCommission}
                type="button"
                className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
              >
                Commission{" "}
                <span className="font-thin">
                  {collapseCommission ? <FaChevronUp /> : <FaChevronDown />}{" "}
                </span>{" "}
              </button>
            </div>
            <div
              className={`${
                collapseCommission ? "hidden" : ""
              } grid grid-cols-2 gap-4 px-4`}
            >
              <div className="w-full relative">
                <CommissionSearchInput
                  handleCommissionInfo={handleCommissionInfo}
                  value={orderInfo.commissionFirstName}
                />
              </div>
              <div className="">
                <div className="px-4 mb-2">
                  <label
                    htmlFor="paymentMethod"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Commission percent
                  </label>
                  <input
                    type="number"
                    name="commissionForAll"
                    value={commissionForAll || ""}
                    id="commissionForAll"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="0"
                    required
                    onChange={handleCommissionForAll}
                  />
                </div>

                <div className="px-4">
                  <label
                    htmlFor="totalCommission"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Total Commission
                  </label>
                  <input
                    value={totalCommission || ""}
                    readOnly
                    type="number"
                    name="totalCommission"
                    id="totalCommission"
                    className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <table
                className="
               col-span-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4 w-4 border border-gray-300">
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Material
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Services
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Commission %
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Earned
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
                        className="bg-white border-b m-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="px-4 w-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          {index + 1}
                        </td>
                        <td
                          scope="row"
                          className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300"
                        >
                          {data.material}
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {data.service}
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          {calculatedUnitPrices[index] || 0}
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          <input
                            type="number"
                            name="commissionPercent"
                            id="commissionPercent"
                            className="text-gray-900 text-sm block w-full border-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                            value={commissionPercent[index] || ""}
                            onChange={(e) => handleCommissionPercent(index, e)}
                          />
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          {commissionPrice[index] || 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
      {modalOpen && (
        <StatusEditModal
          handleModalOpen={handleModalOpen}
          dataIndex={dataIndex}
          orderStat={orderStat}
          setOrderStatus={setOrderStatus}
        />
      )}
    </>
  );
};
export default OrderDetailsPage;
