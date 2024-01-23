import { NavLink } from "react-router-dom";
import { FaCartArrowDown, FaProductHunt, FaUsers } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";
import { MdSettings } from "react-icons/md";
import { IoIosPricetags } from "react-icons/io";

export const SideBar = ({
  handleButtonClick,
  active,
}: {
  handleButtonClick: (arg: string) => void;
  active: string;
}) => {
  return (
    <aside className="flex h-screen flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark">
      <div className="py-4 flex items-center justify-center mb-10">
        <NavLink to="/" className="flex text-3xl items-center">
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
          onClick={() => handleButtonClick("product")}
          className={`${
            active === "product" ? "bg-white text-black" : ""
          } ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-base`}
        >
          <FaProductHunt />
          <span> Product</span>
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
