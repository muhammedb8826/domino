import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { useEffect, useState } from "react";
import { GoBack } from "../common/GoBack";
import { FaArrowRight, FaEdit } from "react-icons/fa";
import { createOrder, getOrders, getOrdersById, updateOrder } from "../../redux/features/order/orderSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
    const { id } = useParams<{ id: string }>();
  
  const { orders, isLoading, error } = useSelector(
    (state) => state.order
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getOrders()).then((res) => {
        if (res.payload) {
console.log(res.payload);

            // dispatch(getOrdersById(id));
        }
    }
    );
  }, [dispatch, id]);
 
  const [orderData, setOrderData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    order: [],
    productName: "",
    status: "",
    createdAt: "",
  });


const order = orders.find((order) => order.orderId === id);
    useEffect(() => {
        if (order) {
            setOrderData(order);
        }
        }
    , [order]);

    console.log(orderData);
    
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
           e.preventDefault();
           dispatch(updateOrder(orderData)).then((res) => {
                if (res.payload) {
                const message = "Order updated successfully";
                toast(message);
                navigate("/dashboard");
                }
            }); 
    };
  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="wrapper">
      <GoBack goback="/dashboard" />
      <section className="py-6 dark:bg-gray-800 dark:text-gray-50">
              <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">Edit order <span className="text-blue-400"><FaEdit /></span></h1>
        <form onSubmit={handleSubmit}>
          <div className="grid max-w-6xl grid-cols-1 pe-3 mx-auto lg:pe-4 md:grid-cols-2 md:divide-x">
            <div className="py-6 md:py-0 md:pe-6">
              <div
                className="flex items-center gap-2 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
                role="alert"
              >
                <span className="font-medium flex items-center">
                  ORDER ID <FaArrowRight />
                </span>{" "}
                {id}
              </div>
              {/* {mediaError && (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span className="font-medium">Danger alert!</span>{" "}
                  {mediaError} Change a few things up and try submitting again.
                </div>
              )} */}
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
                    value={orderData.order.map((order) => order.media)}
                    id="medias"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    {orderData.order.map((order) => 
                    <option value={order.media}>{order.media}</option>)}
                   
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="material"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Material
                  </label>
                  <select
                    required
                
                    id="material"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    {orderData.order.map((material) => 
                    <option value={material.material}>{material.material}</option>)}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Services
                  </label>
                  <select
                    required
                    id="service"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    {orderData.order.map((service) => 
                    <option value={service.service}>{service.service}</option>)}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="unit"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select Units
                  </label>
                  <select
                    required
                    id="unit"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    {orderData.order.map((unit) => 
                    <option value={unit.unitName}>{unit.unitName}</option>)}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="width"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Width
                  </label>
                  <input
                  value={orderData.order.map((width) => width.width)}
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
                    value={orderData.order.map((height) => height.height)}
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
                    value={orderData.order.map((quantity) => quantity.quantity)}
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
                    value={orderData.order.map((price) => price.price)}
                    readOnly={true}
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
                    value={orderData.order.map((dueDate) => dueDate.dueDate)}
                      id="due_date"
                      datepicker-buttons="true"
                      type="date"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select date"
                    />
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
                value={orderData.order.map((message) => message.message)}
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                ></textarea>
              </div>
            </div>
            <div className="py-6 md:py-0 md:px-6">
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    value={orderData.firstName}
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
                  value={orderData.lastName}
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
                    value={orderData.phoneNumber}
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
                    value={orderData.email}
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

export default OrderDetails;
