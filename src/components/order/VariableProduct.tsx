import { useState } from "react";
import {
  tShirtAttributes,
  tShirtValues,
  bannerValues,
  BannerAttributes,
} from "../../utils/data";
import { VscCollapseAll } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";

interface VariableProductProps {
  active: string;
}

interface AttributeValues {
  quantity: string[]; // Add explicit type for quantity property
  price: string[];
  note: string[];
}

const VariableProduct = ({ active }: VariableProductProps) => {
  const [attributeValues, setAttributeValues] =
    useState<AttributeValues>({
      quantity: [""],
      price: [""],
      note: [""],
    });

  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  const [values, setValues] = useState<string[]>([""]);

  const handleAddVariableProduct = () => {
    setAttributeValues((prevState) => ({
      quantity: [...prevState.quantity, ""],
      price: [...prevState.price, ""],
      note: [...prevState.note, ""],
    }));
  };

  const handleSelectedAttribute = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAttribute = e.target.value;
    setValues([...values, selectedAttribute]);
    setDisabledOptions([...disabledOptions, selectedAttribute]);
  };

  console.log();
  

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
            <p className="font-bold text-gray-400">Attribute {index + 1}</p>
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
                onChange={handleSelectedAttribute}
                title="attributes"
                name="attributes"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4"
              >
                <option value="">Choose attributes</option>
                {active === "T-shirt"
                  ? tShirtAttributes.map((item) => (
                      <option
                        value={item}
                        key={item}
                        disabled={disabledOptions.includes(item)}
                      >
                        {item}
                      </option>
                    ))
                  : null}

                  
                {active === "Banner"
                  ? BannerAttributes.map((item) => (
                      <option
                        value={item}
                        key={item}
                        disabled={disabledOptions.includes(item)}
                      >
                        {item}
                      </option>
                    ))
                  : null}
              </select>

              {active === "T-shirt" ? (
                <div>
                  {values.map((item, valueIndex) => (
                    <fieldset className="border border-sky-500 p-4" key={item}>
                      <legend className="bg-sky-500 text-white border px-2">
                        Choose your favorite {item}
                      </legend>
                      {tShirtValues[item].map(
                        (optionItem: string, index: number) => (
                          <div className="flex items-center mb-4" key={index}>
                            <input
                              id={`radio-${valueIndex}-${index}`} // Updated unique id
                              type="radio"
                              value={optionItem}
                              name={`default-radio-${valueIndex}`} // Unique name for each set
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`radio-${valueIndex}-${index}`}
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              {optionItem}
                            </label>
                          </div>
                        )
                      )}
                    </fieldset>
                  ))}
                </div>
              ) : null}
{/* 
              {active === "Banner" ? (
                <div>
                  {values.map((item, valueIndex) => (
                    <fieldset className="border border-sky-500 p-4" key={item}>
                      <legend className="bg-sky-500 text-white border px-2">
                        Choose your favorite {item}
                      </legend>
                      {bannerValues[item].map(
                        (optionItem: string, index: number) => (
                          <div className="flex items-center mb-4" key={index}>
                            <input
                              id={`radio-${valueIndex}-${index}`} // Updated unique id
                              type="radio"
                              value={optionItem}
                              name={`default-radio-${valueIndex}`} // Unique name for each set
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            />
                            <label
                              htmlFor={`radio-${valueIndex}-${index}`}
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              {optionItem}
                            </label>
                          </div>
                        )
                      )}
                    </fieldset>
                  ))}
                </div>
              ) : null}  */}
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
