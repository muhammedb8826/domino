import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUser } from "../../redux/features/user/userSlice";
import { useEffect, useRef, useState } from "react";
import userImage from "../../assets/images/avatar.jpg";
import { CiMenuKebab } from "react-icons/ci";
import { FaRegEdit, FaUserPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import UserRegistration from "./UserRegistration";
import Swal from "sweetalert2";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { RootState } from "@/redux/store";
import Loader from "@/common/Loader";
import Breadcrumb from "../Breadcrumb";

const User = () => {
  const { users, isLoading, errors, error } = useSelector(
    (state: any) => state.user
  );
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [showPopover, setShowPopover] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
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

  useEffect(() => {
    if (errors) {
      setRegistrationError(errors);
    }
  }, [errors]);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUpdateModal = (id) => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
    setUserId(id);
  };

  const handleAction = (index: number) => {
    setShowPopover((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleDeleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The user has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteUser(id));
        });
      }
      setShowPopover(null);
    });
  };

  if (error) {
    return <ErroPage error={error} />;
  }

  const userListContent = users
    ? users.map((user, index: number) => (
        <tr key={user.id}>
          <td className="border-b flex items-center border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
            <img
              className="w-10 h-10 rounded-full"
              src={userImage}
              alt="Jese image"
            />
            <div className="ps-3">
              <div className="text-base font-semibold text-black dark:text-white">
                {user.first_name} {user.middle_name} {user.last_name}
              </div>
              <div className="font-normal text-gray-500">{user.email}</div>
            </div>
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {user.phone}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {user.address}
          </td>
          <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
            {user.joined_date}
          </td>
          <td className="px-6 py-4 relative">
            <button
              onClick={() => handleAction(index)}
              title="action"
              data-popover-target={`popover-bottom-${index}`}
              data-popover-trigger="click"
              id={`dropdownAvatarNameButton-${user.id}-${index}`}
              type="button"
              className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              <CiMenuKebab />
            </button>
            {showPopover === index && (
              <div
                ref={popoverRef}
                className="absolute z-10 end-32 -top-10 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
              >
                {/* Dropdown content */}
                <div className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">{user?.roles}</div>
                  <div className="truncate">{user.email}</div>
                </div>
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <button
                      onClick={() => handleUpdateModal(user.id)}
                      type="button"
                      className="flex items-center w-full gap-2 px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline hover:bg-gray-100"
                    >
                      <FaRegEdit />
                      Edit
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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
      ))
    : null;

  return isLoading ? (
    <Loader />
  ) : (
    <>
    <Breadcrumb pageName="Users" />
      {/* <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"> */}
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
          {user?.email === "admin@domino.com" && (
            <div>
              <button
                onClick={handleModalOpen}
                className="inline-flex items-center justify-center rounded bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
                type="button"
              >
                <FaUserPlus />
                <span className="ml-2">Add New User</span>
              </button>
            </div>
          )}

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
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-4 ps-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              placeholder="Search for users"
            />
          </div>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Full name
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Phone
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
              <tbody>{userListContent}</tbody>
            </table>
            <nav
              className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
              aria-label="Table navigation"
            >
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                Showing{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  1-10
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  1000
                </span>
              </span>
              <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 bg-gray-2 text-left dark:bg-meta-4">
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Previous
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    aria-current="page"
                    className="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    4
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    5
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
      </div>
      {isModalOpen && (
        <UserRegistration
          handleModalOpen={handleModalOpen}
          errors={registrationError}
        />
      )}
    </>
  );
};

export default User;
