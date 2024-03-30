import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaAngleDown,
  FaAngleRight,
  FaCartArrowDown,
  FaProductHunt,
  FaUsers,
} from "react-icons/fa";
import { FaPeopleCarryBox, FaUsersGear } from "react-icons/fa6";
import { MdCategory, MdInventory, MdSettings } from "react-icons/md";
import { IoIosPricetags } from "react-icons/io";
import { RiHandCoinFill } from "react-icons/ri";
import { FcSalesPerformance } from "react-icons/fc";
import { BiSolidPurchaseTag, BiSolidReport } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
// import dominoLogo from "../../assets/images/domino-logo.jpg";

export const SideBar = () => {
  const [active, setActive] = useState("order");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const handleButtonClick = (activeState) => {
    // Set the active state
    setActive(activeState);
    
    // Navigate to the corresponding route
    navigate(`/dashboard/${activeState}`);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <aside className="flex h-screen flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark">
      <div className="py-4 flex items-center justify-center mb-10">
        <NavLink
          to="/"
          className="flex text-3xl items-center justify-center p-4"
        >
          {/* <img src={dominoLogo} alt="logo image" className="w-10/12" /> */}
          <span className="font-bold text-white">D</span>
          <span className="text-[#f01d52]">omino</span>{" "}
        </NavLink>
      </div>

      <hr />

      <div className="sidebar-items text-white flex flex-col gap-4 py-4">
        <button
          type="button"
          onClick={() => handleButtonClick("order")}
          className={`${
            active === "order" ? "bg-white text-black" : ""
          } ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-base`}
        >
          <FaCartArrowDown /> <span> Order</span>
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("user")}
          className={`${
            active === "user" ? "bg-white text-black" : ""
          } ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-base`}
        >
          <FaUsersGear />
          <span>User</span>
        </button>
        <div className="relative w-full">
          <button
            onClick={handleDropdownClick}
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            className={`${
              isDropdownOpen
                ? "text-white bg-blue-700 hover:bg-blue-800 mb-2"
                : ""
            } w-full ps-4 p-2 rounded-l-3xl flex items-center justify-between gap-2 text-base`}
            type="button"
          >
            <span className="inline-flex items-center gap-2">
              <MdInventory />
              Inventory
            </span>
            {isDropdownOpen ? <FaAngleDown /> : <FaAngleRight />}
          </button>
          {isDropdownOpen && (
            <ul className="w-full rounded-br-lg shadow-lg dark:bg-boxdark">
              <li>
                <button
                  type="button"
                  onClick={() => handleButtonClick("products")}
                  className={`${
                    active === "products" ? "text-white" : ""
                  } w-full hover:border-l-2 p-2 flex items-center gap-2 text-base text-gray-400`}
                >
                  <FaProductHunt />
                  Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleButtonClick("sale")}
                  className={`${
                    active === "sale" ? "text-white" : ""
                  } w-full hover:border-l-2 p-2 flex items-center gap-2 text-base text-gray-400`}
                >
                  <FcSalesPerformance />
                  Sale
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleButtonClick("categories")}
                  className={`${
                    active === "categories" ? "text-white" : ""
                  } w-full hover:border-l-2 p-2 flex items-center gap-2 text-base text-gray-400`}
                >
                  <MdCategory />
                  Categories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleButtonClick("purchase")}
                  className={`${
                    active === "purchase" ? "text-white" : ""
                  } w-full hover:border-l-2 p-2 flex items-center gap-2 text-base text-gray-400`}
                >
                  <BiSolidPurchaseTag />
                  Purchase
                </button>
              </li>
              <li>
                <Link
                  to="/dashboard/inventory/suppliers"
                  onClick={() => handleButtonClick("suppliers")}
                  className={`${
                    active === "suppliers" ? "text-white" : ""
                  } w-full hover:border-l-2 p-2 flex items-center gap-2 text-base text-gray-400`}
                >
                  <FaPeopleCarryBox />
                  Suppliers
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleButtonClick("reports")}
                  className={`${
                    active === "reports" ? "text-white" : ""
                  } w-full hover:border-l-2 p-2 flex items-center gap-2 text-base text-gray-400`}
                >
                  <BiSolidReport />
                  Reports
                </button>
              </li>
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={() => handleButtonClick("customer")}
          className={`${
            active === "customer" ? "bg-white text-black" : ""
          } ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-base`}
        >
          <FaUsers />
          <span> Customer</span>
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("commission")}
          className={`${
            active === "commission" ? "bg-white text-black" : ""
          } ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-base`}
        >
          <RiHandCoinFill />
          <span> Commission</span>
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("pricing")}
          className={`${
            active === "pricing" ? "bg-white text-black" : ""
          } ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-base`}
        >
          <IoIosPricetags />
          <span> Pricing</span>
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("setting")}
          className={`${
            active === "setting" ? "bg-white text-black" : ""
          } ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-base`}
        >
          <MdSettings />
          <span> Setting</span>
        </button>
      </div>
    </aside>
  );
};
