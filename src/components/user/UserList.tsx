import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../redux/features/user/userSlice";
import { useEffect, useState } from "react";
import userImage from "../../assets/images/avatar.jpg";
import { CiMenuKebab } from "react-icons/ci";
import { NavLink } from "react-router-dom";

const UserList = () => {
  const { users, isLoading, error } = useSelector((state: any) => state.user);
  const [showPopover, setShowPopover] = useState(null);

const handleAction = (index: number) => {
  setShowPopover((prevIndex) => (prevIndex === index ? null : index));
}
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const userListContent =
    users && users.data
      ? users.data.map((user: any, index: number) => (
          <tbody key={user.id}>
            <tr className="bg-white border-b hover:bg-gray-50">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-table-1"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="checkbox-table-1" className="sr-only">
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src={userImage}
                  alt="Jese image"
                />
                <div className="ps-3">
                  <div className="text-base font-semibold">
                    {user.first_name} {user.middle_name} {user.last_name}
                  </div>
                  <div className="font-normal text-gray-500">{user.email}</div>
                </div>
              </th>
              <td className="px-6 py-4">{user.phone}</td>
              <td className="px-6 py-4">{user.address}</td>
              <td className="px-6 py-4">{user.joined_date}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleAction(index)}
                  title="action"
                  data-popover-target={`popover-bottom-${index}`}
                  data-popover-trigger="click"
                  id={`dropdownAvatarNameButton-${user.id}-${index}`}
                  type="button"
                  className="text-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  <CiMenuKebab />
                </button>
                {showPopover === index && (
                  <div
                  // id={`dropdownAvatarName-${user.id}-${index}`}
                    className="absolute z-10 right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                  >
                    {/* Dropdown content */}
                    <div className="px-4 py-3 text-sm text-gray-900">
                      <div className="font-medium">Pro User</div>
                      <div className="truncate">{user.email}</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                      <NavLink to="#" className="w-full block px-4 py-2 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</NavLink>
                      </li>
                      <li>
                        <button type="button" className="text-left w-full block px-4 py-2 hover:bg-gray-100">
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        ))
      : null;

  return (
    <div className="flex w-full justify-center p-4">
      <div className="relative overflow-x-auto h-[49%] overflow-y-auto shadow-md sm:rounded-lg w-11/12">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500  "
                  />
                  <label htmlFor="checkbox-all" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Full name
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Joined date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          {userListContent}
        </table>
      </div>
    </div>
  );
};

export default UserList;
