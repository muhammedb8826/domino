import { useState } from 'react';
import { CgClose, CgMenuRight } from 'react-icons/cg';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [active, setActive] = useState('');

  const handleButtonClick = (newActiveState:string) => {
    setActive(newActiveState);
    setNavbarOpen(false); // Close the navbar when a link is clicked
  };

  return (
    <nav className="dark:bg-gray-900 fixed w-full top-0 z-999 start-0 bg-boxdark-2 text-whiten drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          // onClick={() => setActive('home')}
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            IAN PLC
          </span>
        </NavLink>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <NavLink
            to="/signin"
            className="text-white bg-[#f01d52] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => setActive('signin')}
          >
            Sign In
          </NavLink>
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {navbarOpen ? (
              <CgClose className="w-5 h-5" />
            ) : (
              <CgMenuRight className="w-5 h-5" />
            )}
          </button>
        </div>
        <div
          className={`${
            navbarOpen ? 'flex' : 'hidden'
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          // id="navbar-sticky"
        >
          <ul className="nav-menu flex flex-col w-full text-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li className=''>
              <NavLink
                to="/"
                className={`block text-gray-900 rounded hover:bg-gray-100 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700  ${
                  active === 'home' ? 'bg-black' : ''
                }`}
                onClick={() => handleButtonClick('home')}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={`block text-gray-900 rounded hover:bg-gray-100 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 ${
                  active === 'about' ? 'bg-black' : ''
                }`}
                onClick={() => handleButtonClick('about')}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={`block text-gray-900 rounded hover:bg-gray-100 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 ${
                  active === 'services' ? 'bg-black' : ''
                }`}
                onClick={() => handleButtonClick('services')}
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={`block text-gray-900 rounded hover:bg-gray-100 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 ${
                  active === 'contact' ? 'bg-black' : ''
                }`}
                onClick={() => handleButtonClick('contact')}
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/get-started"
                className={`block text-gray-900 rounded hover:bg-gray-100 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 ${
                  active === 'get-started' ? 'bg-body' : ''
                }`}
                onClick={() => handleButtonClick('get-started')}
              >
                Get started
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
