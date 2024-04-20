import { MdDelete } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { MediaEditModal } from "../common/MediaEditModal";
import { createMachines, deleteMachines, getMachines } from "../../redux/features/machine/machineSlice";


export const Machine = () => {
  const { machines, isLoading, error } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({});

  const handleModalOpen = (id) => {
    setModalOpen(!modalOpen);
    setData(machines.find((data) => data.id === id));

  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleDeleteType = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this machine!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The media has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteMachines(id));
        });
      }
    });
  }

  const resetForm = () => {
    setFormData({ name: "" })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createMachines(formData)).then((res) => {
      if (res.payload) {
        const message = "Machine created successfully"
        toast.success(message)
        resetForm();
      }
    });
  };

  if (isLoading) return <Loading />;
  if (error) return (<ErroPage error={error} />);

  return (
    <div className="rounded-sm px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col gap-4 p-4 items-center overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-stroke bg-white dark:bg-black p-4 mb-2 w-full sm:w-1/2">
        <legend className="bg-black text-white border px-2">
          Add new machine
        </legend>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="col-span-2">
            <label
              htmlFor="service-type"
              className="mb-3 block text-sm font-medium text-black dark:text-white"
            >
              Machine Name
            </label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                type="text"
                id="machine-name"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Machine name"
                name="machine"
              />

            </div>
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
                  Machine Name
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {machines.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-black dark:text-white">
                    No data found
                  </td>
                </tr>
              )}
              {machines && machines.map((data) => (
                <tr key={data.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {data.name}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      title="edit"
                      className="me-2 text-primary hover:text-white border border-blue-700 hover:bg-primary focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(data.id)}
                    >
                      <FaRegEdit className="w-5 h-5" />
                    </button>
                    <button
                      title="delete"
                      className="ms-2 text-danger hover:text-white border border-red-700 hover:bg-danger focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
                      onClick={() => handleDeleteType(data.id)}
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
      {modalOpen && <MediaEditModal handleModalOpen={handleModalOpen} data={data} />}
    </div>
  );
};
