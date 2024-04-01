import Loader from "@/common/Loader";
import ErroPage from "@/components/common/ErroPage";
import { getCategories } from "@/redux/features/category/categorySlice";
import { createProduct } from "@/redux/features/product/productSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

export const ProductRegistration = ({ handleModalOpen }) => {
const {categories, isLoading, error} = useSelector((state: RootState) => state.category);
const dispatch = useDispatch();
useEffect(() => {
  dispatch(getCategories());
}, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    unitPrice: "",
    quantity: "",
    stockLevel: "",
    categoryId: "",
    category: {
      name: "",
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      description: formData.description,
      unitPrice: formData.unitPrice,
      quantity: formData.quantity,
      stockLevel: formData.quantity,
      categoryId: formData.categoryId,
      category: {
        name: categories.find((category) => category.id === formData.categoryId).name,
      }
    };


    dispatch(createProduct(data)).then(() => {
        handleModalOpen(false);
        const message = "Product created successfully";
        toast.success(message);
        });
  };

  if(error) return <ErroPage error={error} />
  return isLoading?(<Loader/>):(
    <>
   <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-999 bg-black/50 outline-none focus:outline-none">
        <form onSubmit={handleSubmit} className="w-full">
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
                      htmlFor="unitPrice"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Unit price
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.unitPrice}
                      type="number"
                      id="unitPrice"
                      name="unitPrice"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="quantity"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Quantity
                    </label>
                    <input
                      onChange={handleChange}
                      value={formData.quantity}
                      type="number"
                      id="quantity"
                      name="quantity"
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      placeholder="1000"
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
                >
                  Save
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
