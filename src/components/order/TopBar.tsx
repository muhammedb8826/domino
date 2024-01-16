
import { useDispatch, useSelector } from "react-redux";
import Logout from "../../auth/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../../redux/features/user/authentication";
import getStartedImage from "../../assets/images/avatar.jpg";


const TopBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const { user,isLoading } = useSelector((state) => state.auth);
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user, navigate]);


  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex h-20 p-4 justify-between gap-4 items-center w-full shadow-md bg-white">
      <form className="flex-1">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
            placeholder="Search Orders..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </form>

      <div>
        <button
          type="button"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Notifications
          <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            2
          </span>
        </button>
      </div>

      <div className="relative">
      <button
        id="dropdownAvatarNameButton"
        onClick={toggleDropdown}
        className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 md:me-0 focus:ring-4 focus:ring-gray-100"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <img className="w-10 h-10 me-2 rounded-full" src={getStartedImage} alt="user photo" />
        <span className="hidden md:inline">{user.first_name}</span>
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      <span className={user.is_active ? "top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" : "top-0 left-7 absolute  w-3.5 h-3.5 bg-red-400 border-2 border-white rounded-full"} ></span> 
      </button>

      {isDropdownOpen && (
        <div
          id="dropdownAvatarName"
          className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          {/* Dropdown content */}
          <div className="px-4 py-3 text-sm text-gray-900">
            <div className="font-medium">Pro User</div>
           <div className="truncate">{user.email}</div>
          </div>
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100 ">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
            </li>
          </ul>
          <Logout handleLogout={handleLogout} />
          
        </div>
      )}
    </div>


      {/* <div className="relative"> */}
        {/* <img
          className="w-10 h-10 rounded-full"
          src={getStartedImage}
          alt=""
        />
        <span className="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span> */}
      {/* </div> */}
    </div>
  );
};

export default TopBar;
