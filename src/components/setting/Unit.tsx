import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { getPrintingData, updatePrintingData } from "../../redux/features/print/printingSlice";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";

const Unit = () => {
  const { printingData, isLoading, error } = useSelector(
    (state) => state.printing
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);

  const [activeMedia, setActiveMedia] = useState("");
  const [activeMaterial, setActiveMaterial] = useState("");
  const [units, setUnits] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState("")
  const [selectedMaterial, setSelectedMaterial]= useState("");
  const [formData, setFormData] = useState(
   {
    unitName:"",
    width: "",
    height: "",
    price: 0
  }
  )


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the specific property in the formData object
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

const handleSelectedMaterial = (e)=>{
  setSelectedMaterial(e.target.value)  
}


  const handleSelectedMedia = (e) => {
    const index = printingData.findIndex(
      (data) => data.type === e.target.value
    );

    setSelectedMedia(e.target.value);
    // setting the materials options of selected media
    setMaterialOptions(printingData[index].materials);
  };

  const handleActiveMedia = (data, index) => {
    setActiveMedia(data);
    setMaterials(printingData[index].materials);
    // setActiveMaterial(printingData[index].materials[0].name);
    // setUnits(printingData[index].materials[0].units);
  };

  const handleActiveMaterial = (material, index) => {
    setActiveMaterial(material);
    setUnits(materials[index].units);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const findMediaIndex = printingData.findIndex((data) => data.type === selectedMedia);
    const findMaterialIndex = materialOptions.findIndex((material) => material.name === selectedMaterial);
    const media = printingData[findMediaIndex];
    const material = printingData[findMediaIndex].materials[findMaterialIndex];
    const unit = {
      name: formData.unitName,
      value: `${formData.width}x${formData.height}`,
      price: formData.price
    }
    const newUnit = [...material.units, unit];
    const newMaterial = {...material, units: newUnit};
    const newMaterials = [...media.materials];
    newMaterials[findMaterialIndex] = newMaterial;
    const newMedia = {...media, materials: newMaterials};
    console.log(newMedia);
    
    // const newPrintingData = [...printingData];
    // newPrintingData[findMediaIndex] = newMedia;
    // console.log(newPrintingData);
    
    dispatch(updatePrintingData(newMedia)).then((res) => {
      if (res.payload) {
        setMaterials(res.payload.materials);
        const message = "Unit added successfully";
        toast(message);
        setFormData({unitName:"", width: "", height: "", price: 0});
      }
    });
    
    
  };

  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="flex flex-col gap-4 p-4 items-center border overflow-y-auto h-full" id="style-4">
      <fieldset className="border border-black p-4 mb-2">
        <legend className="bg-black text-white border px-2">
          Add new unit
        </legend>
        <form className="flex justify-between gap-2" onSubmit={handleSubmit}>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <label
                htmlFor="media"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Media Name
              </label>
              <select
                required
                onChange={handleSelectedMedia}
                id="media"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Choose a media</option>
                {printingData.map((data) => (
                  <option value={data.type} key={data.id}>{data.type}</option>
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
               onChange={handleSelectedMaterial}
                required
                id="material"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="">Choose a material</option>
                {materialOptions.map((material) => (
                  <option value={material.name} key={material.name}>{material.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <label
                htmlFor="unitName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Unit name
              </label>
              <input
              type="text"
              value={formData.unitName}
              onChange={handleChange}
              name="unitName"
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
              value={formData.width}
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
              value={formData.height}
              onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="eg, 10, 20"
                required
              />
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
              {activeMedia ? materials.length === 0 && (
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
          <div className="flex items-center justify-between mb-4 gap-4">
            <h5 className="text-l font-bold leading-none text-gray-900 w-1/4 ">
              Unit names
            </h5>
            <h5 className="text-l font-bold leading-none text-gray-900 w-1/4">
              Values(wxh)
            </h5>
            <p className="text-sm text-end me-6 font-medium text-blue-600 hover:underline flex-1">
              Actions
            </p>
          </div>
          <div className="flex items-center gap-4 justify-between overflow-hidden overflow-y-auto">

            <ul role="list" className="divide-y divide-gray-200 w-1/4">
              {activeMaterial && units.map((unit, index) => (
                <li className="mb-2 py-2" key={unit.name}>
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                    <p
                      className="text-sm font-medium text-gray-900 truncate h-full"
                    >
                      {unit.name}
                    </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <ul role="list" className="divide-y divide-gray-200 w-1/4">
              {activeMaterial && units.map((unit, index) => (
                <li className="mb-2 py-2" key={unit.value}>
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                    <p
                      className="text-sm font-medium text-gray-900 truncate h-full"
                    >
                      {unit.value}
                    </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <ul role="list" className="divide-y divide-gray-200 flex-1">
              {activeMaterial && units.map((unit, index) => (
                <li className="mb-2 flex items-center justify-end" key={index}>
                  <div className="inline-flex gap-2 items-center text-base font-semibold text-gray-900">
                  <button
                      title="edit"
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                    >
                      <FaRegEdit  className="w-4 h-4" />
                    </button>
                    
                    <button
                      title={`delete ${unit.name}, ${unit.value} `}
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 text-center"
                      type="button"
                    >
                      <MdDelete className="w-4 h-4" />
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
