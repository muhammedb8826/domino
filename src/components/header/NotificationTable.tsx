import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { SiMicrosoftonenote } from "react-icons/si";
import { Link } from "react-router-dom";

export const NotificationTable = ({
  title,
  orders,
  handleAction,
  showPopover,
  handleModalOpen,
  popoverRef,
  user,
  products,
  services,
  status1,
  status2
}) => (
  <div className="max-w-full overflow-x-auto">
    <div>
      <span className="text-black dark:text-white w-full py-2 px-4 border-t border-b border-[#eee] mb-4 font-semibold flex items-center gap-4">
        {title}
      </span>
      <div className="max-w-full px-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">No</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Product</th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Services</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Width</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Height</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Quantity</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Note</th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No data found
                </td>
              </tr>
            )}
            {orders && orders.length > 0 && orders.map((data, index) => {
              const product = data.productId && products?.find((product) => product.id === data.productId);
              const service = data.serviceId && services?.find((service) => service.id === data.serviceId);

              return (
                <tr key={index}>
                  <td className="border-b text-graydark border-[#eee] py-2 px-4 dark:border-strokedark">{index + 1}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{product?.name}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{service?.name}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{data.width}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{data.height}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{data.quantity}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{data.status}</td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">{<SiMicrosoftonenote />}</td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      onClick={() => handleAction(index)}
                      title="action"
                      type="button"
                      className="text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      <CiMenuKebab />
                    </button>
                    {showPopover === index && (
                      <div
                        ref={popoverRef}
                        className="absolute z-40 right-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                      >
                        <ul className="py-2 text-sm text-gray-700">
                          <li className={`${user?.email !== "admin@domino.com" && user?.roles !== "graphic-designer" ? "hidden" : ""}`}>
                            <button
                              type="button"
                              onClick={() => handleModalOpen(data.id, status1)}
                              className="flex items-center w-full gap-2 px-4 py-2 font-medium text-primary dark:text-primary hover:underline hover:bg-gray-100"
                            >
                              <FaRegEdit />
                              {status1}
                            </button>
                          </li>
                          <li className={`${user?.email !== "admin@domino.com" && user?.roles !== "graphic-designer" ? "hidden" : ""}`}>
                            <button
                              type="button"
                              onClick={() => handleModalOpen(data.id, status2)}
                              className="flex items-center w-full gap-2 px-4 py-2 font-medium text-primary dark:text-primary hover:underline hover:bg-gray-100"
                            >
                              <FaRegEdit />
                              {status2}
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);