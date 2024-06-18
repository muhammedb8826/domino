import { CiMenuKebab } from "react-icons/ci"
import { FaRegEdit } from "react-icons/fa"
import { IoBagAdd } from "react-icons/io5"
import { MdDelete } from "react-icons/md"
import { NavLink } from "react-router-dom"
import Breadcrumb from "../Breadcrumb"
import Loader from "@/common/Loader"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getSalesPartners } from "@/redux/features/salesPartnersSlice"
import ErroPage from "../common/ErroPage"
import { SalesPartnerRegistration } from "./SalesPartnerRegistrationModal"

export const SalesPartnerList = () => {
    const { salesPartners, isLoading, error } = useSelector((state) => state.salesPartner)
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [showPopover, setShowPopover] = useState<number | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node)
            ) {
                setShowPopover(null);
            }
        };

        if (showPopover !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showPopover]);

    const handleAction = (index: number) => {
        setShowPopover((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleModalOpen = () => {
        setOpenModal((prev) => !prev);
    }
    useEffect(() => {
        dispatch(getSalesPartners());
    }, [dispatch])

    if (error) return <ErroPage error={error} />;

    return isLoading ? (<Loader />) : (
        <>
            <Breadcrumb pageName="Sales partner" />
            <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                <div>
                    <button
                        type="button"
                        onClick={handleModalOpen}
                        className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <IoBagAdd />
                        <span className="ml-2">Add sales partner</span>
                    </button>
                </div>
                <label htmlFor="table-search" className="sr-only">
                    Search
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="table-search"
                        className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for customers"
                    />
                </div>
            </div>

            <div className="rounded-sm border border-stroke border-t-0 bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                                    Customer name
                                </th>
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white">
                                    Phone number
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Company
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Address
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Joined date
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesPartners.map((partner, index) =>
                                <tr key={partner.id}>
                                    <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                                        {partner.firstName}
                                    </td>
                                    <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                                        {partner.phone}
                                    </td>
                                    <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                                        {partner.companyType}
                                    </td>
                                    <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                                        Address
                                    </td>
                                    <td className="border-b border-[#eee] p-4 dark:border-strokedark">
                                        Joined date
                                    </td>
                                    <td className="px-6 py-4 relative">
                                        <button
                                            onClick={() => handleAction(index)}
                                            title="action"
                                            type="button"
                                            className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            <CiMenuKebab />
                                        </button>
                                        {showPopover === index && (
                                            <div
                                                ref={popoverRef}
                                                className="absolute z-40 right-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                                            >
                                                <ul className="py-2 text-sm text-gray-700">
                                                    <li>
                                                        <NavLink
                                                            to={`#`}
                                                            className="flex items-center w-full gap-2 px-4 py-2 font-medium text-primary dark:text-primary hover:underline hover:bg-gray-100"
                                                        >
                                                            <FaRegEdit />
                                                            Edit
                                                        </NavLink>{" "}
                                                    </li>
                                                    <li>
                                                        <button
                                                            // onClick={() => handleDeleteOrder(order.id)}
                                                            type="button"
                                                            className="text-left text-red-500 flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
                                                        >
                                                            <MdDelete /> Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Showing <span className="font-semibold text-gray-900 dark:text-white">1-10</span> of <span className="font-semibold text-gray-900 dark:text-white">1000</span></span>
                        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                            </li>
                            <li>
                                <a href="#" aria-current="page" className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            {openModal && (
            <SalesPartnerRegistration handleModalOpen={handleModalOpen} />
          )}
        </>
    )
}
