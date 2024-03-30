import { useState } from "react";
import { IoMdClose } from "react-icons/io"

export const ProductRegistration = ({handleModalOpen}) => {

const [formData, setFormData]=useState({
    productName: "",
    description: "",
    unitPrice: "",
    quantity: "",
    stockLevel: ""
}) 


    const handleSubmit = (e)=>{
        e.preventDefault();
        console.log("submitted");
    }
  return (
    <>
    <div
    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
  >
    <form onSubmit={handleSubmit}>
    <div className="relative w-auto my-6 mx-auto max-w-3xl">
      {/*content*/}
      <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        {/*header*/}
        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
          <h3 className="text-3xl font-semibold">
            Edit
          </h3>
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
        <div className="relative p-6 flex-auto">
            Muhammed
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
  )
}
