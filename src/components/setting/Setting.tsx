import { useState } from "react";
import { Media } from "./Media";
import Material from "./Material";
import Unit from "./Unit";
import { Services } from "./Services";
import '../../assets/styles/scroll.css';

const Setting = () => {
  const [active, setActive] = useState("medias");
  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };
  return (
    <div className="relative h-screen calc(100% - 2rem) flex flex-col">
      <nav className="flex items-center justify-center h-[15%]">
        <ul className="my-4 p-2 bg-gray-100 rounded-lg">
          <li>
            <button
              type="button"
              onClick={() => handleButtonClick("medias")}
              className={`${
                active === "medias" ? "text-white bg-gray-900" : ""
              } px-5 py-1.5 font-medium text-gray-900 rounded-lg`}
            >
              Medias
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
        </ul>
      </nav>

      <div className="rounded-lg bg-gray-100 h-[80%] overflow-hidden">
        {active === "medias" && <Media />}
        {active === "materials" && <Material />}
        {active === "units" && <Unit />}
        {active === "services" && <Services />}
      </div>
    </div>
  );
};

export default Setting;
