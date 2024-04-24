import Loader from "@/common/Loader";
import ErroPage from "@/components/common/ErroPage";
import { getCategories } from "@/redux/features/category/categorySlice";
import { createProduct } from "@/redux/features/product/productSlice";
import { createStock } from "@/redux/features/stockSlice";
import { getUnits } from "@/redux/features/unit/unitSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

export const ProductRegistration = ({ handleModalOpen }) => {
const {categories, isLoading, error} = useSelector((state: RootState) => state.category);
const {units} = useSelector((state)=>state.unit);

const dispatch = useDispatch();
useEffect(() => {
  dispatch(getCategories());
  dispatch(getUnits());
}, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    unitId: "", 
    minStockLevel: "1",
    initialStock: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.unitId) {
      return toast.error("All fields are required");
    }
    const date = new Date();
    const data = {
      id: date.getTime().toString(),
      name: formData.name,
      description: formData.description,
      categoryId: formData.categoryId,
      unitId: formData.unitId,
      minStockLevel: formData.minStockLevel,
      initialStock: formData.initialStock,
    };
    const stockData = {
      productId: data.id,
      quantity: data.initialStock,
       };
     
    dispatch(createProduct(data)).then(() => {
      dispatch(createStock(stockData));
        handleModalOpen(false);
        const message = "Product created successfully";
        toast.success(message);
        });
  };

  if(error) return <ErroPage error={error} />
  return isLoading?(<Loader/>):(
    <>
   <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999 bg-black/50 outline-none focus:outline-none">
        {/* <form onSubmit={handleSubmit} className="w-full"> */}
          <div className="relative w-auto my-6 mx-auto max-w-3xl ">
            {/*content*/}
            <div className="border-0 rounded-lg relative flex flex-col w-full bg-white shadow-default dark:border-strokedark dark:bg-boxdark outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark rounded-t">
                <h3 className="text-3xl text-black dark:text-white font-semibold text">Add Products</h3>
                <button
                  title="close"
                  type="button"
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => handleModalOpen(false)}
                >
                  <span className="bg-transparent text-black dark:text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                    <IoMdClose />
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Product name
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.name}
                      type="text"
                      id="name"
                      name="name"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="Banner"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Description
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.description}
                      type="text"
                      id="description"
                      name="description"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="Description"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Category
                    </label>
                    <select
                      onChange={handleChange}
                      value={formData.categoryId}
                      id="category"
                      name="categoryId"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="unit"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Units
                    </label>
                    <select
                      onChange={handleChange}
                      value={formData.unitId}
                      id="unit"
                      name="unitId"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      required
                    >
                      <option value="">Select Unit</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>
                          {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="minStockLevel"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Min Stock Level
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.minStockLevel}
                      type="number"
                      id="minStockLevel"
                      name="minStockLevel"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="initialStock"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Initial Stock
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.initialStock}
                      type="number"
                      id="initialStock"
                      name="initialStock"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end gap-4.5 border-t border-stroke py-4 px-6.5 dark:border-strokedark rounded-b">
                <button
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  type="button"
                  onClick={() => handleModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        {/* </form> */}
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};