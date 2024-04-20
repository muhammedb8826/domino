import { useEffect, useState } from "react";
import { CiMenuKebab, CiRead } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { FaPlus, FaRegEdit, FaUserEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ToggleSwitch } from "flowbite-react";
import "../../assets/styles/main.css";
import { createDiscounts, deleteDiscounts, getDiscounts } from "@/redux/features/dicount/dicountSlice";
import { toast } from "react-toastify";
import DiscountEditModal from "../common/DiscountEditModal";
import Swal from "sweetalert2";

const Discount = () => {
  const { discounts, isLoading, error } = useSelector((state) => state.discount);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDiscounts());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    level: 0,
    minumumMeterSquare: 0,
    discountPercentage: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({});

  const handleModalOpen = (id) => {
    setModalOpen(!modalOpen);
    setData(discounts.find((data) => data.id === id));

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleDeleteDiscount = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this discount!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The discount has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteDiscounts(id));
        });
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createDiscounts(formData)).then((res) => {
      if (res.payload) {
        toast.success("Discount created successfully");
        setFormData({
          level: 0,
          minumumMeterSquare: 0,
          discountPercentage: 0,
        });
      }
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="rounded-sm px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-stroke bg-white dark:bg-black p-4 mb-2 w-full mx-auto">
        <legend className="bg-black text-white border px-2">
          Add new dicount
        </legend>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 md:grid-cols-4">
            <div>
              <label
                htmlFor="level"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Level
              </label>
              <input
                type="number"
                value={formData.level || ""}
                onChange={handleChange}
                name="level"
                id="level"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="eg, 1, 2, 3"
                required
              />
            </div>
            <div>
              <label
                htmlFor="minumumMeterSquare"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Minimum meter square
              </label>
              <input
                type="number"
                id="minumumMeterSquare"
                name="minumumMeterSquare"
                value={formData.minumumMeterSquare || ""}
                onChange={handleChange}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="eg, 10, 20"
                required
              />
            </div>
            <div>
              <label
                htmlFor="discountPercentage"
                className="mb-3 block text-sm font-medium text-black dark:text-white"
              >
                Percentage %
              </label>
              <input
                type="number"
                name="discountPercentage"
                id="discountPercentage"
                value={formData.discountPercentage || ""}
                onChange={handleChange}
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="eg, 10, 20"
                required
              />
            </div>
            <div className="flex items-end justify-center">
              <button
                type="submit"
                className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add new
              </button>
            </div>
          </div>
        </form>
      </fieldset>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Levels
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Meter square
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Discount %
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount, index) => (
                <tr key={discount.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {discount.level}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {discount.minumumMeterSquare}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {discount.discountPercentage}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      title="edit"
                      className="me-2 text-primary hover:text-white border border-blue-700 hover:bg-primary focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(discount.id)}
                    >
                      <FaRegEdit className="w-5 h-5" />
                    </button>
                    <button
                      title="delete"
                      className="ms-2 text-danger hover:text-white border border-red-700 hover:bg-danger focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
                      onClick={() => handleDeleteDiscount(discount.id)}
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
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
          {modalOpen && <DiscountEditModal handleModalOpen={handleModalOpen} data={data} />}

        </div>
      </div>
    </div>
  );
};

export default Discount;
