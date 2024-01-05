import { useRef, useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";

import SimpleProductPage from "./SimpleProductPage";
import VariableProduct from "./VariableProduct";

const AddOrder = () => {
  const [active, setActive] = useState("");
  const [productType, setProductType] = useState([
    "Banner",
    "Poster",
    "T-shirt",
    "Sticker",
  ]);

  const [simpleOrVariable, setSimpleOrVariable] = useState("simple-product");

  const inputRef = useRef<HTMLInputElement>(null);
  const getValue = () => {
    if (inputRef.current) {
      // Accessing the input value directly from the DOM element
      const value = inputRef.current.value;
      setAddActiveProductType(false);
      setProductType([...productType, value]);
    }
  };

  const [activeAddProductType, setAddActiveProductType] = useState(false);

  const [productTypeValue, setProductTypeValue] = useState<string[]>([]);

  const handleProductType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActive(e.target.value);
    setProductTypeValue([...productTypeValue, e.target.value]);
  };

  const handleActiveAddProductType = () => {
    setAddActiveProductType(true);
  };

  const handleDeleteType = (element: string) => {
    const filtered = productTypeValue.filter((item) => item !== element);
    setProductTypeValue(filtered);
  };

  const handleSimpleOrVariable = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSimpleOrVariable(e.target.value);
  };

  return (
    <div className="wrapper p-4">
      <h1 className="text-2xl font-bold">Add Order</h1>

      <form className="py-4">
        <div className="grid gap-6 mb-6 md:grid-cols-4">
          <div>
            <label
              htmlFor="first_name"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              First name
            </label>
            <input
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
              type="tel"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              placeholder="123-45-678"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
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
            <IoRemoveOutline />
            <select
              onChange={handleSimpleOrVariable}
              value={simpleOrVariable}
              title="Product-type"
              name="productType"
              id="productType"
              className="w-full sm:w-1/2 md:1/4  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
            >
              <option value="simple-product">Simple product</option>
              <option value="variable-product">Variable product</option>
            </select>
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
                          onClick={getValue}
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
                      value={productTypeValue.map((item) => item)}
                      onChange={handleProductType}
                      id="product"
                      className="max-md:1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="">Add existing</option>
                      {productType.map((item) => (
                        <option value={item}>{item}</option>
                      ))}
                    </select>
                </div>
              </div>
              <hr />
              {productTypeValue.length > 0 &&
                productTypeValue.map((product) => (
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
              {simpleOrVariable === "simple-product" ? (
                <SimpleProductPage active={active} />
              ) : (
                <VariableProduct />
              )}
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
