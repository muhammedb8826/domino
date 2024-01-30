import { MdDelete } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { useEffect, useState } from "react";
import { createPrintingData, deletePrintingData, getPrintingData } from "../../redux/features/print/printingSlice";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { Modal } from "../common/Modal";

export const Media = () => {
  const {printingData, isLoading, error} = useSelector((state)=> state.printing );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    type: "",
    materials: [],
    services: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({});

  const handleModalOpen = (id) => {
    setModalOpen(!modalOpen);
    setData(printingData.find((data) => data.id === id));
        
  }

  const handleDeleteType = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this media!",
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
          dispatch(deletePrintingData(id));
        });
      }
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(createPrintingData(formData)).then((res) => {
      if(res.payload) {
        const message = "Media created successfully"
        toast(message)
        setFormData({type: "", materials: [], services: []})
      }
    });
  };

  if (isLoading) return <Loading />;
  if(error) return (<ErroPage error={error} />);

  return (
    <div className="flex flex-col gap-4 p-4 justify-between items-center border h-[550px] overflow-hidden overflow-y-auto">
      <form className="w-1/2" onSubmit={handleSubmit}>
        <label
          htmlFor="media-name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Media Name
        </label>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
            <TfiLayoutMediaLeftAlt />
          </span>
          <input
          onChange={(e) =>setFormData({...formData, type: e.target.value})}
            type="text"
            id="media-name"
            className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
            placeholder="Media type"
            value={formData.type}
          />
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Add new
          </button>
        </div>
      </form>

      <div className="w-1/2 p-4 bg-white border rounded-lg shadow sm:p-8">
        <div className="flex flex-1 items-center justify-between mb-4">
          <h5 className="text-l font-bold leading-none text-gray-900 ">
            List of Media Types
          </h5>
          <p className="text-sm text-center font-medium text-blue-600 hover:underline w-1/4">
            Actions
          </p>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {printingData.map((data, index) => (
              <li key={data.id} className="py-2">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p
                      className="text-sm font-medium text-gray-900 truncate h-full"
                    >
                      {data.type}
                    </p>
                  </div>
                  <div className="inline-flex gap-4 items-center text-base font-semibold text-gray-900">
                  <button
                      title="edit"
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(data.id)}
                    >
                      <FaRegEdit  className="w-5 h-5" />
                    </button>
                    <button
                      title="delete"
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleDeleteType(data.id)}
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
     {modalOpen && <Modal handleModalOpen={handleModalOpen} data={data} />}
    </div>
  );
};
