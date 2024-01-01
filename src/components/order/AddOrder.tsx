import { useState } from "react";

const AddOrder = () => {
  const [quantity, setQuantity] = useState(0);
  const data = [];
  for (let i = 0; i < quantity; i++) {
    data.push(
      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <div>
          <label
            htmlFor="height"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            height
          </label>
          <input
            type="number"
            id="height"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="height"
            required
          />
        </div>

        <div>
          <label
            htmlFor="width"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            width
          </label>
          <input
            type="number"
            id="width"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="width"
            required
          />
        </div>

        <div>

        <label
          htmlFor="quantity"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Select a quatity for each type
        </label>
        <select
          id="quantity"
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full block p-2.5 "
        >
          <option selected>Choose a quantity</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        </div>
      </div>
    );
  }
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  return (
    <div className="wrapper p-4">
      <h1 className="text-2xl font-bold">Add Order</h1>

      <form className="py-4">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
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

        <label
          htmlFor="type"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Select a type
        </label>
        <select
          id="type"
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        >
          <option selected>Choose a type</option>
          <option value="banner">Banner</option>
          <option value="t-shirt">T-shirt</option>
          <option value="mug">Mug</option>
          <option value="postcard">Postcard</option>
        </select>

        <label
          htmlFor="type-quantity"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Select a quatity for each type
        </label>
        <select
          onChange={handleChange}
          id="type-quantity"
          className="mb-6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-1/4 block p-2.5 "
        >
          <option selected>Choose a quantity</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        {data.length > 0 && data.map((item) => item)}

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
