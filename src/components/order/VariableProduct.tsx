import { useEffect, useState } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/features/product/productSlice";
import { v4 as uuidv4 } from "uuid";

interface VariableProductProps {
  active: string;
}

const initialFormState = {
  id: uuidv4(),
  quantity: "",
  description: "",
  price: "",
  attributes: [],
};

const VariableProduct = ({
  setProductValues,
  active,
}: VariableProductProps) => {
  const { products } = useSelector((state) => state.product);
  const product = products.find((product) => product.name === active);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const [optionsData, setOptionsData] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [formValues, setFormValues] = useState([initialFormState]);

  useEffect(() => {
    // Reset form values, including attributes array
    setFormValues([
      {
        ...initialFormState,
        attributes: [],
      },
    ]);
    setOptionsData([]);
    setDisabledOptions([]);
  }, [active]);

  const handleAddVariableProduct = () => {
    setFormValues([...formValues, initialFormState]);
  };

  const getTotalPrice = () => {
    return formValues.reduce((acc, curr) => acc + Number(curr.price), 0);
  };

  const getTotalQuantity = () => {
    return formValues.reduce((acc, curr) => acc + Number(curr.quantity), 0);
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
    setOptionsData([filteredData, ...optionsData]);

    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      const selectedAttribute = updatedFormValues[index].attributes.find(
        (attr) => attr.name === filteredData.name
      );

      if (selectedAttribute) {
        // Update existing attribute
        selectedAttribute.options = filteredData.options;
      } else {
        // Add a new attribute
        updatedFormValues[index].attributes.push({
          name: filteredData.name,
          options: filteredData.options,
        });
      }

      return updatedFormValues;
    });
  };

  console.log(formValues);

  const handleDeleteProducAttribute = (index: number) => {
    setFormValues((prevFormValues) => {
      const updatedFormValues = [...prevFormValues];
      updatedFormValues.splice(index, 1);
      return updatedFormValues;
    });
  };

  const handleCollapse = (e, index) => {
    const elements = document.getElementsByClassName("attribute-field-section");

    // Check if the index is within the valid range
    if (index >= 0 && index < elements.length) {
      elements[index].classList.toggle("hidden");
    }
  };

  const handleShow = (index: number) => {
    const element = document.getElementsByClassName("attribute-field-section");
    for (let i = 0; i < element.length; i++) {
      if (i === index) {
        element[i].classList.remove("hidden");
        element[i].classList.toggle("block");
      }
    }
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

      {formValues.map((formValue, index) => (
        <div className="attribute-section" key={index}>
          <div
            onClick={() => handleShow(index)}
            className="hover:bg-gray-200 flex justify-between items-center px-4 py-2"
          >
            <p
              className={`font-bold ${
                product ? "text-black" : "text-gray-400"
              }`}
            >
              {product?.name} Attribute {index + 1}
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                className="text-red-600"
                onClick={() => handleDeleteProducAttribute(index)}
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
                    onChange={(e) =>
                      setFormValues((prevFormValues) => {
                        const updatedFormValues = [...prevFormValues];
                        updatedFormValues[index] = {
                          ...updatedFormValues[index],
                          quantity: e.target.value,
                        };
                        return updatedFormValues;
                      })
                    }
                    value={formValue.quantity}
                    required
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
                    onChange={(e) =>
                      setFormValues((prevFormValues) => {
                        const updatedFormValues = [...prevFormValues];
                        updatedFormValues[index] = {
                          ...updatedFormValues[index],
                          price: e.target.value,
                        };
                        return updatedFormValues;
                      })
                    }
                    value={formValue.price}
                    required
                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 border-b border-black pb-2"
                >
                  Description:
                </label>
                <textarea
                  name="description"
                  id="note"
                  rows={4}
                  onChange={(e) =>
                    setFormValues((prevFormValues) => {
                      const updatedFormValues = [...prevFormValues];
                      updatedFormValues[index] = {
                        ...updatedFormValues[index],
                        description: e.target.value,
                      };
                      return updatedFormValues;
                    })
                  }
                  value={formValue.description}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Enter options to choose from e.g 2 or 3 "
                  required
                ></textarea>
              </div>
            </div>
            <div className="col-span-2">
              <select
                id="attributes"
                onChange={(e) => handleSelectedAttribute(e, index)}
                title="attributes"
                name={`attributes-${index}`}
                required
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

                      {item.name === "dimensions" && (
                        <div className="flex items-center justify-between">
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
                              onChange={(e) =>
                                setFormValues((prevFormValues) => {
                                  const updatedFormValues = [...prevFormValues];
                                  const attributeIndex = updatedFormValues[
                                    index
                                  ].attributes.findIndex(
                                    (attr) => attr.name === e.target.name
                                  );

                                  if (attributeIndex !== -1) {
                                    // Update existing attribute
                                    updatedFormValues[index].attributes[
                                      attributeIndex
                                    ].options = e.target.value
                                      .split(",")
                                      .map((option) => option.trim());
                                  } else {
                                    // Add a new attribute
                                    updatedFormValues[index].attributes.push({
                                      name: e.target.name,
                                      options: e.target.value
                                        .split(",")
                                        .map((option) => option.trim()),
                                    });
                                  }

                                  return updatedFormValues;
                                })
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                              placeholder="e.g. 10 or 50 in cm..."
                              required
                            />
                          </div>
                          <div>
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
                              onChange={(e) =>
                                setFormValues((prevFormValues) => {
                                  const updatedFormValues = [...prevFormValues];
                                  const attributeIndex = updatedFormValues[
                                    index
                                  ].attributes.findIndex(
                                    (attr) => attr.name === e.target.name
                                  );

                                  if (attributeIndex !== -1) {
                                    // Update existing attribute
                                    updatedFormValues[index].attributes[
                                      attributeIndex
                                    ].options = e.target.value
                                      .split(",")
                                      .map((option) => option.trim());
                                  } else {
                                    // Add a new attribute
                                    updatedFormValues[index].attributes.push({
                                      name: e.target.name,
                                      options: e.target.value
                                        .split(",")
                                        .map((option) => option.trim()),
                                    });
                                  }

                                  return updatedFormValues;
                                })
                              }
                              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                              placeholder="e.g. 10 or 50 in cm..."
                              required
                            />
                          </div>
                        </div>
                      )}

                      {item.name === "placement" && (
                        <div>
                          <div className="flex items-center mb-4">
                            <input
                              id="front"
                              type="checkbox"
                              name="front"
                              onChange={(e) =>
                                setFormValues((prevFormValues) => {
                                  const updatedFormValues = [...prevFormValues];
                                  const attributeIndex = updatedFormValues[
                                    index
                                  ].attributes.findIndex(
                                    (attr) => attr.name === e.target.name
                                  );

                                  if (attributeIndex !== -1) {
                                    // Update existing attribute
                                    updatedFormValues[index].attributes[
                                      attributeIndex
                                    ].options = e.target.value
                                      .split(",")
                                      .map((option) => option.trim());
                                  } else {
                                    // Add a new attribute
                                    updatedFormValues[index].attributes.push({
                                      name: e.target.name,
                                      options: e.target.value
                                        .split(",")
                                        .map((option) => option.trim()),
                                    });
                                  }

                                  return updatedFormValues;
                                })
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 "
                            />
                            <label
                              htmlFor="front"
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              Front
                            </label>
                          </div>
                          <div className="flex items-center mb-4">
                            <input
                              id="back"
                              type="checkbox"
                              name="back"
                              onChange={(e) =>
                                setFormValues((prevFormValues) => {
                                  const updatedFormValues = [...prevFormValues];
                                  const attributeIndex = updatedFormValues[
                                    index
                                  ].attributes.findIndex(
                                    (attr) => attr.name === e.target.name
                                  );

                                  if (attributeIndex !== -1) {
                                    // Update existing attribute
                                    updatedFormValues[index].attributes[
                                      attributeIndex
                                    ].options = e.target.value
                                      .split(",")
                                      .map((option) => option.trim());
                                  } else {
                                    // Add a new attribute
                                    updatedFormValues[index].attributes.push({
                                      name: e.target.name,
                                      options: e.target.value
                                        .split(",")
                                        .map((option) => option.trim()),
                                    });
                                  }

                                  return updatedFormValues;
                                })
                              }
                              required
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                              htmlFor="back"
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              Back
                            </label>
                          </div>
                          <div className="flex items-center mb-4">
                            <input
                              id="left-sleeve"
                              type="checkbox"
                              name="left-sleeve"
                              onChange={(e) =>
                                setFormValues((prevFormValues) => {
                                  const updatedFormValues = [...prevFormValues];
                                  const attributeIndex = updatedFormValues[
                                    index
                                  ].attributes.findIndex(
                                    (attr) => attr.name === e.target.name
                                  );

                                  if (attributeIndex !== -1) {
                                    // Update existing attribute
                                    updatedFormValues[index].attributes[
                                      attributeIndex
                                    ].options = e.target.value
                                      .split(",")
                                      .map((option) => option.trim());
                                  } else {
                                    // Add a new attribute
                                    updatedFormValues[index].attributes.push({
                                      name: e.target.name,
                                      options: e.target.value
                                        .split(",")
                                        .map((option) => option.trim()),
                                    });
                                  }

                                  return updatedFormValues;
                                })
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                              htmlFor="left-sleeve"
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              Left Sleeve
                            </label>
                          </div>
                          <div className="flex items-center mb-4">
                            <input
                              id="right-sleeve"
                              type="checkbox"
                              name="right-sleeve"
                              onChange={(e) =>
                                setFormValues((prevFormValues) => {
                                  const updatedFormValues = [...prevFormValues];
                                  const attributeIndex = updatedFormValues[
                                    index
                                  ].attributes.findIndex(
                                    (attr) => attr.name === e.target.name
                                  );

                                  if (attributeIndex !== -1) {
                                    // Update existing attribute
                                    updatedFormValues[index].attributes[
                                      attributeIndex
                                    ].options = e.target.value
                                      .split(",")
                                      .map((option) => option.trim());
                                  } else {
                                    // Add a new attribute
                                    updatedFormValues[index].attributes.push({
                                      name: e.target.name,
                                      options: e.target.value
                                        .split(",")
                                        .map((option) => option.trim()),
                                    });
                                  }

                                  return updatedFormValues;
                                })
                              }
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                              htmlFor="right-sleeve"
                              className="ms-2 text-sm font-medium text-gray-900"
                            >
                              Right Sleeve
                            </label>
                          </div>
                        </div>
                      )}

                      {item.options.map((option, optionIndex) => (
                        <div
                          className="flex items-center mb-4"
                          key={optionIndex}
                        >
                          <input
                            id={`radio-${optionIndex}`}
                            type="radio"
                            name={item.name}
                            value={option}
                            onChange={(e) =>
                              setFormValues((prevFormValues) => {
                                const updatedFormValues = [...prevFormValues];
                                const attributeIndex = updatedFormValues[
                                  index
                                ].attributes.findIndex(
                                  (attr) => attr.name === e.target.name
                                );

                                if (attributeIndex !== -1) {
                                  // Update existing attribute
                                  updatedFormValues[index].attributes[
                                    attributeIndex
                                  ].options = e.target.value
                                    .split(",")
                                    .map((option) => option.trim());
                                } else {
                                  // Add a new attribute
                                  updatedFormValues[index].attributes.push({
                                    name: e.target.name,
                                    options: e.target.value
                                      .split(",")
                                      .map((option) => option.trim()),
                                  });
                                }

                                return updatedFormValues;
                              })
                            }
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
      <div className="flex gap-4">
        <p>Total quantity: {getTotalQuantity()}</p>
        <p>Total price: {getTotalPrice()}</p>
      </div>
      <hr />
      <button
        onClick={() => setProductValues(formValues)}
        type="button"
        className="float-right p-y m-4 text-white bg-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Save attributes
      </button>
    </>
  );
};

export default VariableProduct;
