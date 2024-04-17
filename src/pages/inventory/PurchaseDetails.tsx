import { CiEdit } from "react-icons/ci";
import { SupplierSearchInput } from "./SupplierSearchInput";
import Breadcrumb from "@/components/Breadcrumb";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getProducts } from "@/redux/features/product/productSlice";
import { getPurchasesById } from "@/redux/features/purchaseSlice";
import { getUnits } from "@/redux/features/unit/unitSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { updatePurchase } from "@/redux/features/purchaseSlice";

export const PurchaseDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const { units } = useSelector((state) => state.unit);
  const { products } = useSelector((state) => state.product);
  const { singlePurchase } = useSelector((state) => state.purchase);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState([
    {
      productId: "",
      productName: "",
      unitId: "",
      unitName: "",
      quantity: "",
      description: "",
      unitPrice: "",
      subTotal: "",
    },
  ]);

  useEffect(() => {
    dispatch(getPurchasesById(id));
    dispatch(getProducts());
    dispatch(getUnits());
  }, [dispatch, id]);

  useEffect(() => {
    if (singlePurchase.products) {
      const updatedFormData = singlePurchase.products.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        unitId: product.unitId,
        unitName: product.unitName,
        quantity: product.quantity,
        description: product.description,
        unitPrice: product.unitPrice,
        subTotal: product.subTotal,
      }));
      setFormData(updatedFormData);
      setGrandTotal(singlePurchase.totalAmount);
      setTotalQuantity(singlePurchase.totalQuantity);
      setTax(singlePurchase.tax);
      setOrderDate(singlePurchase.orderDate);
      setPaymentInfo({
        paymentMethod: singlePurchase.paymentMethod,
        amount: singlePurchase.amount,
        reference: singlePurchase.reference,
      });
      setSupplierInfo({
        id: singlePurchase.vendorId,
        firstName: singlePurchase.vendorName,
      });
    }
  }, [singlePurchase]);

  const handleSelectedProduct = (e, index) => {
    const selectedProductId = e.target.value;
    const selectedProductName = products.find(product => product.id === selectedProductId)?.name || '';

    setFormData(prevState => {
      const updatedFormData = [...prevState];
      updatedFormData[index] = {
        ...updatedFormData[index],
        productId: selectedProductId,
        productName: selectedProductName,
      };

      const productData = products.find(p => p.id === selectedProductId);
      if (productData) {
        const unit = units.find(u => u.id === productData.unitId);
        if (unit) {
          updatedFormData[index] = {
            ...updatedFormData[index],
            unitId: unit.id,
            unitName: unit.name,
          };
        }
      }
      return updatedFormData;
    });
  };

  const [supplierInfo, setSupplierInfo] = useState({
    id: "",
    firstName: "",
  });

  const handleSupplierInfo = (supplier) => {
    setSupplierInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      id: supplier.id,
      firstName: supplier.firstName,
    }));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = value;
    if (name === "quantity" || name === "unitPrice") {
      updatedFormData[index].subTotal =
        updatedFormData[index].quantity * updatedFormData[index].unitPrice || 0;
    }
    setFormData(updatedFormData);
  };


  const handleAddProduct = () => {
    setFormData([
      ...formData,
      {
        productId: "",
        productName: "",
        unitId: "",
        unitName: "",
        quantity: "",
        description: "",
        unitPrice: "",
        subTotal: "",
      },
    ]);
  };

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: "cash",
    amount: "",
    reference: "",
  });

  const [orderDate, setOrderDate] = useState("");
  const [note, setNote] = useState("");
  const handleNote = (e) => {
    setNote(e.target.value)
  }
  const handleOrderDate = (e) => {
    setOrderDate(e.target.value);
  };

  const [grandTotal, setGrandTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [tax, setTax] = useState(0);
  useEffect(() => {
    const total = formData.reduce((acc, curr) => {
      return acc + curr.subTotal;
    }, 0);
    const quantity = formData.reduce((acc, curr) => {
      return acc + Number(curr.quantity);
    }, 0);
    setTotalQuantity(quantity);
    setTotalAmount(total);
    setTax(total * 0.15);
    setGrandTotal(total + tax)
  }, [formData, tax]);

  const handlePaymentMethod = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteRow = (index) => {
    const updatedFormData = [...formData];
    updatedFormData.splice(index, 1);
    setFormData(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supplierInfo.id) {
      toast.error("Please select a supplier");
      return;
    }
    const data = {
      id: singlePurchase.id,
      vendorId: supplierInfo.id,
      purchaseReresentative: user?.first_name,
      purchaseReresentativeId: user?.id,
      status: "purchased",
      vendorName: supplierInfo.firstName,
      orderDate: orderDate,
      paymentMethod: paymentInfo.paymentMethod,
      amount: grandTotal,
      reference: paymentInfo.reference,
      totalAmount: grandTotal,
      totalQuantity: totalQuantity,
      note: note,
      products: formData.map((product) => ({
        productId: product.productId,
        productName: product.productName,
        quantity: product.quantity,
        description: product.description,
        unitPrice: product.unitPrice,
        subTotal: product.subTotal,
        unitId: product.unitId,
        unitName: product.unitName,
      })),
    };
    if(singlePurchase.status !== "received") {
    dispatch(updatePurchase(data)).then(() => {
      navigate("/dashboard/inventory/purchases");
      toast.success("Purchase created successfully");
    });
  } else {
    toast.error("Purchase already received");
  }
  };
  return (
    <>
      <Breadcrumb pageName="Purchase Order" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <form onSubmit={handleSubmit}>
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Purchase Form
                </h3>
              </div>

              <div className="p-6.5">
                <div className="mb-4.5 grid sm:grid-cols-2 gap-6">
                  <div className="w-full relative">
                    <SupplierSearchInput
                      handleSupplierInfo={handleSupplierInfo}
                      value={supplierInfo.firstName}
                    />
                  </div>
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Purchase representative
                    </label>
                    <input
                      name="reference"
                      type="text"
                      readOnly
                      value={user.first_name}
                      placeholder="Enter your first name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div className="">
                    <label className="mb-3 block text-black dark:text-white">
                      Order Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="orderDate"
                        onChange={handleOrderDate}
                        value={orderDate}
                        required
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
                    <div className="relative z-20 bg-transparent dark:bg-form-input">
                      <select
                        name="paymentMethod"
                        onChange={handlePaymentMethod}
                        defaultValue="cash"
                        title="Select payment method" className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary">
                        <option value="cash">Cash</option>
                        <option value="mobile-banking">Mobile banking</option>
                        <option value="check">Check</option>
                        <option value="bank">Bank</option>
                      </select>
                      <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill=""
                            ></path>
                          </g>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Reference
                    </label>
                    <input
                      onChange={handlePaymentMethod}
                      name="reference"
                      type="text"
                      value={paymentInfo.reference}
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
                          Product name
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          Description
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          Quantity
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          Unit price
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          Subtotal
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          UoM
                        </th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData &&
                        formData.map((data, index) => (
                          <tr key={index} className="">
                            <td className="min-w-[220px] relative border border-[#eee] dark:border-strokedark">
                              <div className="relative z-20 bg-transparent dark:bg-form-input">
                                <select
                                  onChange={(e) => handleSelectedProduct(e, index)}
                                  required
                                  title="choose product"
                                  className="relative z-20 w-full appearance-none rounded bg-transparent p-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                  {formData[index] && products.length > 0 &&
                                    products.map((product) => (
                                      <option
                                        key={product.id}
                                        value={product.id}
                                        selected={product.id === formData[index].productId}
                                      >
                                        {product.name}
                                      </option>
                                    ))}
                                </select>
                                <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                                  <svg
                                    className="fill-current"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g opacity="0.8">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                        fill=""
                                      ></path>
                                    </g>
                                  </svg>
                                </span>
                              </div>
                            </td>
                            <td className="border border-[#eee] dark:border-strokedark">
                              <input
                                title="Description of the product"
                                type="text"
                                name="description"
                                value={data.description}
                                onChange={(e) => handleChange(e, index)}
                                className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              />
                            </td>
                            <td className="border border-[#eee] dark:border-strokedark">
                              <input
                                title="Quantity of the product"
                                type="number"
                                name="quantity"
                                value={data.quantity}
                                required
                                onChange={(e) => handleChange(e, index)}
                                className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              />
                            </td>
                            <td className="border border-[#eee] dark:border-strokedark">
                              <input
                                title="Unit price of the product"
                                type="number"
                                name="unitPrice"
                                value={data.unitPrice}
                                required
                                onChange={(e) => handleChange(e, index)}
                                className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              />
                            </td>
                            <td className="border border-[#eee] dark:border-strokedark">
                              <input
                                title="Total price of the product"
                                type="number"
                                name="totalPrice"
                                value={data.subTotal}
                                onChange={(e) => handleChange(e, index)}
                                className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                              />
                            </td>
                            <td className="border border-[#eee] dark:border-strokedark">
                              {data.unitName}
                            </td>
                            <td className="border border-[#eee] px-4 dark:border-strokedark">
                              <div className="flex items-center space-x-3.5">
                                <button
                                  onClick={() => handleDeleteRow(index)}
                                  type="button"
                                  className="hover:text-danger"
                                  title="delete"
                                >
                                  <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                      fill=""
                                    />
                                    <path
                                      d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                      fill=""
                                    />
                                    <path
                                      d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                      fill=""
                                    />
                                    <path
                                      d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                      fill=""
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="my-4">
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="flex items-center justify-center rounded border-[1.5px] border-stroke bg-transparent px-2 py-1 font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary dark:hover:text-primary transition-colors"
                  >
                    Add row
                  </button>
                </div>

                <div className="flex justify-between border-t pt-4">
                  <strong>Summary</strong>
                  <div className="mb-4.5">
                    <p className="mb-2.5 block text-black dark:text-white">
                      Total Quantity: {totalQuantity}
                    </p>
                    <p className="mb-2.5 block text-black dark:text-white">
                      Total Amount: {totalAmount}
                    </p>
                    <p className="mb-2.5 block text-black dark:text-white">
                      Tax: {tax}
                    </p>
                    <p className="mb-2.5 block text-black dark:text-white">
                      Grand Total: {grandTotal}
                    </p>

                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Note
                  </label>
                  <textarea
                    rows={4}
                    name="note"
                    onChange={handleNote}
                    placeholder="Type your message"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  ></textarea>
                </div>
                {singlePurchase.status !== "received" && (
                <button
                  type="submit"
                  className="flex justify-center rounded bg-primary p-3 font-medium text-gray">
                  Update
                </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
