import { useState } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { variableProducts } from "../../utils/data";

interface VariableProductProps {
  active: string;
}

interface AttributeValues {
  quantity: string[]; // Add explicit type for quantity property
  price: string[];
  note: string[];
}

const VariableProduct = ({ active }: VariableProductProps) => {
  const product = variableProducts.find((item) => item.name === active);

  const [attributeValues, setAttributeValues] = useState<AttributeValues>({
    quantity: [""],
    price: [""],
    note: [""],
  });

  const [optionsData, setOptionsData] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  const handleAddVariableProduct = () => {
    setAttributeValues((prevState) => ({
      quantity: [...prevState.quantity, ""],
      price: [...prevState.price, ""],
      note: [...prevState.note, ""],
    }));
  };

  const handleSelectedAttribute = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const selected = e.target.value;
    setDisabledOptions([...disabledOptions, selected]);
    const selectedIndex =
      e.target.options[e.target.selectedIndex].getAttribute("data-index");
    const filteredData = product?.attributes[selectedIndex];
    setOptionsData([...optionsData, filteredData]);

    // console.log(selectedIndex+"selected");
    console.log(index);

    // console.log(optionsData);
  };

  const handleDeleteVariableProducAttribute = (index: number) => {
    setAttributeValues((prevState) => {
      const updatedValues = { ...prevState };
      updatedValues.quantity.splice(index, 1);
      updatedValues.price.splice(index, 1);
      updatedValues.note.splice(index, 1);
      return updatedValues;
    });
  };

  const handleCollapse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const element = e.currentTarget
      .closest(".attribute-section")
      ?.querySelector(".attribute-field-section");
    if (element) {
      element.classList.toggle("hidden");
    }
  };

  const handleShow = (index: number) => {
    const element = document.getElementsByClassName("attribute-field-section")[
      index
    ];
    element.classList.remove("hidden");
    element.classList.toggle("block");
  };

  return (
    <>
      <p className="description border p-4 m-4">
        Add products to see their attributes and values. Attributes are used to
        define the variations of your product
      </p>
      <div>
        <button
          onClick={handleAddVariableProduct}
          type="button"
          className="border-2 text-xs text-sky-500 border-sky-500 m-4 mt-0 p-1.5 px-4 rounded"
        >
          Add new
        </button>
      </div>
      <hr />

      {/* variable product section */}

      {attributeValues.quantity.map((_, index) => (
        <div className="attribute-section" key={index}>
          <div
            onClick={() => handleShow(index)}
            className="hover:bg-gray-200 flex justify-between items-center px-4 py-2"
          >
            <p className="font-bold text-gray-400">
              {product?.name} Attribute {index + 1}
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-red-600"
                onClick={() => handleDeleteVariableProducAttribute(index)}
              >
                Remove
              </button>
              <button
                onClick={(e) => handleCollapse(e)}
                title="collapse"
                type="button"
                className="text-black rounded p-1.5 border border-black"
              >
                <VscCollapseAll />
              </button>
            </div>
          </div>
          <hr />
          <div className="attribute-field-section md:grid grid-cols-3 gap-4 p-4">
            <div className="col-span-1 mb-2 md:mb-0">
              <div className="flex items-center gap-2">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
                  >
                    Quantity:
                  </label>

                  <input
                    name="quantity"
                    type="number"
                    id="quantity"
                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
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
                    name="price"
                    type="number"
                    id="price"
                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
                >
                  Note:
                </label>
                <textarea
                  name="note"
                  id="note"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Enter options to choose from e.g 2 or 3 "
                ></textarea>
              </div>
            </div>
            <div className="col-span-2">
              <select
                id="attributes"
                onChange={(e) => handleSelectedAttribute(e, index)}
                title="attributes"
                name={`attributes-${index}`}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
              >
                <option value="">Choose attributes</option>
                {product
                  ? product.attributes.map((attribute, index) => (
                      <option
                        value={attribute.name}
                        key={attribute.name}
                        disabled={disabledOptions.includes(attribute.name)}
                        data-index={index}
                      >
                        {attribute.name}
                      </option>
                    ))
                  : null}
              </select>

              {optionsData && (
                <div>
                  {optionsData.map((item) => (
                    <fieldset
                      className="border border-sky-500 p-4 mb-2"
                      key={item.name}
                    >
                      <legend className="bg-sky-500 text-white border px-2">
                        Choose your favorite {item.name}
                      </legend>

                      {item.name==="width" &&
                     <div>
                     <label
                       htmlFor="width"
                       className="mt-2 block mb-2 text-sm font-medium text-gray-900 "
                     >
                       Width
                     </label>
       
                     <input
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
                       name="height"
                       type="number"
                       id="height"
                       className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                       placeholder="e.g. 10 or 50 in cm..."
                       required
                     />
                   </div>  
                    }


                      {item.options.map((option, optionIndex) => (
                        <div
                          className="flex items-center mb-4"
                          key={optionIndex}
                        >
                          <input
                            id={`radio-${optionIndex}`}
                            type="radio"
                            value="{optionItem}"
                            name={`default-radio-${optionIndex}`}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`radio-${optionIndex}`}
                            className="ms-2 text-sm font-medium text-gray-900"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </fieldset>
                  ))}
                </div>
              )}
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
