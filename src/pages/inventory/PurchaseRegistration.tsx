import Breadcrumb from "@/components/Breadcrumb";
import CustomerSearchInput from "@/components/customer/CustomerSearchInput";
import { createPurchase } from "@/redux/features/purchaseSlice";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { ProductSearchInput } from "./ProductSearchInput";
import { SupplierSearchInput } from "./SupplierSearchInput";
import {
  getProducts,
  searchProducts,
} from "@/redux/features/product/productSlice";
import { FaProductHunt } from "react-icons/fa6";
import { ProductRegistration } from "./ProductRegistration";
import { CiEdit } from "react-icons/ci";

interface SupplierType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  address: string;
}

interface ProductType {
  id: string;
  name: string;
}

export const PurchaseRegistration = () => {
  const { products, searchTerm } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState([
    {
      quantity: "",
      description: "",
      unitPrice: "",
      totalPrice: "",
    },
  ]);

  const [idx, setIdx] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(
    Array(formData.length).fill(false)
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id?.toString().includes(searchTerm)
  );

  const [productInfo, setProductInfo] = useState([
    {
      id: "",
      name: "",
    },
  ]);

  const handleSearchProduct = (e, index) => {
    setIdx(index);
    setIsDropdownOpen((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    dispatch(searchProducts(e.target.value));
  };

  const handleSelectProduct = (product, index) => {
    setIsDropdownOpen((prevState) => {
      const newState = [...prevState];
      newState[idx] = false;
      return newState;
    });
    const updatedProductInfo = [...productInfo];
    updatedProductInfo[idx] = {
      id: product.id,
      name: product.name,
    };
    setProductInfo(updatedProductInfo);
  };

  const handleClose = (index) => {
    const updatedProductInfo = [...productInfo];
    updatedProductInfo[index] = {
      id: "",
      name: "",
    };
    setProductInfo(updatedProductInfo);
  };

  const handleModalOpen = () => {
    setModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const looseFocus = (e: MouseEvent) => {
      if ((e.target as HTMLInputElement).id !== "input-group-search") {
        setIsDropdownOpen(Array(formData.length).fill(false));
      }
    };
    document.addEventListener("click", looseFocus);
    return () => {
      document.removeEventListener("click", looseFocus);
    };
  }, []);

  const [supplierInfo, setSupplierInfo] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  const handleSupplierInfo = (supplier: SupplierType) => {
    setSupplierInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      id: supplier.id,
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      email: supplier.email,
      phone: supplier.phone,
      company: supplier.company,
      address: supplier.address,
    }));
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...formData];
    list[index][name] = value;
    setFormData(list);
  };

  const handleAddProduct = () => {
    setFormData([
      ...formData,
      {
        quantity: "",
        description: "",
        unitPrice: "",
        totalPrice: "",
      },
    ]);
    setProductInfo([
      ...productInfo,
      {
        id: "",
        name: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const list = [...formData];
    list.splice(index, 1);
    setFormData(list);
    const updatedProductInfo = [...productInfo];
    updatedProductInfo.splice(index, 1);
    setProductInfo(updatedProductInfo);
  };

  return (
    <>
      <Breadcrumb pageName="Purchase Order" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Purchase Form
              </h3>
            </div>

            {/* <form action="#"> */}
            <div className="p-6.5">
              <div className="mb-4.5 grid sm:grid-cols-2 gap-6">
                <div className="w-full relative">
                  <SupplierSearchInput
                    handleSupplierInfo={handleSupplierInfo}
                    value={supplierInfo.firstName}
                  />
                </div>
                <div className="">
                  <label className="mb-3 block text-black dark:text-white">
                    Order Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      title="Select a date"
                      placeholder="Select a date"
                      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label className="w-1/4 mb-2.5 block text-black dark:text-white">
                    Vedor Reference
                  </label>
                  <input
                    type="text"
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData &&
                      formData.map((data, index) => (
                        <tr key={index} className="">
                          <td className="min-w-[220px] relative border border-[#eee] dark:border-strokedark">
                            <div className="relative">
                              <label
                                htmlFor={`checkbox-item-${index}`}
                                className="sr-only mb-3 block text-black dark:text-white"
                              >
                                Product
                              </label>
                              <div className="relative">
                                <input
                                  onChange={(e) =>
                                    handleSearchProduct(e, index)
                                  }
                                  value={productInfo[index]?.name || ""}
                                  id={`checkbox-item-${index}`}
                                  type="text"
                                  name="name"
                                  className="w-full rounded-lg bg-transparent px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:text-white"
                                  placeholder=""
                                />
                                <span className="absolute top-1/2 right-4 -translate-y-1/2">
                                  <IoMdClose
                                    onClick={() => handleClose(index)}
                                    className="w-5 h-5"
                                  />
                                </span>
                              </div>
                            </div>

                            {/* <!-- Dropdown menu --> */}
                            <div
                              id="dropdownSearch"
                              className={`z-10 ${
                                isDropdownOpen[index] ? "" : "hidden"
                              } bg-white rounded-lg rounded-t-none border-stroke bg-transparent shadow dark:bg-gray-700 w-full absolute top-12`}
                            >
                              <ul
                                className="max-h-48 px-3 pb-3 overflow-y-auto text-sm text-black dark:text-white"
                                aria-labelledby="dropdownSearchButton"
                              >
                                {filteredProducts.length > 0 ? (
                                  filteredProducts.map((product) => (
                                    <li key={product.id}>
                                      <div className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <input
                                          onChange={() =>
                                            handleSelectProduct(product, index)
                                          }
                                          value={productInfo[index]?.name || ""}
                                          id={`checkbox-item-${product.id}`}
                                          type="radio"
                                          name="productName"
                                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        <label
                                          htmlFor={`checkbox-item-${product.id}`}
                                          className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
                                        >
                                          {product.name}
                                        </label>
                                      </div>
                                    </li>
                                  ))
                                ) : (
                                  <li className="py-2 ms-2 text-sm font-medium">
                                    No product found
                                  </li>
                                )}
                              </ul>
                              <button
                                onClick={handleModalOpen}
                                type="button"
                                className="w-full flex items-center p-3 text-sm font-medium text-primary border-[1.5px] border-stroke bg-transparent border-t border-gray-200 rounded-b-lg bg-gray-50 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline"
                              >
                                <FaProductHunt className="w-5 h-5 me-2" />
                                Add new product
                              </button>
                            </div>
                            {modalOpen && (
                              <ProductRegistration
                                handleModalOpen={handleModalOpen}
                              />
                            )}
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
                              onChange={(e) => handleChange(e, index)}
                              className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                          </td>
                          <td className="border border-[#eee] dark:border-strokedark">
                            <input
                              title="Total price of the product"
                              type="number"
                              name="totalPrice"
                              value={data.totalPrice}
                              onChange={(e) => handleChange(e, index)}
                              className="w-full rounded  bg-transparent p-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                            />
                          </td>
                          <td className="border border-[#eee] px-4 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <button
                                onClick={()=>handleDeleteRow(index)}
                                type="button"
                                className="hover:text-primary"
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
                              <button
                                // onClick={()=>handleEditModalOpen(category.id)}
                                type="button"
                                title="edit"
                                className="hover:text-primary text-xl"
                              >
                                <CiEdit />
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

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Type your message"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                ></textarea>
              </div>

              <button className="flex justify-center rounded bg-primary p-3 font-medium text-gray">
                Add Purchase
              </button>
            </div>
            {/* </form> */}
          </div>
        </div>

        {/* <div className="flex flex-col gap-9">
         
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Vendor Info
              </h3>
            </div>
            <div className="p-6.5">
              <div className="w-full relative">
                <SupplierSearchInput
                  handleSupplierInfo={handleSupplierInfo}
                  value={supplierInfo.firstName}
                />
              </div>
              <ul className="w-96 text-surface text-black dark:text-white">
                <li className="w-full py-4">
                  Company : {supplierInfo.company}
                </li>
                <li className="w-full py-4">
                  Address : {supplierInfo.address}
                </li>
                <li className="w-full py-4">Phone : {supplierInfo.phone}</li>
                <li className="w-full py-4">Email : {supplierInfo.email}</li>
              </ul>
            </div>
          </div>

          
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Payment Info
              </h3>
            </div>
            <div className="p-6.5">
              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Payment method
                </label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    title="Select payment method"
                  >
                    <option value="cash">Cash</option>
                    <option value="mobile-banking">Mobile Banking</option>
                    <option value="bank">Bank</option>
                    <option value="check">Check</option>
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
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="10,000"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};
