import { NavLink } from "react-router-dom";
import { CgClose, CgMenuRight } from "react-icons/cg";
import { useState } from "react";
import dominoLogo from "../../assets/images/domino-logo.jpg";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };
  return (
    <header>
      <nav className="h-16 flex justify-between items-center relative px-4 pb-3">
        <div className="flex items-center justify-center">
          <NavLink to="/" className="flex text-3xl items-center">
          <img src={dominoLogo} alt="logo image" className="h-10" />
            {/* <span className="font-bold">D</span><span className="text-[#f01d52]">omino</span>  */}
            </NavLink>
        </div>
        <button
          type="button"
          className="absolute right-4 max-md:block hidden text-2xl"
          title="toggle button"
          onClick={handleToggle}
        >
          {toggle ? <CgClose /> : <CgMenuRight />}
        </button>
        <div
          className={`${toggle ? "block" : "hidden"} blur-section md:hidden `}
        ></div>
        <ul
          className={`${
            toggle ? "block" : "hidden"
          } md:flex max-md:absolute top-20 left-0 w-full px-4 md:justify-end`}
        >
          <li className="flex mb-1">
            <NavLink
              to="/about"
              className="w-full p-3 rounded-md"
              onClick={handleToggle}
            >
              About
            </NavLink>
          </li>
          <li className="flex mb-1">
            <NavLink
              to="/services"
              className="w-full p-3 rounded-md"
              onClick={handleToggle}
            >
              Services
            </NavLink>
          </li>
          <li className="flex mb-1">
            <NavLink
              to="/latest-work"
              className="w-full p-3 rounded-md"
              onClick={handleToggle}
            >
              Latest Work
            </NavLink>
          </li>
          <li className="flex mb-1">
            <NavLink
              to="/blog"
              className="w-full p-3 rounded-md"
              onClick={handleToggle}
            >
              Blog
            </NavLink>
          </li>
          <li className="flex mb-1">
            <NavLink
              to="/contact"
              className="w-full p-3 rounded-md"
              onClick={handleToggle}
            >
              Contact
            </NavLink>
          </li>
          <li className="flex mb-1">
            <NavLink
              to="/get-started"
              className="w-full p-3 rounded-md"
              onClick={handleToggle}
            >
              Get started
            </NavLink>
          </li>
          <li className="flex">
            <NavLink
              to="/sign-in"
              className="w-full p-3 rounded-md bg-[#f01d52] text-white"
              onClick={handleToggle}
            >
              Sign in
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
