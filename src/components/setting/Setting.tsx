import { useState } from "react";
import Unit from "./Unit";
import '../../assets/styles/scroll.css';
import Discount from "./Discount";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { RootState } from "@/redux/store";
import Loader from "@/common/Loader";
// import JobOrderProducts from "./JobOrderProducts";

const Setting = () => {
  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  if (user?.email !== "admin@domino.com") {
    return <ErroPage error="You are not authorized to view this page" />
  }

  if (error) {
    return <ErroPage error={error} />
  }

  const [activeTab, setActiveTab] = useState('units');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };



  return isLoading ? (<Loader />) : (
    <>
      <div className="mb-4 flex justify-between items-center px-4">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" role="tablist">
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'units' ? 'border-primary text-primary' : 'hover:text-graydark hover:border-graydark dark:hover:text-gray'}`}
              id="order-tab"
              type="button"
              role="tab"
              onClick={() => handleTabClick('units')}
            >
              Unit
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'discounts' ? 'border-primary text-primary' : 'hover:text-graydark hover:border-graydark dark:hover:text-gray'}`}
              id="payment-tab"
              type="button"
              role="tab"
              onClick={() => handleTabClick('discounts')}
            >
              Discount
            </button>
          </li>
          <li className="me-2" role="presentation">
            <button
              className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'commission' ? 'border-primary text-primary' : 'hover:text-graydark hover:border-graydark dark:hover:text-gray'}`}
              id="commission-tab"
              type="button"
              role="tab"
              onClick={() => handleTabClick('commission')}
            >
              Commission
            </button>
          </li>
        </ul>
      </div>
      <div className="relative h-screen calc(100% - 2rem) flex flex-col">
        <div className="rounded-lg h-[80%] overflow-hidden">
          {activeTab === "units" && <Unit />}
          {activeTab === "discounts" && <Discount />}
        </div>
      </div>
    </>
  );
};

export default Setting;
