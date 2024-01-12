import  { useState } from 'react';
import getStartedImage from '../assets/images/avatar.jpg';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/features/user/authentication';
import { useNavigate } from 'react-router-dom';


const Logout = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        id="dropdownAvatarNameButton"
        onClick={toggleDropdown}
        className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 md:me-0 focus:ring-4 focus:ring-gray-100"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <img className="w-8 h-8 me-2 rounded-full" src={getStartedImage} alt="user photo" />
        Bonnie Green
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          id="dropdownAvatarName"
          className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          {/* Dropdown content */}
          <div className="px-4 py-3 text-sm text-gray-900">
            <div className="font-medium">Pro User</div>
            <div className="truncate">admin@domino.com</div>
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
          <div className="py-2">
            <button type='button' className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
