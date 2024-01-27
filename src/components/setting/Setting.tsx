import { useState } from "react";
import { Media } from "./Media";

const Setting = () => {
  const [active, setActive] = useState("medias");
  const handleButtonClick = (newActiveState: string) => {
    setActive(newActiveState);
  };
  return (
    <div className="overflow-hidden h-full">
      <nav className="flex items-center justify-center">
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

      <div className="rounded-lg bg-gray-100">
        {active === "medias" && <Media />}
        {active === "materials" && (
          <div className="w-full h-full">
            <div className="w-full h-1/2 bg-gray-100 rounded-lg">Materials</div>
          </div>
        )}
        {active === "units" && (
          <div className="w-full h-full">
            <div className="w-full h-1/2 bg-gray-100 rounded-lg">Units</div>
          </div>
        )}
        {active === "services" && (
          <div className="w-full h-full">
            <div className="w-full h-1/2 bg-gray-100 rounded-lg">Serives</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;