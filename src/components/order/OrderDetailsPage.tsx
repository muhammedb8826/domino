import { GoBack } from "../common/GoBack";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import {
  getOrdersById,
  updateOrder,
} from "../../redux/features/order/orderSlice";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Datepicker } from "flowbite-react";
import CustomerSearchInput from "../customer/CustomerSearchInput";
import { FaChevronDown, FaChevronUp, FaRegEdit } from "react-icons/fa";
import { CiMenuKebab, CiSettings } from "react-icons/ci";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
import { getServices } from "../../redux/features/service/servicesSlice";
import { getprice } from "../../redux/features/price/pricingSlice";
import { MdDelete } from "react-icons/md";
import { StatusEditModal } from "./StatusEditModal";
import { getDiscounts } from "@/redux/features/dicount/dicountSlice";

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
  const { singleOrder, isLoading, error } = useSelector((state) => state.order);
  const { prices } = useSelector((state) => state.price);
  const { services } = useSelector((state) => state.service);
  const { discounts } = useSelector((state) => state.discount);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getprice());
    dispatch(getServices());
    dispatch(getDiscounts());
  }, [dispatch]);

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
            customerEmail: order.customerEmail,
            status: order.status,
          });
          setFormData(order.orderItems);
          setMeasuresFormData(order.orderMeasures);
          setTotalBirr(order.totalBirr);
          setTotalQuantity(order.totalQuantity);
          setFileName(order.fileNames);
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [dispatch, id]);

  const [fileName, setFileName] = useState([]);
  const [tooltipMessages, setTooltipMessages] = useState(
    Array(fileName.length).fill("Copy to clipboard")
  );
  const [icons, setIcons] = useState(Array(fileName.length).fill("default"));
  const inputRefs = useRef(Array(fileName.length).fill(null));

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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapseDisount, setCollapseDiscount] = useState(false)
  const [orderInfo, setOrderInfo] = useState({
    series: "SAL-ORD-YYYY-",
    date: formattedDate,
    deliveryDate: formattedDate,
    orderType: "",
    description: "",
    customerPhone: "",
    customerFirstName: "",
    customerEmail: "",
  });

  const [formData, setFormData] = useState([
    {
      machine: "",
      material: "",
      service: "",
      unitPrice: null,
      status: "recieved",
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
  const [discountPerItem, setDiscountPerItem] = useState([]);
  const [levels, setLevels] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tax, setTax] = useState(0);

  const handleModalOpen = (index) => {
    setModalOpen((prev) => !prev);
    setDataIndex(index);
  };

  const handleStatusUpdate = (dataIndex, status) => {
    // Update the status in the form data
    const updatedFormData = formData.map((item, i) => {
      if (i === dataIndex) {
        return {
          ...item,
          status,
        };
      }
      return item;
    });
    setFormData(updatedFormData);
  };

  const handleIsCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleCollapseDicount = () => {
    setCollapseDiscount((prev)=> !prev);
  }

  const handleAddRow = () => {
    setFormData((prevFormData) => [
      ...prevFormData,
      {
        machine: "",
        material: "",
        service: "",
        unitPrice: null,
        status: "recieved",
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

  useEffect(() => {
    const totalUnits = measuresFormData.map((data, index) => {
      const matchingPrice = filteredData[index];
      if (!matchingPrice) {
        return 0;
      }
      const { width, height, quantity } = data;
      const calculatedUnitPrice =  (width * height) * quantity;
      return calculatedUnitPrice;
    });
    setTotalUnits(totalUnits);
  }, [measuresFormData, filteredData]);

  // calculate discount

  const calculateDiscount = useCallback((price, totalUnit) => {
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
  
    // Calculate discount based on discount percentage
    const discount = discountPercentage * price;
    return { discount, level };
  }, [discounts]); // Include discounts in the dependency array
  
  useEffect(() => {
    const updatedDiscounts = totalUnits.map((totalUnit, index) => {
      const totalUnitNum = parseFloat(totalUnit);
      const price = calculatedUnitPrices[index];
      const { discount, level } = calculateDiscount(price, totalUnitNum);
      setLevels(prevLevels => {
        const updatedLevels = [...prevLevels];
        updatedLevels[index] = level;
        return updatedLevels;
      });
      return discount;
    }); 
    setDiscountPerItem(updatedDiscounts);
  }, [calculatedUnitPrices, totalUnits, calculateDiscount]);

  useEffect(() => {
    const totaldiscount = discountPerItem.reduce((acc, c) => acc + c || 0, 0);
    setGrandTotal(totalBirr - totaldiscount);
  }, [discountPerItem, totalBirr]);


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

    // parts[0] will contain "T-shirt" and parts[1] will contain "DTF)"
    const material = parts[0]; // Extract "T-shirt"
    const machine = parts[1].substring(0, parts[1].length - 1); // Extract "DTF" by removing the last character ")"
    // console.log(material, machine); // Output: T-shirt DTF
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
        status: "recieved",
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
      fileNames: appendName,
      totalQuantity,
      id: singleOrder.id,
    };

    dispatch(updateOrder(orderData)).then((res) => {
      if (res.payload) {
        const message = "Order updated successfully";
        toast.success(message);
        resetForm();
        navigate("/dashboard");
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErroPage error={error} />;
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900 wrapper py-4 border p-0 min-h-screen">
        <GoBack goback="/dashboard" />
        <h2 className="ps-4 my-4 text-2xl font-bold text-gray-900 dark:text-white">
          Edit Order
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
                      Total sqm
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Discount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 border border-gray-300"
                    >
                      Status
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
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
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
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          <input
                            readOnly
                            title="totalUnits"
                            type="number"
                            name="totalUnits"
                            id="totalUnits"
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0"
                            required
                            min={0}
                            value={totalUnits[index] || 0}
                          />
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                        {/* <input
                            readOnly
                            title="totaldiscount"
                            type="number"
                            name="totaldiscount"
                            id="totaldiscount"
                            className="text-gray-900 sm:text-sm border-0 block w-full p-2.5"
                            placeholder="0".
                            required
                            min={0}
                            value={discountPerItem[index] || 0}
                          /> */}
                          <p className="text-gray-900 sm:text-sm border-0 block w-full p-2.5">{discountPerItem[index] || 0 } : {levels[index] > 0? <span className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded text-xs px-2 py-0.5 text-center">Level <sup>{levels[index]}</sup></span>: 0}</p>
                        </td>
                        <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-16">
                          <div className="flex items-center justify-center w-full">
                            {data.status === "recieved" && (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium  px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                {data.status}
                              </span>
                            )}
                            {data.status === "edited" && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                {data.status}
                              </span>
                            )}
                            {data.status === "rejected" && (
                              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                {data.status}
                              </span>
                            )}
                            {/* <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                              {data.status}
                            </span> */}
                          </div>
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
                                <li key={index}>
                                  <button
                                    type="button"
                                    onClick={() => handleModalOpen(index)}
                                    className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                                  >
                                    <FaRegEdit />
                                    Edit
                                  </button>
                                </li>
                                <li key={index}>
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

                          {/* <button
                            onClick={() => handleCancel(index)}
                            title="action"
                            type="button"
                            className="flex items-center justify-between gap-2 text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-2.5 py-2.5 text-center"
                          >
                            <IoMdClose />
                          </button> */}
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
           <hr />

             <div className="px-4 w-1/2">
                <label
                  htmlFor="tax"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tax
                </label>
                <input
                  // value={tax}
                  readOnly
                  type="number"
                  name="tax"
                  id="tax"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>


          <div className="pt-4">
            <button
              onClick={handleCollapseDicount}
              type="button"
              className="w-full py-2 px-4 border-t border-b mb-4 font-semibold flex items-center gap-4"
            >
              Addition Discount{" "}
              <span className="font-thin">
                {collapseDisount ? <FaChevronUp /> : <FaChevronDown />}{" "}
              </span>{" "}
            </button>
          </div>

          <div className={`${collapseDisount? 'hidden': ''} grid md:grid-cols-2 gap-4 pb-4`}>
            <div className="px-4">
                <label
                  htmlFor="grandTotal"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Grand Total
                </label>
                <input
                  value={grandTotal}
                  readOnly
                  type="number"
                  name="grandTotal"
                  id="grandTotal"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
              <div className="px-4">
                <label
                  htmlFor="discount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Dicount 
                </label>
                <input
                  type="number"
                  name="discount"
                  id="discount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            <hr />

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
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            update
          </button>
        </form>
      </section>
      {modalOpen && (
        <StatusEditModal
          handleModalOpen={handleModalOpen}
          dataIndex={dataIndex}
          handleStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};
export default OrderDetailsPage;
