import { MdDelete } from "react-icons/md";
import { TfiLayoutMediaLeftAlt } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../common/Loading";
import ErroPage from "../common/ErroPage";
import { useEffect } from "react";
import { getPrintingData } from "../../redux/features/print/printingSlice";

export const Media = () => {
  const {printingData, isLoading, error} = useSelector((state)=> state.printing );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPrintingData());
  }, [dispatch]);
  if (isLoading) return <Loading />;
  if(error) return (<ErroPage error={error} />);
  return (
    <div className="flex flex-col gap-4 p-4 justify-between items-center border h-[550px] overflow-hidden overflow-y-auto">
      <form className="w-1/2">
        <label
          htmlFor="media-name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Media Name
        </label>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md">
            <TfiLayoutMediaLeftAlt />
          </span>
          <input
            type="text"
            id="media-name"
            className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
            placeholder="Media type"
          />
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Add new
          </button>
        </div>
      </form>

      <div className="w-1/2 p-4 bg-white border rounded-lg shadow sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-l font-bold leading-none text-gray-900 ">
            List of Media Types
          </h5>
          <p className="text-sm font-medium text-blue-600 hover:underline">
            Actions
          </p>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {printingData.map((data, index) => (
              <li key={data.type} className="py-2">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <input
                      title={data.type}
                      value={data.type}
                      type="text"
                      className="text-sm font-medium text-gray-900 truncate h-full"
                    />
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    <button
                      title="delete"
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
