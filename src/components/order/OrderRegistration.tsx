"use client";

import { Datepicker } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import { createOrder, createOrderStatus } from "../../redux/features/order/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoBack } from "../common/GoBack";
import CustomerSearchInput from "../customer/CustomerSearchInput";
import { CiSettings } from "react-icons/ci";
import { getprice } from "../../redux/features/price/pricingSlice";
import { getServices } from "../../redux/features/service/servicesSlice";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
import { getCustomers } from "@/redux/features/customer/customerSlice";
import { getJobOrdersProducts } from "@/redux/features/jobOrderProductsSlice";
import { getProducts } from "@/redux/features/product/productSlice";
import Loader from "@/common/Loader";
import { SalesPartnerSearchInput } from "../commission/SalesPartnerSearchInput";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import { createCommission } from "@/redux/features/commission/commissionSlice";
import { createPayment } from "@/redux/features/paymentSlice";

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);

interface CustomerType {
  phone: string;
  firstName: string;
  email: string;
  id: string;
}

export const OrderRegistration = () => {
  const { prices, isLoading, error } = useSelector((state) => state.price);
  const { services } = useSelector((state) => state.service);
  const { jobOrderProducts } = useSelector((state) => state.jobOrderProduct);
  const { salesPartners } = useSelector((state) => state.salesPartner);
  const { products } = useSelector((state) => state.product);
  const { orders } = useSelector((state) => state.order);
  const { customers } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);


  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getprice());
    dispatch(getServices());
    dispatch(getJobOrdersProducts());
    dispatch(getProducts());
    dispatch(getCustomers());
  }, [dispatch]);

  const [orderInfo, setOrderInfo] = useState({
    series: "SAL-ORD-YYYY-",
    date: formattedDate,
    deliveryDate: formattedDate,
    orderSource: "",
    description: "",
    customerId: "",
    salesPartnerId: "",
  });

  const [formData, setFormData] = useState([
    {
      productId: "",
      serviceId: "",
      priceId: "",
      unitPrice: null,
      width: "",
      height: "",
      quantity: "",
      status: "recieved",
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

  const [grandTotal, setGrandTotal] = useState(0);

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalBirr, setTotalBirr] = useState(0);
  const [tax, setTax] = useState(0);
  const [fileName, setFileName] = useState([]);
  const [userInputDiscount, setUserInputDiscount] = useState(0);
  const [collapseDisount, setCollapseDiscount] = useState(false);
  const [totaTransaction, setTotalTransaction] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);

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

  useEffect(() => {
    const totalTransaction = payment?.reduce(
      (acc, { amount }) => acc + Number(amount || 0),
      0
    );
    setTotalTransaction(totalTransaction);
    setRemainingAmount(grandTotal - totalTransaction);
  }, [payment, grandTotal]);

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
      const updatedData = [...prev];
      updatedData[index] = {
        ...updatedData[index],
        [name]: value,
      };
      return updatedData;
    });
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
        status: "recieved",
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

  // customer and order info handling
  const handleOrderInfo = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      [name]: value,
    }));
  };

  const handleCustomerInfo = (customer: CustomerType) => {
    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      customerId: customer.id,
    }));
  };

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

  const handleCancel = (index) => {
    const updatedFormData = [...formData];
    const filteredData = updatedFormData.filter((_, i) => i !== index);
    setFormData(filteredData);
    const updatedCommission = [...commission];
    const filteredCommission = updatedCommission.filter((_, i) => i !== index);
    setCommission(filteredCommission);
  };

  const handleCancelPayment = (index) => {
    const updatedData = [...payment];
    const filteredData = updatedData.filter((_, i) => i !== index);
    setPayment(filteredData);
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
    const totalBirr = formData.reduce((acc, c) => acc + c.unitPrice || 0, 0);
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

  const calculateUnitPrice = (formDataItem) => {
    const { width, height, quantity, priceId, } = formDataItem;
    const price = prices?.find((price) => price.id === priceId.toString());
    if (width && height && quantity && price) {
      return ((parseFloat(width) * parseFloat(height)) * parseFloat(quantity)) * parseFloat(price.unitPrice);
    }
    return null;
  };

  const handleInputChanges = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index][name] = value;
      updatedFormData[index].unitPrice = calculateUnitPrice(updatedFormData[index]);
      return updatedFormData;
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
      const updatedFormData = [...prevFormData];
      updatedFormData[index].productId = value;
      updatedFormData[index].priceId = priceId?.toString();
      updatedFormData[index].unitPrice = calculateUnitPrice(updatedFormData[index]);
      return updatedFormData;
    });
  };

  const handleServiceSelect = (selectedOption, index) => {
    const { value } = selectedOption;
    const productId = formData[index].productId;
    const priceId = findSellingPrice(productId, value);

    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index].serviceId = value;
      updatedFormData[index].priceId = priceId?.toString();
      updatedFormData[index].unitPrice = calculateUnitPrice(updatedFormData[index]);
      return updatedFormData;
    });
  };

  const handleCollapseDiscount = () => {
    setCollapseDiscount((prev) => !prev);
  };

  // form submission
  const resetForm = () => {
    setOrderInfo({
      series: "SAL-ORD-YYYY-",
      date: formattedDate,
      deliveryDate: formattedDate,
      orderSource: "",
      description: "",
      customerId: "",
      salesPartnerId: "",
    });

    setFormData([
      {
        productId: "",
        serviceId: "",
        priceId: "",
        unitPrice: null,
        width: "",
        height: "",
        quantity: "",
        status: "recieved",
      },
    ]);
    setTotalQuantity(0);
    setTotalBirr(0);
    setGrandTotal(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderInfo.customerId) {
      const message = "Please select a customer";
      toast.error(message);
      return;
    }
    if (formData.length === 0) {
      const message = "Please add order items";
      toast.error(message);
      return;
    }
    const date = new Date();
    const currentYear = date.getFullYear();

    // Get the series number
    const seriesNumber = String(orders.length).padStart(4, '0'); // Pad with leading zeros if needed
    orderInfo.series = `IAN-O-${seriesNumber}-${currentYear}`;

    const orderData = {
      id: uuidv4(),
      ...orderInfo,
      orderItems: formData,
      totalBirr,
      tax,
      grandTotal,
      fileNames: fileName,
      totalQuantity,
    };
    dispatch(createOrder(orderData));
    const paymentData = {
      orderId: orderData.id,
      transactions: payment,
    };
    dispatch(createPayment(paymentData));
    const statusData = {
      orderId: orderData.id,
      status: "received",
      adminApproval: false,
      orderItems: Array(formData.length).fill({ status: "received", note: "", printed: false, adminApproval: false, completed: false }),
    };
    dispatch(createOrderStatus(statusData));
    const commissionData = {
      orderId: orderData.id,
      transactions: commission,
    };

    dispatch(createCommission(commissionData));

    const message = "Order created successfully";
    toast.success(message);
    resetForm();
    navigate("/dashboard");
  };

  const [active, setActive] = useState("order");
  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };

  if (error) return <ErroPage error={error} />;

  return isLoading ? (<Loader />) : (
    <>
      <section className="bg-white dark:bg-gray-900 wrapper py-4 p-0 min-h-screen">
        <GoBack goback="/dashboard" />
        <h2 className="px-4 text-title-md2 font-semibold text-black dark:text-white">
          New order
        </h2>
        <form onSubmit={handleSubmit}>
          <nav className="flex justify-between items-center px-4">
            <ul className="list-reset py-4 rounded flex bg-white dark:bg-boxdark dark:text-white">
              <li className="text-gray-500 text-sm dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => handleButtonClick("order")}
                  className={`${active === "order" ? "text-white bg-black" : ""
                    } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
                >
                  Order
                </button>
              </li>
              <li className="text-gray-500 text-sm dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => handleButtonClick("payment")}
                  className={`${active === "payment" ? "text-white bg-black" : ""
                    } px-5 py-1.5  font-medium text-gray-900 rounded-lg`}
                >
                  Payment
                </button>
              </li>
              <li className="text-gray-500 text-sm dark:text-gray-400">
                <button
                  type="button"
                  onClick={() => handleButtonClick("commission")}
                  className={`${active === "commission" ? "text-white bg-black" : ""
                    } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
                >
                  Commission
                </button>
              </li>
            </ul>
            <button
              type="submit"
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </nav>

          {active === "order" && (
            <>
              <div className="grid sm:grid-cols-3 sm:gap-6 mb-4 p-4">
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
                    value="IAN-O-YYYY"
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
                    value={orderInfo.date}
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
                    value={customers.find((customer) => customer.id === orderInfo.customerId)?.firstName}
                  />
                </div>
                <div>
                  <label
                    htmlFor="orderSource"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Delivery date
                  </label>
                  <Datepicker
                    title="Delivery date"
                    onSelectedDateChanged={handleDeliveryDatePickerChange}
                    value={orderInfo.deliveryDate}
                    style={{
                      padding: "0.25rem",
                      paddingLeft: "2.5rem",
                      border: "1px solid #ccc",
                      color: "#333",
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
                >
                  Orders List{" "}
                </button>
                <div className="relative rounded-sm border-b border-stroke bg-white py-6 dark:border-strokedark dark:bg-boxdark sm:px-4 xl:pb-1">
                  <div className="max-w-full">
                    <table
                      className={`w-full table-auto`}
                    >
                      <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                          <th className="py-4 px-4 font-medium text-black dark:text-white">
                            No
                          </th>
                          <th
                            className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white"
                          >
                            Product
                          </th>
                          <th
                            className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white"
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
                            className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                          >
                            Amount
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
                              <td className="w-4 border-b text-graydark border-[#eee] py-2 px-4 dark:border-strokedark">
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
                              <td className="border-b text-graydark border-[#eee] dark:border-strokedark">
                                <input
                                  title="width"
                                  type="number"
                                  name="width"
                                  id="width"
                                  onChange={(e) => handleInputChanges(index, e)}
                                  value={data.width}
                                  className="sm:text-sm border-0 block w-full p-2.5"
                                  placeholder="0"
                                  required
                                  min={0}
                                />
                              </td>
                              <td className="border-b text-graydark border-[#eee] dark:border-strokedark">
                                <input
                                  title="height"
                                  type="number"
                                  name="height"
                                  id="height"
                                  onChange={(e) => handleInputChanges(index, e)}
                                  value={data.height}
                                  className="sm:text-sm border-0 block w-full p-2.5"
                                  placeholder="0"
                                  required
                                  min={0}
                                />
                              </td>
                              <td className="border-b text-graydark border-[#eee] dark:border-strokedark">
                                <input
                                  title="quantity"
                                  type="number"
                                  name="quantity"
                                  id="quantity"
                                  onChange={(e) => handleInputChanges(index, e)}
                                  value={data.quantity}
                                  className="sm:text-sm border-0 block w-full p-2.5"
                                  placeholder="0"
                                  required
                                  min={0}
                                />
                              </td>
                              <td className="border-b text-graydark border-[#eee] dark:border-strokedark">
                                { data.unitPrice}
                              </td>
                              <td className="border-b text-graydark border-[#eee] dark:border-strokedark">
                                <button
                                  onClick={() => handleCancel(index)}
                                  title="action"
                                  type="button"
                                  className="flex items-center justify-between gap-2 text-graydark font-medium rounded-lg text-lg px-2.5 py-2.5 text-center"
                                >
                                  <IoMdClose />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

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
                        className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
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
                <div>
                  <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    File Names
                  </p>
                  <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
                    {fileName.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-3 rtl:space-x-reverse"
                      >
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
                        <span>{item}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                <strong>Summary</strong>
                <div className="w-full py-4">
                  <div className="flex items-center">
                    <p className="w-1/4 gap-5 block mb-2 text-sm font-medium text-graydark dark:text-white">
                      Grand total :
                    </p>
                    <p className="flex-1">{grandTotal}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="w-1/4 gap-5 block mb-2 text-sm font-medium text-graydark dark:text-white">
                      Total payment :
                    </p>
                    <p className="flex-1">{totaTransaction}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="w-1/4 gap-5 block mb-2 text-sm font-medium text-graydark dark:text-white">
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
                    {payment && payment.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                    {payment &&
                      payment.map((data, index) => (
                        <tr
                          key={index}
                          className="bg-white border-b m-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="px-4 w-4 font-medium text-graydark whitespace-nowrap dark:text-white border border-gray-300">
                            {index + 1}
                          </td>
                          <td className="px-4 font-medium text-graydark whitespace-nowrap dark:text-white border border-gray-300">
                            {data.date}
                          </td>

                          <td className="font-medium text-graydark whitespace-nowrap dark:text-white border border-gray-300">
                            <label
                              htmlFor={`${data.paymentMethod}-${index}`}
                              className="sr-only peer"
                            >
                              Select an option
                            </label>
                            <select
                              title="paymentMethod"
                              onChange={(e) => handlePaymentMethod(index, e)}
                              name="paymentMethod"
                              value={data.paymentMethod}
                              id={`${data.paymentMethod}-${index}`}
                              className="text-graydark text-sm border-0 focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option value="cash">Cash</option>
                              <option value="bank-transfer">Bank Transfer</option>
                              <option value="mobile-banking">Mobile Banking</option>
                              <option value="check">Check</option>
                            </select>
                          </td>

                          <td className="font-medium text-graydark whitespace-nowrap dark:text-white border border-gray-300">
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
                          <td className="font-medium text-graydark whitespace-nowrap dark:text-white border border-gray-300">
                            <label
                              htmlFor={`${data.amount}-${index}`}
                              className="sr-only peer"
                            >
                              Payment amount
                            </label>
                            <input
                              type="number"
                              name="amount"
                              required
                              value={data.amount}
                              id={`${data.amount}-${index}`}
                              className="text-gray-900 sm:text-sm block w-full border-0"
                              onChange={(e) => handleFormChange(index, e)}
                            />
                          </td>
                          <td className="font-medium text-graydark whitespace-nowrap dark:text-white border border-gray-300">
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
                              onChange={(e) => handleFormChange(index, e)}
                            />
                          </td>
                          <td className="px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                            <span
                              className={`${data.status === "paid"
                                ? "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"
                                : "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
                                }`}
                            >
                              {data.status}
                            </span>
                          </td>
                          <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-10 relative">
                            <button
                              onClick={() => handleCancelPayment(index)}
                              title="action"
                              type="button"
                              className="text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                              <IoMdClose />
                            </button>
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
            <div
              className={`grid grid-cols-2 gap-4 px-4`}>
              <div className="w-full relative">
                <SalesPartnerSearchInput
                  handleCommissionInfo={handleSalesPerson}
                  value={salesPartners.find((partner) => partner.id === orderInfo.salesPartnerId)?.firstName}
                />
              </div>
              <div className="">
                <div className="px-4">
                  <label
                    htmlFor="totalCommission"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Total Commission
                  </label>
                  <input
                    value={totalCommission.toFixed(2) || ""}
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
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Product
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
                      Description
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
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 border border-gray-300"
                    >
                      Status
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
                          {commission[index].date}
                        </td>
                        <td
                          scope="row"
                          className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300"
                        >
                          {products.find((product) => product.id === data.productId)?.name}
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {services.find((service) => service.id === data.serviceId)?.name}
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          <input
                            type="text"
                            name="description"
                            id="description"
                            className="text-gray-900 text-sm block w-full border-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Description"
                            value={commission[index].description}
                            onChange={(e) => handleCommissionChange(index, e)}
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          <input
                            type="number"
                            name="percent"
                            id="percent"
                            className="text-gray-900 text-sm block w-full border-0 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="0"
                            required
                            min="0"
                            value={commission[index].percent}
                            onChange={(e) => handleCommissionChange(index, e)}
                          />
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          {commission[index].amount.toFixed(2)}
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                          {commission[index].status}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

        </form>


      </section>
    </>
  );
};
