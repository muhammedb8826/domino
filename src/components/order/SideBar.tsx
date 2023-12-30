import { NavLink } from "react-router-dom"
import { FaCartArrowDown } from "react-icons/fa";

export const SideBar = () => {
  return (
    <aside
      className="absolute left-0 top-0 z-9999 flex h-screen w-[270px] flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0"
    >
       <div className="py-4 flex items-center justify-center mb-10">
          <NavLink to="/" className="flex text-3xl items-center"><span className="font-bold text-white">D</span><span className="text-[#f01d52]">omino</span> </NavLink>
        </div>

        <hr />

  <div className="sidebar-items text-white flex flex-col gap-4 py-4">
    <NavLink to="/orders" className="bg-white text-black ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-2xl ml-10"><FaCartArrowDown /> <span> Order</span></NavLink>
    <NavLink to="/customer" className=" ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-2xl ml-10"> <span> Customer</span></NavLink>
    <NavLink to="/setting" className=" ps-4 p-2 rounded-l-3xl flex items-center gap-2 text-2xl ml-10"> <span> Setting</span></NavLink>
  </div>


    </aside>
  )
}
