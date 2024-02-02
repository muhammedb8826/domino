import { MdDelete } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useEffect, useRef, useState } from "react";
import {  getPrintingData, updatePrintingData } from "../../redux/features/print/printingSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaRegEdit } from "react-icons/fa";
import { MaterialEditModal } from "../common/MaterialEditModal";
const Material = () => {
  const inputRef = useRef();
   const { printingData, isLoading, error } = useSelector((state)=> state.printing );
   const [formData, setFormData] = useState({});
   const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPrintingData());
      }, [dispatch]);

    const [active, setActive] = useState(""); 
    const [modalOpen, setModalOpen] = useState(false);
    const [materials, setMaterials] = useState([]);

    const handleActive = (type: string, index: number) => {
        setActive(type);
        setMaterials(printingData[index].materials);
    }

    const updateMaterial = (updatedMaterial, materialIndex) => {
      // Update the material in the state or Redux store
      const updatedMaterials = [...materials];
      updatedMaterials[materialIndex] = updatedMaterial;
      setMaterials(updatedMaterials);
    };

    const handleSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = e.target.value;
        const index = printingData.findIndex((data) => data.type === selected);
        setFormData(printingData[index]);
    };

    const [data, setData] = useState({});
    const [materialIndex, setMaterialIndex] = useState(0);

const handleModalOpen = (index: number) => {
      const findData = printingData.find((data) => data.type === active);      
      setData(findData)
      setMaterialIndex(index)
      setModalOpen(!modalOpen);
    };


    const handleDeleMaterial = (name: string, index: number) => {
      const findData = printingData.find((data) => data.type === active);
       const filteredMaterials = materials.filter((material) => material.name !== name);
        
        const oldData = findData;
        const updatedData = {
          ...oldData,
          materials: filteredMaterials,
        };
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
              dispatch(updatePrintingData(updatedData))
              setMaterials(filteredMaterials);
            });
          }
        });   
    };
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

        const oldData = formData;

        const updatedData = {
          ...oldData,
          materials: [...oldData.materials, { name: inputRef.current.value, units: []}],
        };

        dispatch(updatePrintingData(updatedData)).then((res) => {
          if (res.payload) {
            setMaterials(res.payload.materials);
            const message = "Material added successfully";
            toast(message);
            setFormData((prevData) => ({
              ...prevData,
              materials: [],
            }));
          }
        });
    };
    if (isLoading) return <Loading />;
    if(error) return (<ErroPage error={error} />);
  return (
    <div className="flex flex-col gap-4 p-4 items-center overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-black p-4 mb-2">
        <legend className="bg-black text-white border px-2">
          Add new material
        </legend>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="media"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Media Name
            </label>
            <select
            onChange={handleSelected}
              id="media"
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Choose a media</option>
              {printingData.map((data) => (
                <option value={data.type} key={data.type}>{data.type}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="material-type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Material Type
            </label>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                <TfiLayoutMediaLeftAlt />
              </span>
              <input
              required
                ref={inputRef}
                type="text"
                id="material-type"
                className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                placeholder="Material type"
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

      <div className="grid grid-cols-2 gap-4 w-full lg:w-[65%]">
        <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[370px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              List of Media Types
            </h5>
          </div>

          <ul role="list" className="divide-y divide-gray-200 overflow-y-auto h-full">
            {printingData.map((data, index) => (
              <li key={data.type}>
                    <button
                      onClick={() => handleActive(data.type, index)}
                      title={data.type}
                      type="button"
                      className={`${data.type === active? "bg-black text-white" : "text-gray-900"} text-sm font-medium truncate h-full px-3 py-4 w-full flex items-center me-2`}
                    >
                      {data.type}
                    </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[370px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              List of Material Types
            </h5>
            <p className="text-sm font-medium text-blue-600 hover:underline">
              Actions
            </p>
          </div>
          <ul role="list" className="divide-y divide-gray-200 overflow-y-auto h-full">
            {active? materials.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-900">
                  No data found
                </p>
              </div>
            ): 
            (
              <div className="flex flex-col items-center justify-center">
                <p className="text-gray-900">
                  please select media to see
                </p>
              </div>
            )
            }
            {materials && materials.map((material, index) => (
              <li className="py-2" key={material.name}>
                <div className="flex items-center">
                <div className="flex-1 min-w-0 ms-4">
                    <p
                      className="text-sm font-medium text-gray-900 truncate h-full"
                    >
                      {material.name}
                    </p>
                  </div>
                  <div className="inline-flex gap-4 items-center text-base font-semibold text-gray-900">
                  <button
                      title="edit"
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(index)}
                    >
                      <FaRegEdit  className="w-5 h-5" />
                    </button>

                    <button
                    onClick={() => {handleDeleMaterial(material.name, index)}}
                      title="delete"
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
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
      {modalOpen && <MaterialEditModal handleModalOpen={handleModalOpen} data={data} index={materialIndex} updateMaterial={updateMaterial} />}
    </div>
  );
};

export default Material;