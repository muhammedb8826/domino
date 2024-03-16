import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { getOrders } from "@/redux/features/order/orderSlice";
import { CiMenuKebab, CiSettings } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import {
  getCommissionTransactions,
  getCommissions,
  updateCommission,
} from "@/redux/features/commission/commissionSlice";
import { GoBack } from "../common/GoBack";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);

const CommissionDetailsPage = () => {
  const { orders,  } = useSelector((state) => state.order);
  const { commissions,isLoading, error } = useSelector((state) => state.commission);
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getCommissionTransactions());
    dispatch(getCommissions()).then((res) => {
      if (res.payload) {
        const commission = res.payload.find(
          (commission) => commission.id === id
        );
        if (commission) {
          setFormData(commission.data);
        }
      }
    });
  }, [dispatch, id]);

  const [formData, setFormData] = useState([
    {
      date: formattedDate,
      description: "",
      paymentAmount: "",
      status: "Earning",
    },
  ]);

  const [totalTransaction, setTotalTransaction] = useState(0);
  useEffect(() => {
    const total = formData?.reduce(
      (acc, data) => acc + Number(data.paymentAmount),
      0
    );
    setTotalTransaction(total);
  }, [formData]);

  const [showPopover, setShowPopover] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(null);
      }
    };

    if (showPopover !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover]);

  const handleAddRow = () => {
    setFormData((prevFormData) => {
      // Check if prevFormData is an array before spreading
      return Array.isArray(prevFormData)
        ? [...prevFormData, {
            date: formattedDate,
            description: "",
            paymentAmount: "",
            status: "Earning",
          }]
        : []; // If not an array, return an empty array
    });
  };

  const handleAction = (index: number) => {
    setShowPopover((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleCancel = (index) => {
    const updatedFormData = [...formData];
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this transaction!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The transaction has been deleted.",
          icon: "success",
        }).then(() => {
          const filteredData = updatedFormData.filter((_, i) => i !== index);
          dispatch(updateCommission({ id, data: filteredData }));
          setFormData(filteredData);
        });
      }
    });
  };

  const findOrder = orders.filter((order) => order.commissionId === id);
  const totalSum = findOrder.map((order) =>
    order.orderItems
      .map((price) => price.commissionPrice)
      .reduce((a, b) => a + b, 0)
  );
  const total = totalSum.reduce((a, b) => a + b, 0);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData]; // Create a shallow copy of the formData array
      updatedFormData[index] = { ...updatedFormData[index], [name]: value }; // Update the specific element with the new value
      return updatedFormData; // Return the updated copy
    });
  };

  // const resetForm = () => {
  //   setFormData([
  //     {
  //       date: formattedDate,
  //       description: "",
  //       paymentAmount: "",
  //       status: "Earning",
  //     },
  //   ]);
  // };

  const handleSumbit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (totalTransaction > total) {
      const message =
        "Transaction amount cannot be greater than balance amount";
      toast.error(message);
      return;
    }

    const updatedFormData = formData.map((data) => {
      // Check if paymentAmount is greater than 0
      if (Number(data.paymentAmount) > 0) {
        // Return a new object with updated status
        return { ...data, status: "Paid" };
      } else {
        // Return the original object if paymentAmount is not greater than 0
        return data;
      }
    });

    if (updatedFormData.length === 0) {
      const message = "Please add a transaction";
      toast.error(message);
      return;
    }

    const findId = commissions.find((commission) => commission.id === id);
    const transaction = {
      ...findId,
      data: updatedFormData,
      id: id,
    };

    dispatch(updateCommission(transaction)).then((res) => {
      if (res.payload) {
        const message = "Transaction added successfully";
        toast.success(message);
        // resetForm();
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErroPage error={error} />;
  }

  return (
    <section className="bg-white dark:bg-gray-900 wrapper py-4 border p-0 min-h-screen">
      <GoBack goback="/dashboard" />
      <h2 className="ps-4 my-4 text-2xl font-bold text-gray-900 dark:text-white">
        Transaction Details
      </h2>
      <hr />
      <div className="grid grid-cols-2 gap-4 px-4">
        <strong>Summary</strong>
        <div className="w-full py-4">
          <div className="flex items-center">
            <p
              className="w-1/4 gap-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Sales Person :
            </p>
            <p className="flex-1">
              {findOrder[0]?.commissionFirstName}
            </p>
          </div>
          <div className="flex items-center">
            <p
              className="w-1/4 gap-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Balance :
            </p>
            <p className="flex-1">{total}</p>
          </div>
          <div className="flex items-center">
            <p
              className="w-1/4 gap-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Total Transaction :
            </p>
            <p className="flex-1">
              {totalTransaction}
            </p>
        </div>
      </div>
      </div>
      <hr />
      <form onSubmit={handleSumbit}>
        <div className="container grid grid-cols-4 gap-4 p-4">
          <div className="col-span-3">
            <h3 className="pb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Transactions
            </h3>
            <table
              className="
               col-span-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4 w-4 border border-gray-300">
                    No
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Payment amount
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    {/* Action */}
                    <span className="font-semibold flex justify-center items-center">
                      <CiSettings className="text-xl font-bold" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData && formData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
                {formData && formData.map((data, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b m-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-4 w-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {index + 1}
                    </td>
                    <td
                      scope="row"
                      className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300"
                    >
                      {data.date}
                    </td>
                    <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      <label
                        htmlFor={`${data.description}-${index}`}
                        className="sr-only"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        name="description"
                        value={data.description}
                        id={`${data.description}-${index}`} // Generate a unique id using the index value
                        className="text-gray-900 sm:text-sm block w-full p-1 border-0"
                        onChange={(e) => handleFormChange(e, index)}
                      />
                    </td>
                    <td className="font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      <label
                        htmlFor={`${data.paymentAmount}-${index}`}
                        className="sr-only"
                      >
                        Payment amount
                      </label>
                      <input
                        type="number"
                        name="paymentAmount"
                        value={data.paymentAmount}
                        id={`${data.paymentAmount}-${index}`}
                        className="text-gray-900 sm:text-sm block w-full p-1 border-0"
                        placeholder="0"
                        onChange={(e) => handleFormChange(e, index)}
                        max={total}
                        min={0}
                      />
                    </td>
                    <td className="px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      <span className={`${data.status === "Paid" ? 'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300': 'bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'}`}>{data.status}</span>
                    </td>
                    <td className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300 w-10 relative">
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
                            <li>
                              <button
                                type="button"
                                onClick={() => handleModalOpen(index)}
                                className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                              >
                                <FaRegEdit />
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleCancel(index)}
                                type="button"
                                className="text-left text-red-500 flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                              >
                                <MdDelete /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}

                      {/* <button
                            onClick={() => handleCancel(index)}
                            title="action"
                            type="button"
                            className="flex items-center justify-between gap-2 text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-2.5 py-2.5 text-center"
                          >
                            <IoMdClose />
                          </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 flex items-center justify-between">
              <button
                onClick={handleAddRow}
                type="button"
                className="bg-gray-200 rounded px-2 font-semibold flex items-center gap-4"
              >
                Add transaction
              </button>
              <button
                type="button"
                className="bg-gray-200 rounded px-2 font-semibold flex items-center gap-4"
              >
                Download
              </button>
            </div>
          </div>
          <div>
            <h3 className="pb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Order Details
            </h3>
            <table
              className="
               col-span-2 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
            >
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4 w-4 border border-gray-300">
                    No
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Product id
                  </th>
                  <th scope="col" className="px-4 py-2 border border-gray-300">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody>
                {findOrder.map((order, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b m-0 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-4 w-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {index + 1}
                    </td>
                    <td
                      scope="row"
                      className="px-4 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300"
                    >
                      {order.id}
                    </td>
                    <td className="p-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border border-gray-300">
                      {order.orderItems.reduce(
                        (acc, item) => acc + item.commissionPrice,
                        0
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full p-2">
              <button
                type="submit"
                className="float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                update
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CommissionDetailsPage;
