import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { useCallback, useEffect, useState } from "react";
import { getPrintingData } from "../../redux/features/print/printingSlice";
import { v4 as uuidv4 } from "uuid";
import { GoBack } from "../common/GoBack";
import { FaArrowRight } from "react-icons/fa";
import { createOrder } from "../../redux/features/order/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const { printingData, isLoading, error } = useSelector(
    (state) => state.printing
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);

  const [orderId, setOrderId] = useState(uuidv4());
  const [medias, setMedias] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [unitValue, setUnitValue] = useState("");
  const [mediaError, setError] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedMedia, setSelectedMedia] = useState("");

  const [formData, setFormData] = useState({
    media: "",
    material: "",
    service: "",
    unitName: "",
    width: "",
    height: "",
    quantity: 1,
    price: "",
    dueDate: "",
    message: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleSelectedMedia = (e) => {
    if (e.target.value === "") {
      setError("Please select a media");
      setMaterials([]);
      setServices([]);
      setUnits([]);
      setSelectedMedia("");
      setFormData((prev) => ({ ...prev, media: "" }));
    }
    if (e.target.value) {
      setSelectedMedia(e.target.value);
      setFormData((prev) => ({ ...prev, media: e.target.value }));
      const selected = printingData.find((media) => media.type === e.target.value);
      setMaterials(selected.materials);
      setServices(selected.services);
      if (selected.price.length > 0 && Array.isArray(selected.price)) {
        setUnitPrice(selected.price);
        setError("");
      } else {
        setError(`This ${e.target.value} doesn't have unit price`);
      }
    }
  };
  
  const handleSelectedMaterial = (e) => {
    if (e.target.value === "") {
      setError("Please select a material");
      setServices([]);
      setUnits([]);
      setSelectedMaterial("");
      setSelectedService("");
      setSelectedUnit("");
      setFormData((prev) => ({ ...prev, material: "" }));
    }
    if (e.target.value) {
      setSelectedMaterial(e.target.value);
      setFormData((prev) => ({ ...prev, material: e.target.value }));
  
      if (unitPrice.length > 0 && Array.isArray(unitPrice)) {
        // Filter the unitPrice array based on formData values
        const matchingUnits = unitPrice.filter((unit) => {
          return unit.type === formData.media && unit.material === e.target.value;
        });
        if (matchingUnits.length === 0) {
          setError(`This ${e.target.value} doesn't have unit price`);
        } else {
          setServices(matchingUnits);
          setError("");
        }
      }
    }
  };
  
  const handleService = (e) => {
    if (e.target.value === "") {
      setError("Please select a service");
      setUnits([]);
      setSelectedService("");
      setSelectedUnit("");
      setFormData((prev) => ({ ...prev, service: "" }));
    }
    if (e.target.value) {
      setFormData((prev) => ({ ...prev, service: e.target.value }));
      setSelectedService(e.target.value);
      if (unitPrice.length > 0 && Array.isArray(unitPrice)) {
        // Filter the unitPrice array based on formData values
        const matchingUnits = unitPrice.filter((unit) => {
          return (
            unit.type === formData.media &&
            unit.material === formData.material &&
            unit.service === e.target.value
          );
        });
        if (matchingUnits.length === 0) {
          setError(`This ${e.target.value} doesn't have unit price`);
        } else {
          setUnits(matchingUnits);
          setError("");
        }
      }
    }
  };
  
  const handleUnit = (e) => {
    if (e.target.value === "") {
      setError("Please select a unit");
      setSelectedUnit("");
      setFormData((prev) => ({ ...prev, unitName: "" }));
    }
    if (e.target.value) {
      setSelectedUnit(e.target.value);
      setFormData((prev) => ({ ...prev, unitName: e.target.value }));
  
      if (unitPrice.length > 0 && Array.isArray(unitPrice)) {
        // Filter the unitPrice array based on formData values
        const matchingUnits = unitPrice.filter((unit) => {
          return (
            unit.type === formData.media &&
            unit.material === formData.material &&
            unit.service === formData.service &&
            unit.unitName === e.target.value
          );
        });
  
        if (matchingUnits.length === 0) {
          setError(`This ${e.target.value} doesn't have unit price`);
        } else {
          setUnits(matchingUnits);
          setUnitValue(matchingUnits[0].unitValue);
          setUnitPrice(matchingUnits[0].price);
          setError("");
        }
      }
    }
  };

  
  const calculatePrice = useCallback(() => {
    let getUnitValue = 0;
    const inputString = unitValue;
    const numbersOnly = inputString.match(/\d+(\.\d+)?/g);

    if (numbersOnly) {
      const result = numbersOnly.map(Number);
      getUnitValue = parseFloat(result[0].toString()) * parseFloat(result[1].toString());
    } else {
      console.log("No numbers found in the string");
    }

    const basePrice = getUnitValue * parseFloat(unitPrice.toString());
    const totalPrice =
      formData.width * formData.height * formData.quantity * basePrice;
    setFormData((prev) => ({ ...prev, price: totalPrice.toString() }));
  }, [formData.width, formData.height, formData.quantity, unitValue, unitPrice]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const order = [
      {
        media: formData.media,
        material: formData.material,
        service: formData.service,
        unitName: formData.unitName,
        width: formData.width,
        height: formData.height,
        quantity: formData.quantity,
        price: formData.price,
        dueDate: formData.dueDate,
        message: formData.message,
        status: "Received",
      },
    ];

    setOrderId(orderId);

    const orderValues = {
      orderId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phone,
    };
    const newOrderData = { ...orderValues, order };

    dispatch(createOrder(newOrderData)).then((res) => {
      if (res.payload) {
        const message = "Order created successfully";
        toast(message);
        resetForm();
        navigate("/dashboard");
      }
    });
  };

  const resetForm = () => {
    setFormData({
      media: "",
      material: "",
      service: "",
      unitName: "",
      width: "",
      height: "",
      quantity: 1,
      price: "",
      dueDate: "",
      message: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="wrapper">
      <GoBack goback="/dashboard" />
      <section className="py-6 dark:bg-gray-800 dark:text-gray-50">
        <form onSubmit={handleSubmit}>
          <div className="grid max-w-6xl grid-cols-1 pe-3 mx-auto lg:pe-4 md:grid-cols-2 md:divide-x">
            <div className="py-6 md:py-0 md:pe-6">
              <h1 className="text-4xl font-bold mb-4">Order Info</h1>
              <div
                className="flex items-center gap-2 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium flex items-center">
                  ORDER ID <FaArrowRight />
                </span>{" "}
                {orderId}
              </div>
              {mediaError && (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span className="font-medium">Danger alert!</span>{" "}
                  {mediaError} Change a few things up and try submitting again.
                </div>
              )}
              <div className="grid md:grid-cols-2 md:gap-6">
                <div>
                  <label
                    htmlFor="medias"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Media type
                  </label>
                  <select
                    required
                    value={selectedMedia}
                    onChange={handleSelectedMedia}
                    id="medias"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Choose a media</option>
                    {printingData.map((media) => (
                      <option key={media.id} value={media.type}>
                        {media.type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="material"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Material
                  </label>
                  {selectedMedia && (
                    <select
                      value={selectedMaterial}
                      required
                      onChange={handleSelectedMaterial}
                      id="material"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Choose material</option>
                      {materials.map((material) => (
                        <option key={material.name} value={material.name}>
                          {material.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Services
                  </label>
                  {selectedMedia && selectedMaterial && (
                    <select
                      value={selectedService}
                      required
                      onChange={handleService}
                      id="service"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="">Choose service</option>
                      {services.map((service, index) => (
                        <option
                          key={`${service}-${index}`}
                          value={service.service}
                        >
                          {service.service}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="unit"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Units
                  </label>
                  {selectedMedia && selectedMaterial && selectedService && (
                    <select
                      value={selectedUnit}
                      required
                      onChange={handleUnit}
                      id="unit"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option>Choose units</option>
                      {units.map((unit) => (
                        <option key={unit.unitName} value={unit.unitName}>
                          {unit.unitName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="width"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Width
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, width: e.target.value })
                    }
                    value={formData.width}
                    type="number"
                    id="width"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="eg 10, 100"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="height"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Height
                  </label>
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    value={formData.height}
                    type="number"
                    id="height"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="eg 10, 100"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Quantity
                  </label>
                  <input
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    type="number"
                    id="quantity"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="eg 10, 100"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price
                  </label>
                  <input
                    readOnly={true}
                    value={formData.price}
                    type="number"
                    id="price"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                    placeholder="eg 10, 100"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="due_date"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Due date
                  </label>
                  <div className="relative max-w-sm w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input
                      onChange={(e) =>
                        setFormData({ ...formData, dueDate: e.target.value })
                      }
                      value={formData.dueDate}
                      id="due_date"
                      datepicker-buttons="true"
                      type="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select date"
                    />
                  </div>
                </div>
                <div>
                <label
                    htmlFor="note"
                    className="block mb-2 text-sm font-medium text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                  >
                    Note!
                  </label>
                <div
                  className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                  role="alert"
                >
                      The price is
                      calculated from  unit-name *
                      unit-value * unit-price * quantity * width * height
                </div>
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your message
                </label>
                <textarea
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  value={formData.message}
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                ></textarea>
              </div>
            </div>
            <div className="py-6 md:py-0 md:px-6">
              <h1 className="text-4xl font-bold mb-4">Customer Info</h1>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    value={formData.firstName}
                    type="text"
                    name="floating_first_name"
                    id="floating_first_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_first_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    First name
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    value={formData.lastName}
                    type="text"
                    name="floating_last_name"
                    id="floating_last_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_last_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Last name
                  </label>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    value={formData.phone}
                    type="tel"
                    pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                    name="floating_phone"
                    id="floating_phone"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_phone"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Phone (123-45-6789)
                  </label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    value={formData.email}
                    type="email"
                    name="floating_email"
                    id="floating_email"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_email"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Email address
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default OrderForm;
