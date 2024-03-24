import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRoles, deleteRoles, getRoles } from "../../redux/features/role/roleSlice";
import ErroPage from "../common/ErroPage";
import Loading from "../common/Loading";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { RoleEditModal } from "../common/RoleEditModal";

const Role = () => {
  const { roles, isLoading, error } = useSelector((state) => state.role);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoles());
  }, [dispatch]);

  console.log(roles + "roles");

  const [role, setRole] = useState({
    name: "",
    description: "",
  });

    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({});

  const handleChange = (e) => {
    setRole({ ...role, [e.target.name]: e.target.value });
  };

const handleModalOpen = (id) => {
    setModalOpen(!modalOpen);
    setData(roles.find((data) => data.id === id));
  };

const handleDeleteRole = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this role!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "The role has been deleted.",
          icon: "success",
        }).then(() => {
          dispatch(deleteRoles(id));
        });
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createRoles(role)).then(() => {
      const message = "Role created successfully";
      toast.success(message);
      setRole({ name: "", description: "" });
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErroPage error={error} />;
  }

  return (
    <div
      className="flex flex-col gap-4 p-4 items-center border overflow-y-auto h-full"
      id="style-4"
    >
      <fieldset className="border border-black p-4 mb-2 w-full sm:w-1/2">
        <legend className="bg-black text-white border px-2">
          Add new role
        </legend>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="role-name"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Role Name
            </label>
            <input
              onChange={(e) => {
                handleChange(e);
              }}
              type="text"
              id="role-name"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="name"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Description
            </label>
            <input
              onChange={(e) => {
                handleChange(e);
              }}
              type="text"
              id="description"
              name="description"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="description"
              required
            />
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              className="float-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Add new
            </button>
          </div>
        </form>
      </fieldset>

      <div className="w-1/2 p-4 bg-white border rounded-lg shadow sm:p-8">
        <div className="flex flex-1 items-center justify-between mb-4">
          <h5 className="text-l font-bold leading-none text-gray-900 ">
            List of Media Types
          </h5>
          <p className="text-sm text-center font-medium text-blue-600 hover:underline w-1/4">
            Actions
          </p>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {roles.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-gray-900">
                  No data found
                </p>
              </div>
            )}
            {roles && roles.map((role) => (
              <li key={role.id} className="py-2">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p
                      className="text-sm font-medium text-gray-900 truncate h-full"
                    >
                      {role.name}
                    </p>
                  </div>
                  <div className="inline-flex gap-4 items-center text-base font-semibold text-gray-900">
                  <button
                      title="edit"
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:blue-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleModalOpen(role.id)}
                    >
                      <FaRegEdit  className="w-5 h-5" />
                    </button>
                    <button
                      title="delete"
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-3 py-2 my-2 text-center"
                      type="button"
                      onClick={() => handleDeleteRole(role.id)}
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
     {modalOpen && <RoleEditModal handleModalOpen={handleModalOpen} data={data} />}
    </div>
  );
};

export default Role;
