import Loader from "@/common/Loader";
import { getSales, updateSale } from "@/redux/features/saleSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import { toast } from "react-toastify";
import { getPurchases, updatePurchase } from "@/redux/features/purchaseSlice";
import { getStock, updateStock } from "@/redux/features/stockSlice";

export const StoreNotifications = () => {
    const { sales, isLoading } = useSelector((state: RootState) => state.sale);
    const { purchases } = useSelector((state: RootState) => state.purchase);
    const { stock } = useSelector((state: RootState) => state.stock);
    const { user, error } = useSelector(
      (state: RootState) => state.auth
    );

    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getSales());
      dispatch(getPurchases());
      dispatch(getStock());
    }, [dispatch]);

    const filteredSalesStatus = sales?.filter(
        (sale) => sale.status === "approved" || sale.status === "pending"
      );

      const filteredPurchasesStatus = purchases?.filter(
        (sale) => sale.status === "purchased" || sale.status === "pending"
      );

      const handleApproveSale = (id: string) => {
        // Find the sale by ID
        const findSale = sales.find((sale) => sale.id === id);
    
        if (!findSale) {
            toast.error("Sale not found");
            return;
        }
    
        // Update the sale status
        const updatedFindSale = { ...findSale, status: "stocked-out" };  
        // Update stock quantities based on sale products
        updatedFindSale.products.forEach((saleProduct) => {
            const stockProduct = stock.find((product) => product.productId === saleProduct.productId);
            if (stockProduct) {
                const newQuantity = Number(stockProduct.quantity) - Number(saleProduct.quantity);             
                if (newQuantity >= 0) {
                    const updatedStockProduct = { ...stockProduct, quantity: newQuantity.toString() };
                    dispatch(updateStock(updatedStockProduct));
                    dispatch(updateSale(updatedFindSale)).then(() => {
                      const message = "Sale stocked-out successfully";
                      toast.success(message);
                    });
                } else {
                    toast.error(`Not enough stock for product ${saleProduct.productName}`);
                    return;
                }
            } else {
                toast.error(`Stock not found for product ${saleProduct.productName}`);
                return;
            }
        });
        // Dispatch and handle success message
    };
      const handleApprovePurchase = (id: string) => {
        const findPurchase = purchases.find((purchase) => purchase.id === id);
        if(!findPurchase) {
          toast.error("Purchase not found");
          return;
        }

        const updatedFindPurchase = { ...findPurchase, status: "received" };
        // Update stock quantities based on purchase products
        updatedFindPurchase.products.forEach((purchaseProduct) => {
          const stockProduct = stock.find((product) => product.productId === purchaseProduct.productId);
          if (stockProduct) {
            const newQuantity = Number(stockProduct.quantity) + Number(purchaseProduct.quantity);
            const updatedStockProduct = { ...stockProduct, quantity: newQuantity.toString() };
            dispatch(updateStock(updatedStockProduct));
          } else {
            const newStockProduct = {
              productId: purchaseProduct.productId,
              quantity: purchaseProduct.quantity,
            };
            dispatch(updateStock(newStockProduct));
          }
        });

        dispatch(updatePurchase(updatedFindPurchase)).then(() => {
          const message = "Purchase received successfully";
          toast.success(message);
        });
      };
      
      const handleRejectPurchase = (id: string) => {
        const findPurchase = purchases.find((purchase) => purchase.id === id);
        const updatedFindPurchase = { ...findPurchase, status: "rejected" };
        dispatch(updatePurchase(updatedFindPurchase)).then(() => {
          const message = "Purchase rejected successfully";
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

      const purchaseListContent = filteredPurchasesStatus.length > 0 && filteredPurchasesStatus?.map((purchase, index) => (
        <tr key={purchase.id}>
          <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
            {purchase.id}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {purchase.orderDate}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {purchase.purchaseReresentative}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {purchase.products.map((product) => product.quantity).reduce((a, b) => a + Number(b), 0)}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {purchase.status}
          </td>
          <td className="px-4 py-5 flex">
            <button
              className="bg-primary text-white active:bg-primary font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none me-5 mb-1 ease-linear transition-all duration-150"
              onClick={() => handleApprovePurchase(purchase.id)}
              type="button"
            >
             Receive
            </button>
            <button
              className="bg-danger text-white active:bg-danger font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={() => handleRejectPurchase(purchase.id)}
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
          {filteredSalesStatus.length+filteredPurchasesStatus.length}
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
          <p className="p-4">Sales notifications </p>

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
          <p className="p-4">Purchase notifications </p>
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
                      Purchase rep
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
                <tbody>{purchaseListContent}</tbody>
              </table>
          </div>
        </>
      )}
      </section>
  )
}
