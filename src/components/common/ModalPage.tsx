import { FaEdit, FaRegHandPointRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
const ModalPage = ({ handleModalOpen, id, orders }) => {
  const order = orders.find((order) => order.id === id);
  console.log(order);

  return (
    <div
      className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full mx-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 mx-auto">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <div className="flex justify-between items-center">
              <h3
                className="text-lg font-medium leading-6 text-gray-900 flex gap-3"
                id="modal-headline"
              >
                Order Details{" "}
                <button
                  type="button"
                  title="edit"
                  className="flex items-center text-sky-500 text-base"
                >
                  <FaEdit />
                  Edit
                </button>
              </h3>

              <button
                onClick={() => handleModalOpen()}
                type="button"
                title="close"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 sm:ml-3 sm:w-auto"
              >
                <IoMdClose />
              </button>
            </div>

            <div className="mt-2">
              <div className="grid gap-4 mb-3 md:grid-cols-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    First name
                  </label>
                  <input
                    value={order.firstName}
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
                    value={order.lastName}
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
                    value={order.phoneNumber}
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
                    value={order.email}
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="john.doe@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 mb-3 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="quantity"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Quantity:
                  </label>

                  <input
                    name="quantity"
                    type="number"
                    id="quantity"
                    value={order.order.map((order) => order.quantity)}
                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Price:
                  </label>
                  <input
                    name="price"
                    type="number"
                    id="price"
                    value={order.order.map((order) => order.price)}
                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Description:
                  </label>
                  <textarea
                    name="description"
                    id="note"
                    rows={4}
                    value={order.order.map((order) => order.description)}
                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                    placeholder="Enter options to choose from e.g 2 or 3"
                  ></textarea>
                </div>
              </div>

              <p className="font-bold mb-2">Attributes</p>
              <hr />

              {order.order.some((item) =>
                item.attributes.some((attr) => attr.name === "dimensions")
              ) && (
                <div className="flex items-center justify-between">
                  <span>Dimensions</span>
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
                      value={order.order
                        .flatMap((order) =>
                          order.attributes
                            .filter((attr) => attr.name === "width")
                            .map((attr) => attr.options[0])
                        )
                        .find((width) => width !== null)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                      placeholder="e.g. 10 or 50 in cm..."
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
                      value={order.order
                        .flatMap((order) =>
                          order.attributes
                            .filter((attr) => attr.name === "height")
                            .map((attr) => attr.options[0])
                        )
                        .find((height) => height !== null)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 "
                      placeholder="e.g. 10 or 50 in cm..."
                    />
                  </div>
                </div>
              )}

              {order.order.map((item) => (
                <div key={item.id}>
                  {item.attributes.map((attr) => (
                    <p key={attr.name} className="font-semibold flex items-center gap-2">
                     <FaRegHandPointRight /> {attr.name}: <span className="font-semibold text-blue-500">{attr.options[0]}</span>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse mx-auto">
        <button
          type="submit"
          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ModalPage;
