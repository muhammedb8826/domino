import { useState } from "react";
import { CgAttribution } from "react-icons/cg";
import { PiGridFour } from "react-icons/pi";

const AddOrder = () => {
  const [count, setCount] = useState(1);
  const [active, setActive] = useState("");

  const handleAddAttributes = () => {
    setCount(count + 1);
  };

  const data = [];

  for (let i = 0; i < count; i++) {
    const id = `attribute-${i}`;
    data.push(id);
  }

  const handleDelete = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("hidden");
    }
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

        <div className="border mb-6">
          <p className="p-2 py-4">Product data</p>
          <hr />

          <div className="flex">
            <div className="attributes w-1/4 bg-slate-50 flex flex-col text-sky-500 border-r">
              <button
                onClick={() => setActive("attributes")}
                type="button"
                className={`${
                  active === "attributes" ? "bg-gray-200 text-gray-600" : ""
                } p-2 text-left indent-2 border-b flex items-center gap-2`}
              >
                <span>
                  <CgAttribution />
                </span>{" "}
                Attributes
              </button>
              <button
                onClick={() => setActive("variations")}
                type="button"
                className={`${
                  active === "variations" ? "bg-gray-200 text-gray-600" : ""
                } p-2 text-left indent-2 border-b flex items-center gap-2`}
              >
                <span>
                  <PiGridFour />
                </span>{" "}
                variations
              </button>
            </div>

            {/* attributes */}

            {active === "attributes" && (
              <div className="w-[75%]">
                <p className="description border p-4 m-4">
                  Add attributes to your product. Attributes are used to define
                  the variations of your product. For example, if are adding a
                  banner, you can add size and quantity as a value. You can also
                  add new attributes or use existing ones.
                </p>
                <div className="flex items-center">
                  <button
                    onClick={handleAddAttributes}
                    type="button"
                    className="border-2 text-sky-500 border-sky-500 m-4 p-1.5 px-4 rounded"
                  >
                    Add new
                  </button>
                  <select
                    title="attributes"
                    name="attributes"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5"
                  >
                    <option selected>Add existing</option>
                    <option value="banner">Banner</option>
                    <option value="poster">Poster</option>
                    <option value="t-shirt">T-shirt</option>
                    <option value="sticker">Sticker</option>
                  </select>
                </div>
                <hr />

                {/* New Attribute section */}

                {data.map((item) => (
                  <div className={`add-attribute-section`} key={item} id={item}>
                    <div className="flex justify-between p-4">
                      <p>New attribute</p>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <hr />
                    <div className="grid gap-6 mb-6 md:grid-cols-2 p-4">
                      <div>
                        <label
                          htmlFor="attribute_name"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Name:
                        </label>
                        <input
                          type="text"
                          id="attribute_name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          placeholder="e.g. Banner or Poster"
                          required
                        />
                        <div className="flex items-center mt-4">
                          <input
                            checked
                            id="checked-checkbox"
                            type="checkbox"
                            value=""
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor="checked-checkbox"
                            className="ms-2 text-sm font-medium text-gray-900"
                          >
                            Used for variations
                          </label>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="value"
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          Value(s):
                        </label>
                        <textarea
                          id="value"
                          rows={4}
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                          placeholder="Enter options to choose from e.g 2 or 3 "
                        ></textarea>
                      </div>
                    </div>
                  </div>
                ))}

                <hr />

                <button
                  type="button"
                  className="p-y m-4 text-white bg-blue-400 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled
                >
                  Save attributes
                </button>
              </div>
            )}

            {/* variations */}

            {active === "variations" && (
              <div className="w-[75%] min-h-[300px] flex items-center">
                <p className="description border p-4 m-4">
                  Add some attributes in the Attributes tab to generate
                  variations for your product. Make sure to check the "Used for
                  variations" checkbox for the attributes you want to use.
                </p>
              </div>
            )}
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
