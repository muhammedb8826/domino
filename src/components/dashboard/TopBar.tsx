
import { useDispatch, useSelector } from "react-redux";
import Logout from "../../auth/Logout";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../../redux/features/user/authentication";
import getStartedImage from "../../assets/images/avatar.jpg";
import { RootState } from '../../redux/store';
import { getOrderStatus } from "@/redux/features/order/orderSlice";
import Loading from "../common/Loading";

const TopBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const {orderStatus} = useSelector((state: RootState) => state.order);

  

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
useEffect(() => {
  dispatch(getOrderStatus());
}
, [dispatch]);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const [received, setReceived] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(()=>{
    const receivedItems = orderStatus.filter(order => order.status === 'received')
    .map(order => order.orderItems); // Map over the received orders to get their orderItems
    setReceived(receivedItems);
  },[orderStatus])

  if (isLoading) {
    return <Loading/>
  }

  const date = new Date();
  const hour = date.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="flex h-16 p-4 justify-between gap-4 items-center w-full shadow-md bg-white">
      <div className="flex-1">
        <h1 className="text-xl">{greeting} {user?.first_name}</h1>
      </div>
      {user?.email === "admin@domino.com" && (
      <div>
        <Link
          to="/dashboard/notifications"
          type="button"
          className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Notifications
          <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
            {`${user?.email === "admin@domino.com" ? received.length : 0}`}
          </span>
        </Link>
      </div>
      )}

      <div className="relative">
      <button
        id="dropdownAvatarNameButton"
        onClick={toggleDropdown}
        className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 md:me-0 focus:ring-4 focus:ring-gray-100"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <img className="w-10 h-10 me-2 rounded-full" src={getStartedImage} alt="user photo" />
        <span className="hidden md:inline">{user?.first_name}</span>
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      <span className={user?.is_active ? "top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" : "top-0 left-7 absolute  w-3.5 h-3.5 bg-red-400 border-2 border-white rounded-full"} ></span> 
      </button>

      {isDropdownOpen && (
        <div
          id="dropdownAvatarName"
          className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          {/* Dropdown content */}
          <div className="px-4 py-3 text-sm text-gray-900">
            <div className="font-medium">Pro User</div>
           <div className="truncate">{user?.email}</div>
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
    </div>
  );
};

export default TopBar;
