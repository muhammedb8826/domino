import Loader from "@/common/Loader"
import ErroPage from "@/components/common/ErroPage"
import { getOrders } from "@/redux/features/order/orderSlice"
import { useEffect } from "react"
import { IoMdClose } from "react-icons/io"
import { useDispatch, useSelector } from "react-redux"

export const OperatorStoreDetailsModal = ({ handleEditModalOpen, data }) => {
const {orders, isLoading, error } = useSelector((state) => state.order)
const dispatch = useDispatch();
useEffect (() => {
  dispatch(getOrders())
}, [dispatch])

console.log(orders);


if (error) {
  return <ErroPage error={error}/>  
}

  return isLoading? (<Loader/>):(
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999 bg-black/50 outline-none focus:outline-none">
        {/* <form onSubmit={handleSubmit} className="w-full"> */}
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg relative flex flex-col w-full bg-white shadow-default dark:border-strokedark dark:bg-boxdark outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark rounded-t">
              <h3 className="text-3xl text-black dark:text-white font-semibold text">
                Store Details
              </h3>
              <button
                title="close"
                type="button"
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => handleEditModalOpen(false)}
              >
                <span className="bg-transparent text-black dark:text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <IoMdClose />
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <div className="mb-4.5 grid sm:grid-cols-2 gap-6">
                <div className="">
                  <label className="mb-3 block text-black dark:text-white">
                    Vendor
                  </label>
                  <div className="relative">
                    <input
                      readOnly
                      type="text"
                      name="vendor"
                      // onChange={handleOrderDate}
                      value={data.vendorName}
                      title="Select a date"
                      placeholder="Select a date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="">
                  <label className="mb-3 block text-black dark:text-white">
                    Order Date
                  </label>
                  <div className="relative">
                    <input
                      readOnly
                      type="date"
                      name="orderDate"
                      // onChange={handleOrderDate}
                      value={data.orderDate}
                      title="Select a date"
                      placeholder="Select a date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Payment method
                  </label>
                  <input
                    readOnly
                    // onChange={handlePaymentMethod}
                    name="reference"
                    type="text"
                    value={data.paymentMethod}
                    placeholder="Enter your first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amount
                  </label>
                  <input
                    readOnly
                    title="amount"
                    // onChange={handlePaymentMethod}
                    name="amount"
                    type="text"
                    value={data.amount}
                    placeholder=""
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="w-full">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Reference
                  </label>
                  <input
                    readOnly
                    // onChange={handlePaymentMethod}
                    name="reference"
                    type="text"
                    value={data.reference}
                    placeholder="Enter your first name"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="max-w-full">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Product
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Description
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Quantity
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        UoM
                      </th>
                      <th className="py-4 px-4 font-medium text-black dark:text-white">
                        Order Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.products?.map((data, index) => (
                        <tr key={index} className="">
                          <td>
                            <input
                              title="Product name"
                              readOnly
                              type="text"
                              name="name"
                              value={data.productName}
                              // onChange={(e) => handleChange(e, index)}
                              className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                          </td>
                          <td className="border border-[#eee] dark:border-strokedark">
                            <input
                              readOnly
                              title="Description of the product"
                              type="text"
                              name="description"
                              value={data.description}
                              // onChange={(e) => handleChange(e, index)}
                              className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                          </td>
                          <td className="border border-[#eee] dark:border-strokedark">
                            <input
                              readOnly
                              title="Quantity of the product"
                              type="number"
                              name="quantity"
                              value={data.quantity}
                              // onChange={(e) => handleChange(e, index)}
                              className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                          </td>
                          <td className="border border-[#eee] dark:border-strokedark">
                            {data.UoM}
                          </td>
                          <td className="border border-[#eee] dark:border-strokedark">
                            {orders.map((order) => {
                              if(data.productName === order.orderItems.map((item) => item.material)){
                                return data.productName
                              }
                            }
                          )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end gap-4.5 border-t border-stroke py-4 px-6.5 dark:border-strokedark rounded-b">
              <button
                className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                type="button"
                onClick={() => handleEditModalOpen(false)}
              >
                Close
              </button>
              {/* <button
                className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                type="submit"
              >
                Update
              </button> */}
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  )
}
