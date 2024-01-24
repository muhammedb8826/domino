import { useEffect, useRef, useState } from "react";
import VariableProduct from "./VariableProduct";
import { GoBack } from "../common/GoBack";
import { getProducts } from "../../redux/features/user/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { createOrder } from "../../redux/features/user/orderSlice";
import ErroPage from "../common/ErroPage";

const AddOrder = () => {
  const { products } = useSelector((state: RootState) => state.product);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts()).then((res) => 
    setProduct(res.payload));
  }, [dispatch]);


  const [active, setActive] = useState("");
  const [product, setProduct] = useState([]);
  const [activeAddProductType, setAddActiveProductType] = useState(false);
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
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const getValue = () => {
    if (inputRef.current) {
      // Accessing the input value directly from the DOM element
      const value = inputRef.current.value;
      setAddActiveProductType(false);
      setProduct([...productType, { id: Date.now(), name: value }]);
    }
  };

  const handleProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActive(e.target.value);
    setVariableProduct([...variableProduct, e.target.value]);
  };

  const handleActiveAddProductType = () => {
    setAddActiveProductType(true);
  };

  const handleDeleteType = (element: string) => {
    const updatedVariableProduct = variableProduct.filter(
      (item) => item !== element
    );
    setVariableProduct(updatedVariableProduct);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(productValues.length === 0) return alert("Please select a product");
    else{
      const newOrderData = {...orderValues, order: productValues, productName: active}
      dispatch(createOrder(newOrderData));
      console.log(newOrderData);
    }
    
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
              <div className="max-lg:p-4 lg:flex items-end my-4 relative">
                <button
                  onClick={handleActiveAddProductType}
                  type="button"
                  className="border-2 text-sky-500 border-sky-500 lg:mx-4 p-1.5 px-4 rounded"
                >
                  Add new
                </button>
                <div className="flex flex-col flex-1 pe-4">
                  {activeAddProductType && (
                    <div className="flex justify-center p-4 flex-col gap-4 absolute left-0 h-56 top-0 bg-white rounded shadow-lg w-full">
                      <input
                        type="text"
                        ref={inputRef}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 "
                        placeholder="e.g. Banner or Poster"
                        required
                      />
                      <hr />
                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center me-2 mb-2"
                        >
                          Add new type
                        </button>
                        <button
                          onClick={() => setAddActiveProductType(false)}
                          type="button"
                          className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 text-center me-2 mb-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
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
                    className="max-md:1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
