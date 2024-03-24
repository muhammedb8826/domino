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
      <nav className="flex items-center justify-center h-[15%]">
        <ul className="my-4 p-2 bg-gray-100 rounded-lg">
          <li>
            <button
              type="button"
              onClick={() => handleButtonClick("machines")}
              className={`${
                active === "machines" ? "text-white bg-gray-900" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Machines
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleButtonClick("materials")}
              className={`${
                active === "materials" ? "text-white bg-gray-900" : ""
              } px-5 py-1.5  font-medium text-gray-900 rounded-lg`}
            >
              Materials
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleButtonClick("units")}
              className={`${
                active === "units" ? "text-white bg-gray-900" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Units
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleButtonClick("services")}
              className={`${
                active === "services" ? "text-white bg-gray-900" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Services
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleButtonClick("roles")}
              className={`${
                active === "roles" ? "text-white bg-gray-900" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Roles
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => handleButtonClick("discounts")}
              className={`${
                active === "discounts" ? "text-white bg-gray-900" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Discounts
            </button>
          </li>
        </ul>
      </nav>

      <div className="rounded-lg h-[80%] overflow-hidden">
        {active === "machines" && <Machine />}
        {active === "materials" && <Material />}
        {active === "units" && <Unit />}
        {active === "services" && <Services />}
        {active === "roles" && <Role />}
        {active === "discounts" && <Discount />}
      </div>
    </div>
  );
};

export default Setting;
