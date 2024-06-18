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
  getCommissionById,
  getCommissions,
  updateCommission,
} from "@/redux/features/commission/commissionSlice";
import { GoBack } from "../common/GoBack";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { RootState } from "@/redux/store";
import { getSalesPartnerById, getSalesPartners } from "@/redux/features/salesPartnersSlice";
import Loader from "@/common/Loader";
import Breadcrumb from "../Breadcrumb";

const date = new Date();
const options = { month: "short", day: "numeric", year: "numeric" };
const formattedDate = date.toLocaleDateString("en-US", options);

const CommissionDetailsPage = () => {
  const { id } = useParams();
  console.log(id);
  
  const { orders } = useSelector((state) => state.order);
  const { singleCommission, isLoading, error } = useSelector(
    (state) => state.commission
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrders());
    dispatch(getCommissions());
    dispatch(getCommissionById(id));
  }, [dispatch, id]);

  const [formData, setFormData] = useState([
    {
      date: formattedDate,
      description: "",
      paymentAmount: "",
      status: "Earning",
    },
  ]);

  const [balance, setBalance] = useState(0);
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
    setFormData((prevFormData) => [
      ...prevFormData,
      {
        date: formattedDate,
        description: "",
        paymentAmount: "",
        status: "Earning",
      },
    ]);
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

  useEffect(() => {
    const findOrder = orders.filter((order) => order.commissionId === id);
    const totalSum = findOrder.map((order) =>
      order.orderItems
        .map((price) => price.commissionPrice)
        .reduce((a, b) => a + b, 0)
    );
    const total = totalSum.reduce((a, b) => a + b, 0);
    setBalance(total - totalTransaction);
  }, [orders, id, totalTransaction]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (balance < 0) {
      const message =
        "Transaction amount cannot be greater than balance amount";
      toast.error(message);
      return;
    }

    const updatedFormData = formData.map((data) => {
      if (Number(data.paymentAmount) > 0) {
        return { ...data, status: "Paid" };
      } else {
        return data;
      }
    });

    if (updatedFormData.length === 0) {
      const message = "Please add a transaction";
      toast.error(message);
      return;
    }

    const transaction = {
      ...singleCommission,
      data: updatedFormData,
      balance,
      id: singleCommission.id,
    };

    dispatch(updateCommission(transaction)).then((res) => {
      if (res.payload) {
        const message = "Transaction added successfully";
        toast.success(message);
        setFormData(res.payload.data);
      }
    });
  };

  if (error) {
    return <ErroPage error={error} />;
  }
 
  return isLoading ? (<Loader/>): (
    <>
    <Breadcrumb pageName="Transaction details" />
    <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for customers"
          />
        </div>
      </div>
      <div className="rounded-sm border border-stroke border-t-0 bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                  Date
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Amount
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Percent
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Description
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {singleCommission?.transactions.map((transaction, index) =>
                <tr key={index}>
                  <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                    {transaction.date}
                  </td>
                  <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                    {transaction.amount}
                  </td>
                  <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                    {transaction.percent}
                  </td>
                  <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                    {transaction.description}
                  </td>
                  <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                    {transaction.status}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <nav
            className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                1-10
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                1000
              </span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Previous
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  aria-current="page"
                  className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  4
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  5
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
          </div>
        </div>
    </>
  );
};

export default CommissionDetailsPage;
