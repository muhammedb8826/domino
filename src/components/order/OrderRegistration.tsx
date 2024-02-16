"use client";

import { Datepicker } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { createOrder } from "../../redux/features/order/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoBack } from "../common/GoBack";
import CustomerSearchInput from "../customer/CustomerSearchInput";
import { CiSettings } from "react-icons/ci";
import { getprice } from "../../redux/features/price/pricingSlice";
import { getServices } from "../../redux/features/service/servicesSlice";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);

interface CustomerType {
  phone: string;
  firstName: string;
  email: string;
}

export const OrderRegistration = () => {
  const { prices, isLoading, error } = useSelector((state) => state.price);
  const { services } = useSelector((state) => state.service);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getprice());
    dispatch(getServices());
  }, [dispatch]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [orderInfo, setOrderInfo] = useState({
    series: "SAL-ORD-YYYY-",
    date: formattedDate,
    deliveryDate: formattedDate,
    orderType: "",
    description: "",
    customerPhone: "",
    customerFirstName: "",
    customerEmail: "",
    status: "pending",
  });

  const [formData, setFormData] = useState([
    {
      machine: "",
      material: "",
      service: "",
      unitPrice: null,
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
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalBirr, setTotalBirr] = useState(0);
  const [filteredData, setFilteredData] = useState([]);

  const handleIsCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleAddRow = () => {
    setFormData((prevFormData) => [
      ...prevFormData,
      {
        machine: "",
        material: "",
        service: "",
        unitPrice: null,
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
  };

  const handleInputChanges = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setMeasuresFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index][name] = value;
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
    const totalBirr = calculatedUnitPrices.reduce((acc, c) => acc + c || 0, 0);
    setTotalBirr(totalBirr);
  }, [calculatedUnitPrices]);

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
      customerPhone: customer.phone,
      customerFirstName: customer.firstName,
      customerEmail: customer.email,
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
    const updatedFormData = [...formData];
    const filteredData = updatedFormData.filter((_, i) => i !== index);
    setFormData(filteredData);
  };

  const handleMaterialSelect = (selectedOption, index) => {
    const { value } = selectedOption;
    const str = value;
    const parts = str.split("-("); // Split the string at "-("
    const material = parts[0]; // Extract "T-shirt"
    const machine = parts[1].substring(0, parts[1].length - 1); // Extract "DTF" by removing the last character ")"
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index].machine = machine;
      updatedFormData[index].material = material;
      return updatedFormData;
    });
  };

  const handleServiceSelect = (selectedOption, index) => {
    const { value } = selectedOption;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index].service = value;
      return updatedFormData;
    });
  };

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

  // form submission

  const resetForm = () => {
    setOrderInfo({
      series: "SAL-ORD-YYYY-",
      date: formattedDate,
      deliveryDate: formattedDate,
      orderType: "",
      description: "",
      customerPhone: "",
      customerFirstName: "",
      customerEmail: "",
      status: "pending",
    });
    setFormData([
      {
        machine: "",
        material: "",
        service: "",
        unitPrice: null,
      },
    ]);
    setMeasuresFormData([
      {
        unitName: null,
        width: null,
        height: null,
        quantity: null,
        unitPrice: null,
      },
    ]);
    setCalculatedUnitPrices([]);
    setTotalQuantity(0);
    setTotalBirr(0);
  };

  const handleSubmit = (e) => {
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
    const unitPrice = formData.map((item, index) => {
      item.unitPrice = calculatedUnitPrices[index];
      return item;
    });

    const orderData = {
      ...orderInfo,
      orderItems: unitPrice,
      orderMeasures: measuresFormData,
      totalBirr,
      totalQuantity,
    };
    dispatch(createOrder(orderData)).then((res) => {
      if (res.payload) {
        const message = "Order created successfully";
        toast.success(message);
        resetForm();
        navigate("/dashboard");
      }
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <>
      <section className="bg-white dark:bg-gray-900 wrapper py-4 border p-0 min-h-screen">
        <GoBack goback="/dashboard" />
        <h2 className="ps-4 my-4 text-2xl font-bold text-gray-900 dark:text-white">
          Add a new order
        </h2>
        {/* {mediaError && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">Danger alert!</span> {mediaError} Change
          a few things up and try submitting again.
        </div>
      )} */}

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
              value="SAL-ORD-YYYY-"
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
              <option value="In person">In person</option>
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
        <form onSubmit={handleSubmit}>
          <div>
            <button
              onClick={handleIsCollapsed}
              type="button"
              className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
            >
              Orders List{" "}
              <span className="font-thin">
                {isCollapsed ? <FaChevronUp /> : <FaChevronDown />}{" "}
              </span>{" "}
            </button>

            <div className="px-4">
              <table
                className={`${
                  isCollapsed ? "hidden" : ""
                } w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400`}
              >
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="p-4 w-4 border border-gray-300">
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Material
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Services
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Width
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Height
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
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
                            options={uniqueOptions}
                            onChange={(selectedOption) =>
                              handleMaterialSelect(selectedOption, index)
                            }
                            className="w-full"
                          />
                        </td>
                        <td
                          scope="row"
                          className="font-medium text-gray-900 whitespace-nowrap dark:text-white"
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
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-24">
                          <input
                            title="width"
                            type="number"
                            name="width"
                            id="width"
                            onChange={(e) => handleInputChanges(index, e)}
                            value={data.width}
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-24">
                          <input
                            title="height"
                            type="number"
                            name="height"
                            id="height"
                            onChange={(e) => handleInputChanges(index, e)}
                            value={data.height}
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-24">
                          <input
                            title="quantity"
                            type="number"
                            name="quantity"
                            id="quantity"
                            onChange={(e) => handleInputChanges(index, e)}
                            value={data.quantity}
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-24">
                          <input
                            readOnly
                            title="price"
                            type="number"
                            name="price"
                            id="price"
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                            value={calculatedUnitPrices[index] || 0}
                          />
                        </td>
                        <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-10">
                          <button
                            onClick={() => handleCancel(index)}
                            title="action"
                            type="button"
                            className="flex items-center justify-between gap-2 text-black font-medium rounded-lg text-lg px-2.5 py-2.5 text-center"
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
                  htmlFor="totalQuantity"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Total(Birr)
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
                {
                  measuresFormData.map(
                    (
                      measure,
                      index // Added index for unique key
                    ) => (
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
                            strokeLinecap="round" // Changed to camelCase
                            strokeLinejoin="round" // Changed to camelCase
                            strokeWidth="2" // Changed to camelCase
                            d="M1 5.917 5.724 10.5 15 1.5"
                          />
                        </svg>
                        <span>
                          {formData && formData[index]?.machine} - {formData[index]?.material} - {measuresFormData && measure.width}x{measure.height}
                        </span>
                      </li>
                    )
                  )}
              </ul>
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
      </section>
    </>
  );
};
