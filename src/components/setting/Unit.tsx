import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { getPrintingData } from "../../redux/features/print/printingSlice";

const Unit = () => {

const {printingData, isLoading, error} = useSelector((state)=> state.printing );
const dispatch = useDispatch();
useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);


  const [activeMedia, setActiveMedia] = useState("");
  const [activeMaterial, setActiveMaterial] = useState("");
  const [units, setUnits] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);

  useEffect(() => {
    if (printingData && printingData.length > 0) {
    setActiveMedia(printingData[0].type);
    setActiveMaterial(printingData[0].materials[0].name);
    setMaterials(printingData[0].materials);
    setUnits(printingData[0].materials[0].units);
    }
  }, [printingData]);

  const handleSelectedMedia = (e) => {
    const index = printingData.findIndex(
      (data) => data.type === e.target.value
    );
    setMaterialOptions(printingData[index].materials);
  };
  const handleActiveMedia = (data, index) => {
    setActiveMedia(data);
    setMaterials(printingData[index].materials);
    setActiveMaterial(printingData[index].materials[0].name);
    setUnits(printingData[index].materials[0].units);
  };

  const handleActiveMaterial = (material, index) => {
    setActiveMaterial(material);
    setUnits(materials[index].units);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  if(isLoading) return <Loading />;
  if(error) return (<ErroPage error={error} />);

  return (
    <div className="flex flex-col gap-4 p-4 items-center border h-[550px] overflow-hidden">
      <fieldset className="border border-black p-4 mb-2">
        <legend className="bg-black text-white border px-2">
          Add new material
        </legend>
        <form className="md:grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="media"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Media Name
              </label>
              <select
                onChange={(e) => handleSelectedMedia(e)}
                id="media"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option>Choose a media</option>
                {printingData.map((data, index) => (
                  <option value={data.type}>
                    {data.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="material"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Material Name
              </label>
              <select
                id="material"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option>Choose a material</option>
                {materialOptions &&
                  materialOptions.map((material) => (
                    <option value={material.name}>{material.name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="unit-name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Unit Name
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                  <TfiLayoutMediaLeftAlt />
                </span>
                <input
                  type="text"
                  id="unit-name"
                  className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="eg. cm, m, kare"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="unit-value"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Unit Value
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                  <TfiLayoutMediaLeftAlt />
                </span>
                <input
                  type="number"
                  id="unit-value"
                  className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                  placeholder="eg, 1, 2, 3"
                />
              </div>
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Add new
            </button>
          </div>
        </form>
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[320px] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-l font-bold leading-none text-gray-900 ">
                List of Media Types
              </h5>
            </div>

            <ul
              role="list"
              className="divide-y divide-gray-200 overflow-y-auto h-full"
            >
              {printingData.map((data, index) => (
                <li key={data.type}>
                  <button
                    onClick={() => handleActiveMedia(data.type, index)}
                    title={data.type}
                    type="button"
                    className={`${
                      data.type === activeMedia
                        ? "bg-black text-white"
                        : "text-gray-900"
                    } text-sm font-medium truncate h-full px-3 py-4 w-full flex items-center me-2`}
                  >
                    {data.type}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[320px] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-l font-bold leading-none text-gray-900 ">
                List of Material Types
              </h5>
            </div>

            <ul
              role="list"
              className="divide-y divide-gray-200 overflow-y-auto h-full"
            >
              {materials.map((material, index) => (
                <li key={material.name}>
                  <button
                    onClick={() => handleActiveMaterial(material.name, index)}
                    title={material.name}
                    type="button"
                    className={`${
                      material.name === activeMaterial
                        ? "bg-black text-white"
                        : "text-gray-900"
                    } text-sm font-medium truncate h-full px-3 py-4 w-full flex items-center me-2`}
                  >
                    {material.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 bg-white border rounded-lg shadow sm:p-8 h-[320px] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              List of unit name
            </h5>
            <h5 className="text-l font-bold leading-none text-gray-900 ">
              List of unit value(wxh)
            </h5>
            <p className="text-sm font-medium text-blue-600 hover:underline">
              Actions
            </p>
          </div>
          <div className="flex items-center gap-4 justify-between overflow-hidden overflow-y-auto">
            <ul role="list" className="divide-y divide-gray-200">
              {units.map((unit, index) => (
                <li className="mb-2 py-2" key={unit.name}>
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <input
                        title={unit.name}
                        value={unit.name}
                        type="text"
                        className="text-sm font-medium text-gray-900 truncate h-full"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <ul role="list" className="divide-y divide-gray-200">
              {units.map((unit, index) => (
                <li className="mb-2 py-2" key={unit.value}>
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <input
                        title={unit.value}
                        value={unit.value}
                        type="text"
                        className="text-sm font-medium text-gray-900 truncate h-full"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <ul role="list" className="divide-y divide-gray-200">
           {units.map((unit, index) => (
            <li className="mb-2" key={index}>
            <div className="inline-flex items-center text-base font-semibold text-gray-900">
              <button
                title={`delete ${unit.name}, ${unit.value} `}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                type="button"
              >
                <MdDelete className="w-5 h-5" />
              </button>
            </div>
            </li>
           ))}
           </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unit;
