import Loader from "@/common/Loader";
import { getSales, updateSale } from "@/redux/features/saleSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import { toast } from "react-toastify";

export const StoreNotifications = () => {
    const { sales, isLoading } = useSelector((state: RootState) => state.sale);
    const { user, error } = useSelector(
      (state: RootState) => state.auth
    );

    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getSales());
    }, [dispatch]);

    const filteredSalesStatus = sales?.filter(
        (sale) => sale.status === "approved" || sale.status === "pending"
      );

    const handleApproveSale = (id: string) => {
        const findSale = sales.find((sale) => sale.id === id);
        const updatedFindSale = { ...findSale, status: "stocked-out" };
        dispatch(updateSale(updatedFindSale)).then(() => {
          const message = "Sale stocked-out successfully";
          toast.success(message);
        });
      };
    
      const handleRejectSale = (id: string) => {
        const findSale = sales.find((sale) => sale.id === id);
        const updatedFindSale = { ...findSale, status: "rejected" };
        dispatch(updateSale(updatedFindSale)).then(() => {
          const message = "Sale rejected successfully";
          toast.success(message);
        });
      };

    const productListContent = filteredSalesStatus.length > 0 && filteredSalesStatus?.map((sale, index) => (
        <tr key={sale.id}>
          <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
            {sale.id}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {sale.orderDate}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {sale.operatorFirstName}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {sale.products.map((product) => product.quantity).reduce((a, b) => a + Number(b), 0)}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {sale.status}
          </td>
          <td className="px-4 py-5 flex">
            <button
              className="bg-primary text-white active:bg-primary font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none me-5 mb-1 ease-linear transition-all duration-150"
              onClick={() => handleApproveSale(sale.id)}
              type="button"
            >
             stock out
            </button>
            <button
              className="bg-danger text-white active:bg-danger font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => handleRejectSale(sale.id)}
              type="button"
            >
              reject
            </button>
          </td>
        </tr>
      ));

if(error) {
    return <ErroPage error={error} />;
    }

  return isLoading ? ( <Loader/>):(
    <section className="bg-white dark:bg-gray-900 wrapper py-4  p-0 min-h-screen">
      {/* <GoBack goback="/dashboard" /> */}
      <h2 className="m-4 relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Notifications
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-danger border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
          {filteredSalesStatus.length}
        </div>
      </h2>
      <hr />
      {filteredSalesStatus.length === 0 && (
        <p className="text-center text-2xl font-bold text-black dark:text-white">
          No notifications
        </p>
      )}

{user?.roles === "store-representative" && (
        <>
          <div className="max-w-full overflow-x-auto mb-10">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Reference
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Order Date
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Operator
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Quantity
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Status
                    </th>
                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>{productListContent}</tbody>
              </table>
          </div>
        </>
      )}
      </section>
  )
}
