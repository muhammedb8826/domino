import { MdDelete } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useEffect, useState } from "react";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
// import ServiceEditModal from "../common/ServiceEditModal";
import Swal from "sweetalert2";
import { createService, deleteService, getServices } from "../../redux/features/service/servicesSlice";
import ServiceEditModal from "../common/ServiceEditModal";

interface ServiceType {
  id: string;
  name: string;
}

export const Services = () => {
  const { services, isLoading, error } = useSelector(
    (state) => state.service
  );

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getServices());
  }, [dispatch])

  const [servicename, setServiceName] = useState({ name: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({});

  const handleModalOpen = (id) => {
    setModalOpen((prev) => !prev)
    setData(services.find((data) => data.id === id))
  }

  const handleChange = (e) => {
    setServiceName((prev) => ({ ...prev, name: e.target.value }));
  }

  const handleDeleteService = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this service!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The service has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteService(id));
        });
      }
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createService(servicename)).then((response) => {
      if (response.payload) {
        toast.success("Service added successfully");
        setServiceName({ name: "" });
      }
    })
  }

  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="rounded-sm px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col gap-4 p-4 items-center overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-stroke bg-white dark:bg-black p-4 mb-2 w-full sm:w-1/2">
        <legend className="bg-black text-white border px-2">
          Add new services
        </legend>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="col-span-2">
            <label
              htmlFor="service-type"
              className="mb-3 block text-sm font-medium text-black dark:text-white"
            >
              Service Type
            </label>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                type="text"
                id="service-type"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                placeholder="Service type"
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
                  Service Type
                </th>
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 && (
                <tr>
                  <td className="py-4 px-4 text-center text-gray-900 dark:text-white" colSpan={2}>
                    No data found
                  </td>
                </tr>
              )}
              {services && services.map((service: ServiceType) => (
                <tr key={service.id}>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    {service.name}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <button
                      title="edit"
                      className="me-2 text-primary hover:text-white border border-blue-700 hover:bg-primary focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(service.id)}
                    >
                      <FaRegEdit className="w-5 h-5" />
                    </button>

                    <button
                      title="delete"
                      className="ms-2 text-danger hover:text-white border border-red-700 hover:bg-danger focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
                      onClick={() => handleDeleteService(service.id)}
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

      {/* <div className="grid grid-cols-1 gap-4 w-full sm:w-1/2">
        <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[370px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              List of Material Types
            </h5>
            <p className="text-sm font-medium text-blue-600 hover:underline">
              Actions
            </p>
          </div>
          <ul
            role="list"
            className="divide-y divide-gray-200 overflow-y-auto h-full"
          >
            {services.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-gray-900">
                  No data found
                  </p>
                  </div>
                  )}
            {services && services.map((service: ServiceType) => (
              <li className="py-2" key={service.id}>
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate h-full">
                      {service.name}
                    </p>
                  </div>
                  <div className="inline-flex gap-2 items-center text-base font-semibold text-gray-900">
                  <button
                      title="edit"
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(service.id)}
                    >
                      <FaRegEdit  className="w-5 h-5" />
                    </button> 

                    <button
                      title="delete"
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
                      onClick={()=>handleDeleteService(service.id)}
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div> */}
      {modalOpen && <ServiceEditModal handleModalOpen={handleModalOpen} data={data} />}
    </div>
  );
};
