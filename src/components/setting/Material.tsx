import { MdDelete } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useEffect, useState } from "react";
import {  getPrintingData } from "../../redux/features/print/printingSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
const Material = () => {
   const { printingData, isLoading, error } = useSelector((state)=> state.printing );
   const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getPrintingData());
      }, [dispatch]);

    const [active, setActive] = useState(""); 
    const [materials, setMaterials] = useState([]);
    useEffect(() => {
      if (printingData && printingData.length > 0) {
        setActive(printingData[0].type);
        setMaterials(printingData[0].materials);
      }
    }, [printingData]);
    const handleActive = (type: string, index: number) => {
        setActive(type);
        setMaterials(printingData[index].materials);
    }

    if (isLoading) return <Loading />;
    if(error) return (<ErroPage error={error} />);
  return (
    <div className="flex flex-col gap-4 p-4 items-center border h-[550px] overflow-hidden">
      <fieldset className="border border-black p-4 mb-2">
        <legend className="bg-black text-white border px-2">
          Add new material
        </legend>
        <form className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="media"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Media Name
            </label>
            <select
              id="media"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              defaultValue="Choose a media"
            >
              <option disabled>Choose a media</option>
              {printingData.map((data) => (
                <option value={data.type}>{data.type}</option>
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

      <div className="grid grid-cols-2 gap-4 lg:w-[55%]">
        <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[370px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              List of Media Types
            </h5>
          </div>

          <ul role="list" className="divide-y divide-gray-200 overflow-y-auto h-full">
            {printingData.map((data, index) => (
              <li>
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
            {materials.map((material, index) => (
              <li className="py-2">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <input
                      title={material.name}
                      value={material.name}
                      type="text"
                      className="text-sm font-medium text-gray-900 truncate h-full"
                    />
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    <button
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
    </div>
  );
};

export default Material;
