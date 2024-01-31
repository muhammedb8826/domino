import { Checkbox, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { getPrintingData, updatePrintingData } from "../../redux/features/print/printingSlice";
import { toast } from "react-toastify";

const Pricing = () => {
  const { printingData, isLoading, error } = useSelector(
    (state) => state.printing
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);
  // const [printingDataState, setPrintingDataState] = useState(printingData);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [unitPrice, setUnitPrice] = useState(0);

const handleSelectMaterial = (
  e: React.ChangeEvent<HTMLSelectElement>,
  index: number
) => {
  const selectedValue = e.target.value;
  const material = printingData[index].materials.find(
    (material) => material.name === selectedValue
  );

  // Create a copy of selectedMaterials array
  const updatedSelectedMaterials = [...selectedMaterials];

  // Update the selected material for the specific row
  updatedSelectedMaterials[index] = material;

  // Update the selected materials
  setSelectedMaterials(updatedSelectedMaterials);
};


  
const handleSelectedUnit = (e, index) => {
  const selectedValue = e.target.value;

  // Find the selected material
  const selectedMaterial = selectedMaterials[index];

  // Find the selected unit for the material
  const selectedUnit = selectedMaterial?.units.find(
    (unit) => unit.name === selectedValue
  );

  // Update the selected units
  setSelectedUnits((prevSelectedUnits) => {
    const updatedSelectedUnits = [...prevSelectedUnits];
    updatedSelectedUnits[index] = selectedUnit;
    return updatedSelectedUnits;
  });
};

const handleChange = (e) => {
  setUnitPrice(e.target.value);
};

const handleSubmit = (e, index) => {
  e.preventDefault();

console.log(unitPrice);

  if (selectedMaterials.length === 0 || selectedUnits.length === 0) {
    alert('Please select a material and a unit');
    return;
  }

  const material = selectedMaterials[index];
  const {name: materialName} = material;
  const findMaterialIndex = printingData.findIndex(
    (data) => data.materials.some((m) => m.name === materialName)
  );
  console.log(findMaterialIndex);

  if (findMaterialIndex === -1) {
    alert('Material not found in printingData array');
    return;
  }


const unit = selectedUnits[index];

  const price = parseFloat(unitPrice);

  const updatedUnit = { ...unit, price };

  const { name } = updatedUnit;


  const findUnitIndex = printingData[findMaterialIndex].materials
    .find((m) => m.name === materialName)
    .units.findIndex((u) => u.name === name);

  if (findUnitIndex === -1) {
    alert('Unit not found in material.units array');
    return;
  }

  const updatedMaterial = {
    ...printingData[findMaterialIndex],
    materials: printingData[findMaterialIndex].materials.map((m) => {
      if (m.name === materialName) {
        return {
          ...m,
          units: m.units.map((u) => (u.name === name ? updatedUnit : u)),
        };
      }
      return m;
    }),
  };
const formData = updatedMaterial;
console.log(formData);

  dispatch(updatePrintingData(formData)).then((res) => {
    if(res.payload) {
      const message = "price updated successfully"
      toast(message)
      setUnitPrice(0)
    }
  }); 
  

  // Creating a new array with the updated object
  const updatedPrintingData = [
    ...printingData.slice(0, findMaterialIndex),
    updatedMaterial,
    ...printingData.slice(findMaterialIndex + 1),
  ];

  console.log(updatedPrintingData);
  
};

console.log(printingData);




  if (isLoading) return <Loading />;
  if (error) return <ErroPage error={error} />;

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
        <div>
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            <FaUserPlus />
            <span className="ml-2">Add New User</span>
          </button>
        </div>

        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for users"
          />
        </div>
      </div>

      <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox />
          </Table.HeadCell>
          <Table.HeadCell>Media name</Table.HeadCell>
          <Table.HeadCell>Material</Table.HeadCell>
          <Table.HeadCell>Services</Table.HeadCell>

          <Table.HeadCell>Unit name</Table.HeadCell>
          <Table.HeadCell>Unit value</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Unit price</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {printingData.map((data, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="p-4">
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {data.type}
              </Table.Cell>
              <Table.Cell>
              <select
              value={selectedMaterials[index]?.name || ''}
              required
                onChange={(e) => handleSelectMaterial(e, index)}
                title="materials"
                id={`material-${index}`}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Choose a material</option>
                {data.materials?.map((material) => (
                  <option value={material.name} key={material.name}>
                    {material.name}
                  </option>
                ))}
              </select>
              </Table.Cell>
              <Table.Cell>
              <select
              value={selectedUnits[index]?.name || ''}
              required
                onChange={(e) => handleSelectedUnit(e, index)}
                title="units"
                id={`unit-${index}`}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Choose a unit</option>
                {selectedMaterials[index]?.units?.map((unit) => (
                  <option value={unit.name} key={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </select>
              </Table.Cell>
              <Table.Cell>
              <select
              
              required
                onChange={(e) => handleSelectedUnit(e, index)}
                title="service type"
                id={`unit-${index}`}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="">Choose a unit</option>
                {selectedMaterials[index]?.services?.map((service) => (
                  <option value={service} key={service}>
                    {service}
                  </option>
                ))}
              </select>
              </Table.Cell>
              <Table.Cell>
              <p>{selectedUnits[index]?.value}</p>
              </Table.Cell>
              <Table.Cell>
                
              <form onSubmit={(e) => handleSubmit(e, index)}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <input
                      onChange={handleChange}
                        type="number"
                        id="price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="eg, 100"
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </Table.Cell>
              <Table.Cell>
                <p>{selectedUnits[index]?.price}</p>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Pricing;
