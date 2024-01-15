import { useState } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { simpleProducts } from "../../utils/data";

interface Attribute {
  quantity: string;
  width: string;
  height: string;
  price: string;
  note: string;
  [key: string]: string;
}

interface SimpleProductPageProps {
  active: string;
}

const SimpleProductPage = ({ active }: SimpleProductPageProps) => {
  const [attributes, setAttributes] = useState([
    {
      quantity: "",
      width: "",
      height: "",
      price: "",
      note: "",
    },
  ]);

  const [simpleProduct, setSimpleProduct] = useState(simpleProducts);

  console.log(simpleProduct);

  const handleCollapse = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const element = document.getElementsByClassName("attribute-field-section")[
      index
    ];
    element.classList.remove("block");
    element.classList.toggle("hidden");
  };

  const handleShow = (index: number) => {
    const element = document.getElementsByClassName("attribute-field-section")[
      index
    ];
    element.classList.remove("hidden");
    element.classList.toggle("block");
  };

  const handleAddSimpleProduct = () => {
    setAttributes([
      ...attributes,
      { quantity: "", width: "", height: "", price: "", note: "" },
    ]);
  };

  const mergeAttributes = () => {
    const name = active;

    // Find the index of the product in simpleProducts array
    const productIndex = simpleProducts.findIndex(
      (product) => product.name === name
    );

    // If the product is found
    if (productIndex !== -1) {
      // Create a copy of the product
      const updatedSimpleProduct = [...simpleProducts];

      // Update the attributes property of the found product
      updatedSimpleProduct[productIndex] = {
        ...updatedSimpleProduct[productIndex],
        attributes,
      };
      setSimpleProduct(updatedSimpleProduct);
    }
  };

  const handleDeleteSimpleProducAttribute = (index: number) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const getTotal = (property: string) => {
    return attributes.reduce((acc, attribute: Attribute) => {
      return acc + parseFloat(attribute[property] || "0");
    }, 0);
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
          className="border-2 text-xs text-sky-500 border-sky-500 m-4 mt-0 p-1.5 px-4 rounded"
        >
          Add new
        </button>
      </div>
      <hr />

      {/* simple product section */}

      {attributes.map((_, index) => (
        <div className="attribute-section" key={index}>
          <div
            onClick={() => handleShow(index)}
            className="hover:cursor-pointer hover:bg-gray-200 flex justify-between items-center px-4 py-2"
          >
            <p
              className={`${
                active ? "font-bold text-black" : "font-bold text-gray-400"
              }`}
            >
              {active ? `${active}'s` : ""} Attribute {index + 1}
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-red-600"
                onClick={() => handleDeleteSimpleProducAttribute(index)}
              >
                Remove
              </button>
              <button
                onClick={(e) => handleCollapse(e, index)}
                title="collapse"
                type="button"
                className="text-black rounded p-1.5 border border-black"
              >
                <VscCollapseAll />
              </button>
            </div>
          </div>
          <hr />
          <div className="attribute-field-section grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <div>
              <label
                htmlFor="quantity"
                className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
              >
                Quantity:
              </label>

              <input
                onChange={(e) => {
                  const updatedAttributes = [...attributes];
                  updatedAttributes[index].quantity = e.target.value;
                  setAttributes(updatedAttributes);
                  mergeAttributes();
                }}
                name="quantity"
                type="number"
                id="quantity"
                className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                placeholder="e.g. 2 or 3..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="size"
                className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
              >
                Dimensions:
              </label>

              <label
                htmlFor="width"
                className="mt-2 block mb-2 text-sm font-medium text-gray-900 "
              >
                Width
              </label>

              <input
                onChange={(e) => {
                  const updatedAttributes = [...attributes];
                  updatedAttributes[index].width = e.target.value;
                  setAttributes(updatedAttributes);
                  mergeAttributes();
                }}
                name="width"
                type="number"
                id="width"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
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
                onChange={(e) => {
                  const updatedAttributes = [...attributes];
                  updatedAttributes[index].height = e.target.value;
                  setAttributes(updatedAttributes);
                  mergeAttributes();
                }}
                name="height"
                type="number"
                id="height"
                className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                placeholder="e.g. 10 or 50 in cm..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
              >
                Price:
              </label>

              <input
                onChange={(e) => {
                  const updatedAttributes = [...attributes];
                  updatedAttributes[index].price = e.target.value;
                  setAttributes(updatedAttributes);
                  mergeAttributes();
                }}
                name="price"
                type="number"
                id="price"
                className="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
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
                onChange={(e) => {
                  const updatedAttributes = [...attributes];
                  updatedAttributes[index].note = e.target.value;
                  setAttributes(updatedAttributes);
                  mergeAttributes();
                }}
                name="note"
                id="note"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Enter options to choose from e.g 2 or 3 "
              ></textarea>
            </div>
          </div>
        </div>
      ))}

      <hr />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <p>Total quantity: {getTotal("quantity")} </p>
        <p>Total width: {getTotal("width")}</p>
        <p>Total height: {getTotal("height")}</p>
        <p>Total price: {getTotal("price")}</p>
      </div>
    </>
  );
};

export default SimpleProductPage;
