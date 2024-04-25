import Loader from "@/common/Loader";
import { getProducts } from "@/redux/features/product/productSlice";
import { RootState } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getpriceById, updateprice } from "@/redux/features/price/pricingSlice";
import toast from "react-hot-toast";
import { getServices } from "@/redux/features/service/servicesSlice";
import ErroPage from "../common/ErroPage";

export const PriceEditModal = ({handleEditModal, id}) => {
  const { user } = useSelector((state: RootState) => state.auth);
    const { services } = useSelector( (state) => state.service );
    const { products } = useSelector( (state) => state.product );
    const { prices, isLoading } = useSelector( (state) => state.price );

const singlePrice = prices?.find((price) => price.id === id.toString());

    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(getProducts());
      dispatch(getServices());
    }, [dispatch, id]);
    
    const [formData, setFormData] = useState(singlePrice);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        }

    const serviceOptions = services?.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const productOptions = products?.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const handleServiceChange = (selectedOption) => {
        setFormData({ ...formData, serviceId: selectedOption.value })
    }

    const handleProductChange = (selectedOption) => {
        setFormData({ ...formData, productId: selectedOption.value })
    }

    if (user?.email !== "admin@domino.com") {
        return <ErroPage error="You are not authorized to view this page" />
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        const data= {
            productId: formData.productId,
            serviceId: formData.serviceId,
            unitPrice: formData.unitPrice,
            id: id.toString(),
        }
       dispatch(updateprice(data)).then(() => {
              handleEditModal(false);
              toast.success("Price updated successfully");
         });
    }

    return isLoading ? (<Loader />) : (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <form className="md:w-1/2" onSubmit={handleSubmit}>
              <div className="relative w-full mx-auto my-6 ">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl text-black dark:text-white font-semibold text">Price Setting</h3>
                    <button
                      title="close"
                      type="button"
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => handleEditModal(false)}
                    >
                      <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        <IoMdClose />
                      </span>
                    </button>
                  </div>
                  {/*body*/}
                  <div className="relative p-6 flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label
                        htmlFor="products"
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Choose Product
                      </label>
                      <Select
                        options={productOptions}
                        onChange={(selectedOption) => handleProductChange(selectedOption)}
                        value={productOptions.find((option) => option.value === formData.productId)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="services"
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Choose service
                      </label>
                      <Select
                        options={serviceOptions}
                        onChange={(selectedOption) => handleServiceChange(selectedOption)}
                        value={serviceOptions.find((option) => option.value === formData.serviceId)}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="unit-price"
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        Unit price
                      </label>
                      <input
                        onChange={handleChange}
                        type="number"
                        id="unit-price"
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        placeholder="eg, 100"
                        name="unitPrice"
                        value={formData.unitPrice}
                        required
                      />
                    </div>
                  </div>
                  {/*footer*/}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleEditModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-primary text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
}
