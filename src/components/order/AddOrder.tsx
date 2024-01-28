import { useEffect, useRef, useState } from "react";
import VariableProduct from "./VariableProduct";
import { GoBack } from "../common/GoBack";
import { getProducts } from "../../redux/features/product/productSlice";
import { useDispatch} from "react-redux";

import { createOrder } from "../../redux/features/order/orderSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const AddOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProducts()).then((res) => 
    setProduct(res.payload));
  }, [dispatch]);


  const [active, setActive] = useState("");
  const [product, setProduct] = useState([]);
  const [variableProduct, setVariableProduct] = useState<
    string[]
  >([]);
  const [productValues, setProductValues] = useState<string[]>([]);
  const [orderValues, setOrderValues] = useState<string[]>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    order: [],
    productName: "",
    status: "Received",
  });

  const handleProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActive(e.target.value);
    setVariableProduct([...variableProduct, e.target.value]);
  };

  const handleDeleteType = (element: string) => {
    const updatedVariableProduct = variableProduct.filter(
      (item) => item !== element
    );
    setVariableProduct(updatedVariableProduct);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(productValues.length === 0) return alert("Please save a attributes of product");
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() + 1);

      const newOrderData = {...orderValues, order: productValues, productName: active, createdAt, status: "Received"}
      dispatch(createOrder(newOrderData)).then((res) => {
        if(res.payload) {
          const message = "Order created successfully"
          toast(message)
          resetForm();
          navigate("/dashboard");
        }
      })
  };

  const resetForm = () => {
    setOrderValues({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      order: [],
      productName: "",
    });
    setActive("");
    setVariableProduct([]);
    setProductValues([]);
  };

  return (
    <div className="wrapper p-4">
      <GoBack goback="/dashboard" />
      <h1 className="text-2xl font-bold">Add Order</h1>

      <form className="py-4" onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6 md:grid-cols-4">
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              First name
            </label>
            <input
              onChange={(e) =>
                setOrderValues({
                  ...orderValues,
                  firstName: e.target.value,
                })
              }
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="John"
              required
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Last name
            </label>
            <input
              onChange={(e) =>
                setOrderValues({
                  ...orderValues,
                  lastName: e.target.value,
                })
              }
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="Doe"
              required
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Phone number
            </label>
            <input
              onChange={(e) =>
                setOrderValues({
                  ...orderValues,
                  phoneNumber: e.target.value,
                })
              }
              type="tel"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="123-456-789"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}"
              required
            />
          </div>

          <div className="mb-2">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <input
              onChange={(e) =>
                setOrderValues({
                  ...orderValues,
                  email: e.target.value,
                })
              }
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="john.doe@company.com"
              required
            />
          </div>
        </div>

        <div className="border mb-6">
          <div className="md:flex items-center p-4 gap-2">
            <label
              htmlFor="productType"
              className="text-sm font-medium text-gray-900 "
            >
              Product type
            </label>
          </div>
          <hr />

          <div className="md:flex">
            <div className="attributes w-full md:w-1/4 bg-slate-50 flex flex-col text-sky-500 border-r">
              <div className="relative">
                <div className="flex flex-col flex-1 p-4">
                  <label
                    htmlFor="product"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Select a product
                  </label>
                  <select
                    value={active}
                    onChange={handleProduct}
                    id="product"
                    required
                    className="max-md:1/4 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  >
                    <option value="">Add existing</option>
                    {product.map((item) => (
                      <option value={item.name} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <hr />
              {variableProduct.length > 0 &&
                variableProduct.map((product) => (
                  <div
                    key={product}
                    className={`${
                      product === active ? "bg-gray-200" : ""
                    } gap-4 flex justify-between items-center border-b-2`}
                  >
                    <button
                      type="button"
                      onClick={() => setActive(product)}
                      className="p-4 py-2 flex flex-1"
                    >
                      {product}{" "}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteType(product)}
                      className="text-red-600 p-4 py-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
            </div>

            {/* attributes */}

            <div className="w-full md:w-[75%] max-h-screen overflow-hidden overflow-y-scroll">
              {
                <VariableProduct
                  setProductValues={setProductValues}
                  active={active}
                />
              }
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
