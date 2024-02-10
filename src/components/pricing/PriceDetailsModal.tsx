import { FaRegWindowClose } from "react-icons/fa";

const PriceDetailsModal = ({ data, handleModalOpen }) => {
  console.log(data);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form>
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">
                  Price Details
                </h3>
                <button
                  title="close"
                  type="button"
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => handleModalOpen(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    <FaRegWindowClose />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <p className="text-l mb-1">Media name:{data.type} </p>
                <hr className="mb-4" />

                <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
                  {data.prices.length === 0 && (
                    <li>
                      <p className="text-l font-semibold text-gray-900">
                        No prices found
                      </p>
                        </li>
                        )}
                  {data.prices.length > 0  && data.prices.map((price, index) => (
                    <li key={index} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <svg
                        className="flex-shrink-0 w-3.5 h-3.5 text-green-500 dark:text-green-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 12"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M1 5.917 5.724 10.5 15 1.5"
                        />
                      </svg>
                      <span>Material: <strong>{price.material}</strong></span>
                      <span>Service: <strong>{price.service}</strong></span>
                      <span>Unit name: <strong>{price.unitName}</strong></span>
                      <span>Unit value: <strong>{price.unitValue}</strong></span>
                      <span>Price: <strong>{price.prices}</strong></span>
                    </li>
                  ))}
                </ul>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default PriceDetailsModal;
