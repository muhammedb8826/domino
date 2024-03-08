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
    <div className="flex flex-col gap-4 p-4 items-center border overflow-y-auto h-full" id="style-4">
     <fieldset className="border border-black p-4 mb-2 w-full mx-auto">
        <legend className="bg-black text-white border px-2">
          Add new dicount
        </legend>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 md:grid-cols-4">
            <div>
              <label
                htmlFor="level"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Level
              </label>
              <input
              type="number"
              value={formData.level || ""}
              onChange={handleChange}
              name="level"
                id="level"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="eg, 1, 2, 3"
                required
              />
            </div>
            <div>
              <label
                htmlFor="minumumMeterSquare"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Minimum meter square
              </label>
              <input
              type="number"
              id="minumumMeterSquare"
              name="minumumMeterSquare"
              value={formData.minumumMeterSquare || ""}
              onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="eg, 10, 20"
                required
              />
            </div>
            <div>
              <label
                htmlFor="discountPercentage"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Percentage %
              </label>
              <input
              type="number"
              name="discountPercentage"
              id="discountPercentage"
              value={formData.discountPercentage || ""}
              onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="eg, 10, 20"
                required
              />
            </div>
            <div className="flex items-end justify-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add new
            </button>
            </div>
          </div>
        </form>
      </fieldset> 

    <div className="flex flex-col gap-4 p-4 w-full items-center border overflow-y-auto h-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Levels
            </th>
            <th scope="col" className="px-6 py-3">
             Meter square
            </th>
            <th scope="col" className="px-6 py-3">
              Discount %
            </th>
            <th scope="col" className="px-6 py-3">
              ActionS
            </th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount, index) => (
            <tr
              key={discount.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-search-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {discount.level}
              </th>
              <td className="px-6 py-4">
                {discount.minumumMeterSquare}
              </td>
              <td className="px-6 py-4">
                {discount.discountPercentage}
              </td>
              <td className="px-6 py-4">
              <button
                      title="edit"
                      className="me-2 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(discount.id)}
                    >
                      <FaRegEdit  className="w-5 h-5" />
                    </button>
                    <button
                      title="delete"
                      className="ms-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
                      onClick={()=>handleDeleteDiscount(discount.id)}
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
  );
};

export default Discount;
