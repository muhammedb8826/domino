import { MdDelete } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { MaterialEditModal } from "../common/MaterialEditModal";
import { createMaterial, deleteMaterial, getMaterials, updateMaterial } from "../../redux/features/material/materialSlice";
import { getJobOrdersProducts } from "@/redux/features/jobOrderProductsSlice";
import { getProducts } from "@/redux/features/product/productSlice";
import Select from "react-select";

const JobOrderProducts = () => {

  const { products, isLoading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    productId: "",
  });


  const productOptions = products?.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const handleProductChange = (selectedOption) => {
    setFormData({ ...formData, productId: selectedOption.value })
  }

  const handleModalOpen = (id) => {
    const findData = materials.find((data) => data.id === id);
    setData(findData)
    setModalOpen((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  }

  const handleDeleteMaterial = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this material!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The material has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteMaterial(id));
        });
      }
    });
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createMaterial(formData)).then((res) => {
      if (res.payload) {
        const message = "Material added successfully";
        toast.success(message);
        setFormData({ name: "" });
      }
    });
  };
  if (isLoading) return <Loading />;
  if (error) return (<ErroPage error={error} />);
  return (
    <div className="rounded-sm px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col gap-4 p-4 items-center overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-stroke bg-white dark:bg-black p-4 mb-2 w-full sm:w-1/2">
        <legend className="bg-black text-white border px-2">
          Add new material
        </legend>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="products"
              className="mb-3 block text-sm font-medium text-black dark:text-white"
            >
              Choose Product
            </label>
            <Select
              options={productOptions}
              onChange={(selectedOption) => handleProductChange(selectedOption)}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 sm:mt-8 text-center"
          >
            Add new
          </button>
        </form>
      </fieldset>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Material Type
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center text-gray-900 dark:text-gray-400">
                    No data found
                  </td>
                </tr>
              )}
              {products && products.map((product) => (
                <tr key={product.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {product.name}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      title="edit"
                      className="me-2 text-primary hover:text-white border border-blue-700 hover:bg-primary focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(product.id)}
                    >
                      <FaRegEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => { handleDeleteMaterial(product.id) }}
                      title="delete"
                      className="ms-2 text-danger hover:text-white border border-red-700 hover:bg-danger focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
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
        </div>
      </div>
      {modalOpen && <MaterialEditModal handleModalOpen={handleModalOpen} data={data} />}
    </div>
  );
};

export default JobOrderProducts;