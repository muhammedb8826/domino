import { useState } from "react";

const VariableProduct = () => {
  const [attributes, setAttributes] = useState<string>("");
  const [count, setCount] = useState(1);

  const handleChangeAttributes = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAttributes(e.target.value);
  };

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
    <>
      <p className="description border p-4 m-4">
        Add products to see their attributes and values. Attributes are used to
        define the variations of your product. For example, if you are adding a
        banner, you can add size and quantity as a value. You can also add new
        attributes or use existing ones.
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
          id="attributes"
          onChange={handleChangeAttributes}
          title="attributes"
          name="attributes"
          value={attributes}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4 p-2.5"
        >
          <option value="">Add existing</option>
          <option value="Size">Size</option>
          <option value="Quantity">Quantity</option>
          <option value="Price">Price</option>
          <option value="Height">Height</option>
          <option value="width">width</option>
        </select>
      </div>
      <hr />

      {/* New Attribute section */}

      {data.map((item) => (
        <div className={`add-attribute-section`} key={item} id={item}>
          <div className="flex justify-between p-4">
            {attributes ? (
              <p className="font-bold">{attributes}</p>
            ) : (
              <p className="font-bold text-gray-300">New Attribute</p>
            )}
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
              {attributes ? (
                <p className="font-bold">{attributes}</p>
              ) : (
                <input
                  type="text"
                  id="attribute_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="e.g. Banner or Poster"
                  required
                />
              )}
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
    </>
  );
};

export default VariableProduct;
