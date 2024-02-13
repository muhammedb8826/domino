import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getMachines } from "../../redux/features/machine/machineSlice";
import { getMaterials } from "../../redux/features/material/materialSlice";
import { getServices } from "../../redux/features/service/servicesSlice";
import { getUnits } from "../../redux/features/unit/unitSlice";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";
import { createprice } from "../../redux/features/price/pricingSlice";
import { RiPriceTag2Line } from "react-icons/ri";
// import options from "tailwind-datepicker-react/types/Options";

const PriceDetailsModal = ({ handleModalOpen }) => {
  const { machines, isLoading, error } = useSelector((state) => state.machine);
  const { materials } = useSelector((state) => state.material);
  const { units } = useSelector((state) => state.unit);
  const { services } = useSelector((state) => state.service);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMachines());
    dispatch(getMaterials());
    dispatch(getServices());
    dispatch(getUnits());
  }, [dispatch]);

  const [machineOptions, setMachineOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [formData, setFormData] = useState({
    machine: "",
    material: "",
    service: "",
    unit: "",
    unitPrice: "",
  });

  console.log(machineOptions);

  const mapOptions = (data) => {
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };

  useEffect(() => {
    setMachineOptions(mapOptions(machines));
    setMaterialOptions(mapOptions(materials));
    setServiceOptions(mapOptions(services));
    setUnitOptions(mapOptions(units));
  }, [machines, materials, services, units]);

  const loadOptions = (inputValue: string, callback) => {
    setTimeout(() => {
      const filteredOption = machineOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOption);
    }, 1000);
  };

  const loadOptionsMaterial = (inputValue: string, callback) => {
    setTimeout(() => {
      const filteredOption = materialOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOption);
    }, 1000);
  };

  const loadOptionsService = (inputValue: string, callback) => {
    setTimeout(() => {
      const filteredOption = serviceOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOption);
    }, 1000);
  };

  const loadOptionsUnit = (inputValue: string, callback) => {
    setTimeout(() => {
      const filteredOption = unitOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filteredOption);
    }, 1000);
  };

  const handleMachine = (selectedOption) => {
    setFormData({ ...formData, machine: selectedOption.value});
  };
  const handleMaterial = (selectedOption) => {
    setFormData({ ...formData, material: selectedOption.value });
  };
  const handleService = (selectedOption) => {
    setFormData({ ...formData, service: selectedOption.value });
  };
  const handleUnit = (selectedOption) => {
    setFormData({ ...formData, unit: selectedOption.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
const {machine, material, service, unit, unitPrice} = formData;
const machineName = machineOptions.find((item) => item.value === machine);
const materialName = materialOptions.find((item) => item.value === material);
const serviceName = serviceOptions.find((item) => item.value === service);
const unitName = units.find((item) => item.id === unit);

const data = {
  machine: machineName,
  material: materialName,
  service: serviceName,
  unit: unitName,
  unitPrice
}
    
    dispatch(createprice(data)).then((res) => {
      if (res.payload) {
        const message = "Price added successfully";
        toast.success(message);
        setFormData({
          machine: "",
          material: "",
          service: "",
          unit: "",
          unitPrice: "",
        });
        handleModalOpen(false);
      }
    });
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <form className="md:w-1/2" onSubmit={handleSubmit}>
          <div className="relative w-full mx-auto my-6 ">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 className="text-3xl font-semibold">Price Setting</h3>
                <button
                  title="close"
                  type="button"
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => handleModalOpen(false)}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                    <IoMdClose />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-1 grid grid-cols-4 gap-2">
                <div>
                  <label
                    htmlFor="machines"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Choose Machine
                  </label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    defaultOptions
                    onChange={handleMachine}
                  />
                </div>
                <div>
                  <label
                    htmlFor="machines"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Choose Material
                  </label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptionsMaterial}
                    defaultOptions
                    onChange={handleMaterial}
                  />
                </div>
                <div>
                  <label
                    htmlFor="machines"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Choose Service
                  </label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptionsService}
                    defaultOptions
                    onChange={handleService}
                  />
                </div>
                <div>
                  <label
                    htmlFor="machines"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Choose Unit
                  </label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptionsUnit}
                    defaultOptions
                    onChange={handleUnit}
                  />
                </div>
                <div className="col-span-2">
                <label
                  htmlFor="unit-price"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Unit price
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
                  <RiPriceTag2Line />
                  </span>
                  <input
                    onChange={handleChange}
                    type="number"
                    id="unit-price"
                    className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
                    placeholder="eg, 100"
                    name="unitPrice"
                    required
                  />
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  >
                    Add price
                  </button>
                </div>
              </div>
              </div>

              

              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => handleModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default PriceDetailsModal;
