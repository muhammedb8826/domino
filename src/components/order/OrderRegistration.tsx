"use client";

import { Datepicker } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { createOrder } from "../../redux/features/order/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getPrintingData } from "../../redux/features/print/printingSlice";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoBack } from "../common/GoBack";
import CustomerSearchInput from "../customer/CustomerSearchInput";

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);

interface CustomerType {
  phone: string;
  firstName: string;
  email: string;
}

export const OrderRegistration = () => {
  const { printingData, isLoading, error } = useSelector(
    (state) => state.printing
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [tableRows, setTableRows] = useState(["row-1"]);
  const [count, setCount] = useState(1);
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
      media: "",
      material: "",
      service: "",
      unitName: "",
      width: "",
      height: "",
      quantity: 0,
      message: "",
      unitPrice: 0,
    },
  ]);

  const [materials, setMaterials] = useState([]);
  const [services, setServices] = useState([]);
  const [unitPrices, setUnitPrices] = useState([0]);
  const [units, setUnits] = useState([]);
  const [unitPrice, setUnitPrice] = useState([]);
  const [unitValue, setUnitValue] = useState([]);
  const [unitPriceUpdated, setUnitPriceUpdated] = useState([]);
  const [calculatedUnitPrices, setCalculatedUnitPrices] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalBirr, setTotalBirr] = useState(0);

  const handleIsCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleAddRow = () => {
    setCount((prev) => prev + 1);
    setTableRows((prev) => [...prev, `row-${count + 1}`]);
  };

  const handleSelectedMedia = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      if (!updatedFormData[index]) {
        updatedFormData[index] = {}; // Initialize object at index if undefined
      }
      updatedFormData[index].media = value;
      return updatedFormData;
    });
    const selectedMedia = printingData.find((item) => item.type === value);
    if (selectedMedia) {
      setMaterials((prevMaterials) => {
        const updatedMaterials = [...prevMaterials];
        updatedMaterials[index] = selectedMedia.materials;
        return updatedMaterials;
      });
      setServices((prevServices) => {
        const updatedServices = [...prevServices];
        updatedServices[index] = selectedMedia.services;
        return updatedServices;
      });
      if (selectedMedia.prices.length > 0) {
        setUnitPrices((prevUnitPrices) => {
          const updatedUnitPrices = [...prevUnitPrices];
          updatedUnitPrices[index] = selectedMedia.prices;
          return updatedUnitPrices;
        });
      }
    }
  };

  const handleSelectedMaterial = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index].material = value;
      return updatedFormData;
    });
    if (unitPrices.length > 0) {
      const matchingUnits = unitPrices[index].filter((price: any) => {
        return price.type === formData[index].media && price.material === value;
      });
      if (matchingUnits.length > 0) {
        const allServices = matchingUnits.map((unit) => unit.service);
        setServices((prevServices) => {
          const updatedServices = [...prevServices];
          updatedServices[index] = allServices;
          return updatedServices;
        });
      }
    }
  };

  const handleSelectedService = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index].service = value;
      return updatedFormData;
    });

    if (unitPrices.length > 0) {
      const matchingUnits = unitPrices[index].filter((price) => {
        return (
          price.type === formData[index].media &&
          price.material === formData[index].material &&
          price.service === value
        );
      });
      if (matchingUnits.length > 0) {
        const allUnits = matchingUnits.map((unit) => unit.unitName);
        setUnits((prevUnits) => {
          const updatedUnits = [...prevUnits];
          updatedUnits[index] = allUnits;
          return updatedUnits;
        });
      }
    }
  };

  const handleSelectedUnit = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[index].unitName = value;
      return updatedFormData;
    });
    if (unitPrices.length > 0) {
      const matchingUnits = unitPrices[index].filter((price) => {
        return (
          price.type === formData[index].media &&
          price.material === formData[index].material &&
          price.service === formData[index].service &&
          price.unitName === value
        );
      });

      if (matchingUnits.length > 0) {
        setUnits((prevUnits) => {
          const updatedUnits = [...prevUnits];
          updatedUnits[index] = matchingUnits.map((unit) => unit.unitName); // Assuming unitName is what you want to set
          return updatedUnits;
        });
        setUnitPrice((prevUnitPrice) => {
          const updatedUnitPrice = [...prevUnitPrice];
          updatedUnitPrice[index] = matchingUnits.map((unit) => unit.prices);
          return updatedUnitPrice;
        });
        setUnitValue((prevUnitValue) => {
          const updatedUnitValue = [...prevUnitValue];
          updatedUnitValue[index] = matchingUnits.map((unit) => unit.unitValue);
          return updatedUnitValue;
        });
      }
    }
  };

  const handleInputChanges = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      if (!updatedFormData[index]) {
        updatedFormData[index] = {}; // Initialize object at index if undefined
      }
      updatedFormData[index][name] = value;
      return updatedFormData;
    });
  };

  const totalBirrCalculator = useCallback(() => {
    const length = formData.length;
    const newArray = unitPriceUpdated.splice(0, length);
    const total = newArray.reduce((acc, curr) => acc + parseFloat(curr), 0);
    const quantity = formData.map((item) => item.quantity);
    const numberArray = quantity.map(Number);
    const totalQuantity = numberArray.reduce((acc, curr) => acc + curr, 0);
    setTotalBirr(total);
    setTotalQuantity(totalQuantity);
    setCalculatedUnitPrices(newArray);
  }, [formData, unitPriceUpdated]);

  useEffect(() => {
    totalBirrCalculator();
  }, [formData, totalBirrCalculator]);

  const calculateUnitPrice = (index) => {
    let getUnitValue = 0;
    const price = unitPrice[0] ? unitPrice[0].toString() : "";
    const value = unitValue[0] ? unitValue[0].toString() : "";

    const numbersOnly = value.match(/\d+(\.\d+)?/g);
    if (numbersOnly) {
      const result = numbersOnly.map(Number);
      getUnitValue = parseFloat(result[0]) * parseFloat(result[1]);
    } else {
      console.log("No match");
    }

    const basePrice = parseFloat(price) * getUnitValue;
    const totalUnitPrice =
      basePrice *
      (formData[index]?.quantity || 0) *
      (formData[index]?.width || 0) *
      (formData[index]?.height || 0);

    // Get existing prices from localStorage
    const savedPrices = JSON.parse(localStorage.getItem("unitPrices")) || {};

    // Update savedPrices with new totalUnitPrice
    savedPrices[index] = totalUnitPrice;

    // Save updated savedPrices to localStorage
    localStorage.setItem("unitPrices", JSON.stringify(savedPrices));
    return totalUnitPrice;
  };

  useEffect(() => {
    const savedPrices = JSON.parse(localStorage.getItem("unitPrices")) || {};
    const savedPricesArray = Object.values(savedPrices);
    setUnitPriceUpdated(savedPricesArray);
  }, [formData]);

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
        media: "",
        material: "",
        service: "",
        unitName: "",
        width: "",
        height: "",
        quantity: 0,
        message: "",
        unitPrice: 0,
      },
    ]);
    setMaterials([]);
    setServices([]);
    setUnitPrices([0]);
    setUnits([]);
    setUnitPrice([]);
    setUnitValue([]);
    setUnitPriceUpdated([]);
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
      totalBirr,
      totalQuantity,
    };
    dispatch(createOrder(orderData)).then((res) => {
      if (res.payload) {
        const message = "Order created successfully";
        toast(message);
        resetForm();
        navigate("/dashboard");
      }
    });
  };

  const tableRow = "row-";
  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <>
      <section className="bg-white dark:bg-gray-900 wrapper py-4 border p-0">
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

        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6 mb-4 p-4">
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
            />
          </div>
          <div className="w-full relative">
            <CustomerSearchInput handleCustomerInfo={handleCustomerInfo} />
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
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
              value={orderInfo.deliveryDate}
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

            <div
              className={`${
                isCollapsed ? "hidden" : ""
              } relative overflow-x-auto sm:rounded-lg px-4 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`}
            >
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-search"
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="checkbox-all-search"
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Machine
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Material{" "}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Services
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Unit
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Width
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Height
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      Amount
                    </th>
                    {/* <th
                      scope="col"
                      className="px-4 py-2 bg-gray-200 border border-gray-300"
                    >
                      <span className="sr-only">edit</span>
                      <CiSettings className="text-xl" />
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, index) => (
                    <tr
                      key={row}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="w-4 px-2 py-2 border border-gray-300">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-table-search-${index + 1}`}
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`checkbox-table-search-${index + 1}`}
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </td>
                      <th
                        scope="row"
                        className="px-4 py-2 border border-gray-300 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {row.replace(tableRow, "")}
                      </th>
                      <td className="px-2 py-2 border border-gray-300">
                        <select
                          title="media"
                          name="media"
                          required
                          value={formData[index]?.media || ""}
                          onChange={(e) => handleSelectedMedia(index, e)}
                          id="medias"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Choose machine</option>
                          {printingData.map((media: string) => (
                            <option key={media.id} value={media.type}>
                              {media.type}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 border border-gray-300">
                        <select
                          title="material"
                          value={formData[index]?.material || ""}
                          required
                          name="material"
                          onChange={(e) => handleSelectedMaterial(index, e)}
                          id="material"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Choose materials</option>
                          {materials[index]?.map((material: string) => (
                            <option key={material.name} value={material.name}>
                              {material.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 border border-gray-300">
                        <select
                          title="service"
                          value={formData[index]?.service || ""}
                          required
                          name="service"
                          onChange={(e) => handleSelectedService(index, e)}
                          id="service"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Choose services</option>
                          {services[index]?.map(
                            (service: string, index: number) => (
                              <option
                                key={`${service}-${index}`}
                                value={service}
                              >
                                {service}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="px-2 py-2 border border-gray-300">
                        <select
                          title="unit"
                          value={formData[index]?.unitName || ""}
                          required
                          name="unitName"
                          onChange={(e) => handleSelectedUnit(index, e)}
                          id="unit"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option>Choose units</option>
                          {units[index]?.map((unit: string, index: number) => (
                            <option key={`${unit}-${index}`} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2 border border-gray-300">
                        <input
                          onChange={(e) => handleInputChanges(index, e)}
                          value={formData[index]?.width || ""}
                          type="number"
                          name="width"
                          className="w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="1,2,3..."
                          required
                          min={0}
                        />
                      </td>
                      <td className="px-2 py-2 border border-gray-300">
                        <input
                          onChange={(e) => handleInputChanges(index, e)}
                          value={formData[index]?.height || ""}
                          type="number"
                          name="height"
                          className="w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="1,2,3..."
                          required
                          min={0}
                        />
                      </td>
                      <td className="px-2 py-2 border border-gray-300">
                        <input
                          value={formData[index]?.quantity || ""}
                          onChange={(e) => handleInputChanges(index, e)}
                          type="number"
                          name="quantity"
                          className="w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="1,2,3.."
                          required
                          min={0}
                        />
                      </td>
                      <td className="px-2 py-2 border border-gray-300">
                        <p>
                          {isNaN(calculateUnitPrice(index))
                            ? 0
                            : calculateUnitPrice(index)}
                        </p>
                      </td>
                      {/* <td className="px-2 py-2 border border-gray-300">
                        <button
                          type="button"
                          className="flex items-center gap-2"
                        >
                          <CiEdit /> Edit
                        </button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 flex items-center justify-between">
              <button
                onClick={handleAddRow}
                type="button"
                className="bg-gray-200 rounded p-4 py-2 font-semibold flex items-center gap-4"
              >
                Add row
              </button>
              <button
                type="button"
                className="bg-gray-200 rounded p-4 py-2 font-semibold flex items-center gap-4"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="p-4">
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              onChange={handleOrderInfo}
              value={orderInfo.description}
              id="description"
              name="description"
              rows={8}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Your description here"
            ></textarea>
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
