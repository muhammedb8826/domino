import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";
import { createUnits, deleteUnits, getUnits } from "../../redux/features/unit/unitSlice";
import Swal from "sweetalert2";
import UnitEditModal from "../common/UnitEditModal";

const Unit = () => {
  const { units, isLoading, error } = useSelector(
    (state) => state.unit
  );
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [data, setData] = useState({});
  useEffect(() => {
    dispatch(getUnits());
  }, [dispatch]);

  const [formData, setFormData] = useState(
   {
    name:"",
    width: null,
    height: null,
  }
  )

  const handleModalOpen = (id) => {
    setModalOpen(!modalOpen);
    setData(units.find((data) => data.id === id));
  };

  const handleDeleteUnit = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this unit!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The unit has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteUnits(id));
        });
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createUnits(formData)).then((res) => {
      if (res.payload) {
        const message = "Unit added successfully";
        toast.success(message);
        setFormData({
          name:"",
          width: null,
          height: null
        });
      }
    }); 
  };

  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="flex flex-col gap-4 p-4 items-center border overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-black p-4 mb-2 w-full sm:w-1/2">
        <legend className="bg-black text-white border px-2">
          Add new unit
        </legend>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 md:grid-cols-4">
            <div>
              <label
                htmlFor="unitName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Unit name
              </label>
              <input
              type="text"
              value={formData.name}
              onChange={handleChange}
              name="name"
                id="unitName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="eg, cm, m, kare"
                required
              />
            </div>
            <div>
              <label
                htmlFor="width"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Width
              </label>
              <input
              type="number"
              id="width"
              name="width"
              value={formData.width || ""}
              onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="eg, 10, 20"
                required
              />
            </div>
            <div>
              <label
                htmlFor="height"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Height
              </label>
              <input
              type="number"
              name="height"
              id="height"
              value={formData.height || ""}
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

      <div className="grid grid-cols-1 gap-4 w-full sm:w-1/2">
  
        <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[370px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              Unit Names
            </h5>
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              Dimensions(wxh)
            </h5>
            <p className="text-sm font-medium text-blue-600 hover:underline">
              Actions
            </p>
          </div>
          <ul
            role="list"
            className="divide-y divide-gray-200 overflow-y-auto h-full"
          >
            {units.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-gray-900">
                  No data found
                  </p>
                  </div>
                  )}
            {units && units.map((unit) => (
              <li className="py-2" key={unit.id}>
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate h-full">
                      {unit.name}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate h-full">
                      {unit.width} x {unit.height}
                    </p>
                  </div>
                  <div className="inline-flex gap-2 items-center text-base font-semibold text-gray-900">
                  <button
                      title="edit"
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(unit.id)}
                    >
                      <FaRegEdit  className="w-5 h-5" />
                    </button> 

                    <button
                      title="delete"
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
                      onClick={()=>handleDeleteUnit(unit.id)}
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
      {modalOpen && <UnitEditModal handleModalOpen={handleModalOpen} data={data} />}

   </div>
  );
};

export default Unit;
