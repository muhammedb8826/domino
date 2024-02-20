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
  useEffect(()=>{
    dispatch(getServices());
  },[dispatch])
  
  const [servicename, setServiceName] = useState({name: ""});
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData]= useState({});

  const handleModalOpen = (id) => {
    setModalOpen((prev)=> !prev)
    setData(services.find((data)=> data.id === id))
  }

  const handleChange = (e)=> {
    setServiceName((prev)=>({...prev, name: e.target.value}));
  }

  const handleDeleteService = (id)=> {
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

  const handleSubmit = (e)=>{
    e.preventDefault();
   dispatch(createService(servicename)).then((response)=>{
    if(response.payload){
      toast.success("Service added successfully");
      setServiceName({name: ""});
    }
    })
  }

  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="flex flex-col gap-4 p-4 items-center border overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-black p-4 mb-2 w-full sm:w-1/2">
        <legend className="bg-black text-white border px-2">
          Add new services
        </legend>
        <form onSubmit={handleSubmit}>

          <div>
            <label
              htmlFor="service-type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Service Type
            </label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                <TfiLayoutMediaLeftAlt />
              </span>
              <input
                onChange={handleChange}
                type="text"
                id="service-type"
                className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                placeholder="Service type"
              />
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Add new
              </button>
            </div>
          </div>
        </form>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 w-full sm:w-1/2">
  
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
      </div>
      {modalOpen && <ServiceEditModal handleModalOpen={handleModalOpen} data={data} />}
    </div>
  );
};
