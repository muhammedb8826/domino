import { useState } from "react";
import { VscCollapseAll } from "react-icons/vsc";

const SimpleProductPage = () => {

  const [simpleProductCount, setSimpleProductCount] = useState(1);
  const handleAddSimpleProduct = () => {
    setSimpleProductCount(simpleProductCount + 1);
  };
  const simpleProduct = [];
  for (let i = 0; i < simpleProductCount; i++) {
    const id = `simple-product-${i}`;
    simpleProduct.push(id);
  }
  const handleDeleteSimpleProducAttribute = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add("hidden");
    }
  };
  return (
    <>
      <p className="description border p-4 m-4">
        Add values to the existing attributes listed below.
      </p>

      <div>
        <button
          onClick={handleAddSimpleProduct}
          type="button"
          className="border-2 text-sky-500 border-sky-500 m-4 p-1.5 px-4 rounded"
        >
          Add new
        </button>
      </div>
      <hr />

      {/* simple product secticon */}

      {simpleProduct.map((item) => (
        <div className="attribute-section" id={item} key={item}>
          <div className="flex justify-between items-center p-4">
            <p className="font-bold text-gray-400">
              Attribute({simpleProductCount})
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-red-600"
                onClick={() => handleDeleteSimpleProducAttribute(item)}
              >
                Remove
              </button>
              <button
                title="collapse"
                type="button"
                className="text-black rounded p-1.5"
              >
                <VscCollapseAll />
              </button>
            </div>
          </div>
          <hr />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <div>
              <label
                htmlFor="quantity"
                className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
              >
                Quantity
              </label>

              <input
                type="number"
                id="quantity"
                className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="e.g. 2 or 3..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="size"
                className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
              >
                Size
              </label>

              <label
                htmlFor="width"
                className="mt-4 block mb-2 text-sm font-medium text-gray-900 "
              >
                Width
              </label>

              <input
                type="number"
                id="width"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="e.g. 10 or 50 in cm..."
                required
              />
              <label
                htmlFor="height"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Height
              </label>

              <input
                type="number"
                id="height"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="e.g. 10 or 50 in cm..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
              >
                Price
              </label>

              <input
                type="number"
                id="price"
                className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder="e.g. 500 or 1000..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="note"
                className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
              >
                Note:
              </label>
              <textarea
                id="note"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Enter options to choose from e.g 2 or 3 "
              ></textarea>
            </div>
          </div>
        </div>
      ))}

      {/* simple product secticon */}
      <hr />
      <button
        type="button"
        className="p-y m-4 text-white bg-blue-400 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        disabled
      >
        Save attributes
      </button>

      <hr />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <p>Total quantity: </p>
        <p>Total width: </p>
        <p>Total height: </p>
        <p>Total price: </p>
      </div>
    </>
  );
};

export default SimpleProductPage;
