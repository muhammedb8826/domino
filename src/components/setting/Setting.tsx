import { useEffect, useState } from "react";
import { Machine } from "./Machine";
import Material from "./Material";
import Unit from "./Unit";
import { Services } from "./Services";
import '../../assets/styles/scroll.css';
import Role from "./Role";
import Discount from "./Discount";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { RootState } from "@/redux/store";
import JobOrderProducts from "./JobOrderProducts";

const Setting = () => { 
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [active, setActive] = useState("machines");
  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };

  if(user?.email !== "admin@domino.com"){
    return <ErroPage error="You are not authorized to view this page" />
  }
  
  if(isLoading){
    return <Loading/>
  }

  if(error){
    return <ErroPage error={error} />
  }
  

  return (
    <div className="relative h-screen calc(100% - 2rem) flex flex-col">
      <nav className="">
        <ul className="list-reset py-4 pl-4 rounded flex bg-white dark:bg-boxdark dark:text-white">
          <li className="text-gray-500 text-sm dark:text-gray-400">
            <button
              type="button"
              onClick={() => handleButtonClick("machines")}
              className={`${
                active === "machines" ? "text-white bg-black" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Machines
            </button>
          </li>
          <li className="text-gray-500 text-sm dark:text-gray-400">
            <button
              type="button"
              onClick={() => handleButtonClick("materials")}
              className={`${
                active === "materials" ? "text-white bg-black" : ""
              } px-5 py-1.5  font-medium text-gray-900 rounded-lg`}
            >
              Materials
            </button>
          </li>
          <li className="text-gray-500 text-sm dark:text-gray-400">
            <button
              type="button"
              onClick={() => handleButtonClick("units")}
              className={`${
                active === "units" ? "text-white bg-black" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Units
            </button>
          </li>
          <li className="text-gray-500 text-sm dark:text-gray-400">
            <button
              type="button"
              onClick={() => handleButtonClick("services")}
              className={`${
                active === "services" ? "text-white bg-black" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Services
            </button>
          </li>
          {/* <li className="text-gray-500 text-sm dark:text-gray-400">
            <button
              type="button"
              onClick={() => handleButtonClick("roles")}
              className={`${
                active === "roles" ? "text-white bg-black" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Roles
            </button>
          </li> */}
          <li className="text-gray-500 text-sm dark:text-gray-400">
            <button
              type="button"
              onClick={() => handleButtonClick("discounts")}
              className={`${
                active === "discounts" ? "text-white bg-black" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Discounts
            </button>
          </li>
        </ul>
      </nav>

      <div className="rounded-lg h-[80%] overflow-hidden">
        {active === "machines" && <Machine />}
        {active === "materials" && <JobOrderProducts />}
        {active === "units" && <Unit />}
        {active === "services" && <Services />}
        {active === "roles" && <Role />}
        {active === "discounts" && <Discount />}
      </div>
    </div>
  );
};

export default Setting;
