import { Checkbox, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import {
  getPrintingData,
  updatePrintingData,
} from "../../redux/features/print/printingSlice";
import { toast } from "react-toastify";
import PriceDetailsModal from "./PriceDetailsModal";

const Pricing = () => {
  const { printingData, isLoading, error } = useSelector(
    (state) => state.printing
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);

  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({});
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState({});

  const [formData, setFormData] = useState({
    type: "",
    material: "",
    service: "",
    unitName: "",
    unitValue: "",
    price: "",
  });

  const handleSelectedMaterial = (e, index) => {
    if(e.target.value === "") return;
    const type = printingData[index].type;
    setFormData({ ...formData, type, material: e.target.value });
    
    const data = printingData[index].materials.find(
      (material) => material.name === e.target.value
    );
    setSelectedMaterial(data);
    setSelectedRowIndex(index);
  };


  const handleModalOpen = (id) => {
    setModalOpen(!modalOpen);
    setData(printingData.find((data) => data.id === id));
  };

  const handleSelecteSerives = (e) => {
    if(e.target.value === "") return;
    setFormData({ ...formData, service: e.target.value });
  };

  const handleSelectUnit = (e, index) => {
    if (e.target.value === "") return;
  
    setFormData({ ...formData, unitName: e.target.value });
    
  
    const data = selectedMaterial && selectedMaterial.units
      ? selectedMaterial.units.find((unit) => unit.name === e.target.value)
      : null;
  
    if (data) {
      setSelectedUnit(data);
      setFormData({ ...formData, unitName: data.name, unitValue: data.value });
    }
  };
 


  
  const handlePriceChange = (e, index) => {
    const newFormData = { ...formData };
    newFormData.price = e.target.value;

    // Assuming that you want to store the price in the state only for the selected row
    if (selectedRowIndex === index) {
      setFormData(newFormData);
    }

    // const calculatedUnitPrice = data.value * formData.price;

  };

  const resetForm = () => {
    setFormData({
      type: "",
      material: "",
      service: "",
      unitName: "",
      unitValue: "",
      price: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.material || !formData.service || !formData.unitName || !formData.price) {
     alert("Please fill all the fields");
      return;
    }
    const mediaType = printingData[selectedRowIndex].type;
    const findData = printingData.find((data) => data.type === mediaType);

    const updatedData = { ...findData };

  // Append the new entry to the 'price' array
  updatedData.price = [...updatedData.price, { ...formData }];
    
    dispatch(updatePrintingData(updatedData)).then((res) => {
      if (res.payload) {
        const message = "Pricing updated successfully";
        toast(message);
        resetForm();
      }
    });
  };

  

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
        </Table.Head>
        <Table.Body className="divide-y">
          {printingData.map((data, index) => (
            <Table.Row
              key={index}
              className={`bg-white dark:border-gray-700 dark:bg-gray-800 ${
                selectedRowIndex === index ? 'selected-row' : ''
              }`}
            >
              <Table.Cell className="p-4">
                <Checkbox />
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              <button
                  onClick={()=>handleModalOpen(data.id)}
                   type="button" title="click to see details" className="text-blue-500 hover:underline">
                {data.type}
                </button>
              </Table.Cell>
              <Table.Cell>
                <select
                  onChange={(e)=>handleSelectedMaterial(e, index)}
                  required
                  title="materials"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Choose a material</option>
                  {data.materials.map((material, index) => (
                    <option value={material.name} key={index}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </Table.Cell>
              <Table.Cell>
                <select
                onChange={handleSelecteSerives}
                  required
                  title="services"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Choose a services</option>
                  {data.services.map((service, index) => (
                    <option value={service} key={index}>
                      {service}
                    </option>
                  ))}
                </select>
              </Table.Cell>
              <Table.Cell>
                <select
                  onChange={(e)=>handleSelectUnit(e, index)}
                  title="unit"
                  required
                  id="unit"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="">Choose a unit</option>
                  {selectedMaterial && selectedMaterial.units?.map((unit, index) => (
                    <option value={unit.name} key={index}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </Table.Cell>
              <Table.Cell>
              {selectedRowIndex === index && <p>{selectedUnit?.value}</p>}
              </Table.Cell>
              <Table.Cell>
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                    <input
                    onChange={(e) => handlePriceChange(e, index)}
                    value={selectedRowIndex === index ? formData.price : ''}
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
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {modalOpen && <PriceDetailsModal data={data} handleModalOpen={handleModalOpen} />}
    </div>
  );
};

export default Pricing;
