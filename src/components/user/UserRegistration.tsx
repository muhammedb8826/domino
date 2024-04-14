import { useEffect, useState } from "react";
import { createUser } from "../../redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { clearSuccessMessage } from "../../redux/features/user/userSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CgClose } from "react-icons/cg";
import { getMachines } from "@/redux/features/machine/machineSlice";
import Loading from "../common/Loading";
import Loader from "@/common/Loader";

interface UserRegistrationProps {
  handleModalOpen: () => void;
  errors: null | string;
}

const UserRegistration = ({
  handleModalOpen,
  errors,
}: UserRegistrationProps) => {
  const { isLoading, registrationErrors, message } = useSelector(
    (state: RootState) => state.user
  );
  const { machines } = useSelector((state: RootState) => state.machine);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMachines());
  }, [dispatch]);

  const errPhone = errors && errors.phone ? errors.phone[0] : null;
  const errEmail = errors && errors.email ? errors.email[0] : null;
  const errPassword = errors && errors.password ? errors.password[0] : null;

  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "male",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    joinedDate: "",
    address: "",
    profileImage: "",
    roles: "reception",
    machinePermissions: [],
    isActice: true,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUserData = {
      first_name: userData.firstName,
      middle_name: userData.middleName,
      last_name: userData.lastName,
      gender: userData.gender,
      phone: userData.phoneNumber,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword,
      joined_date: userData.joinedDate,
      address: userData.address,
      profile_image: userData.profileImage,
      roles: userData.roles,
      machine_permissions: userData.machinePermissions,
      is_active: userData.isActice,
    };

    dispatch(createUser(newUserData)).then((res) => {
      if (res.payload.data) {
        const message = res.payload.data.message;
        toast.success(message);
        dispatch(clearSuccessMessage());
        handleModalOpen();
      }
    });

    setUserData({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      joinedDate: "",
      address: "",
      profileImage: "",
      roles: "reception",
      machinePermissions: [],
      isActice: true,
    });
  };

  return isLoading? (<Loader/>):(
    <>
      <div className="justify-center items-center flex overflow-hidden fixed inset-0 z-9999 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl md:w-1/2 h-[95%]">
          {/*content*/}
          <div className=" rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none h-full border-0 overflow-hidden overflow-y-auto">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-2xl font-semibold">Add New User</h3>
              {registrationErrors && (
                <p className="text-red-500 text-xs italic">
                  {registrationErrors.message}
                </p>
              )}
              <button
                type="button"
                title="Close Modal"
                className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleModalOpen}
              >
                <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <CgClose />
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="">
              {/*body*/}
              <div className="relative p-6 flex-auto">
                <div className="grid gap-4 md:grid-cols-3 p-2">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="firstName"
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Middle name
                    </label>
                    <input
                      type="text"
                      id="middle_name"
                      name="middleName"
                      value={userData.middleName}
                      onChange={(e) =>
                        setUserData({ ...userData, middleName: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="lastName"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 p-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Phone number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phoneNumber"
                      value={userData.phoneNumber}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="09-4544-6788"
                      pattern="[0-9]{2}-[0-9]{4}-[0-9]{4}"
                      required
                    />
                    {errPhone && (
                      <p className="text-red-500 text-xs italic">{errPhone} </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="john.doe@company.com"
                      required
                    />
                    {errEmail && (
                      <p className="text-red-500 text-xs italic">{errEmail} </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="•••••••••"
                      required
                    />
                    {errPassword && (
                      <p className="text-red-500 text-xs italic">
                        {errPassword}{" "}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirm_password"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Confirm password
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="•••••••••"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={userData.address}
                      onChange={(e) =>
                        setUserData({ ...userData, address: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      placeholder="123 Main St, City"
                      required
                    />
                  </div>

                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pt-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http:www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <label
                      htmlFor="joining-date"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Joining date
                    </label>
                    <input
                      datepicker-buttons={userData.joinedDate.toString()}
                      type="date"
                      id="joining-date"
                      name="joinedDate"
                      value={userData.joinedDate.toString()}
                      onChange={(e) =>
                        setUserData({ ...userData, joinedDate: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2"
                      placeholder="Select date"
                    />
                  </div>

                  <div className="flex items-center gap-4 ps-4 border border-gray-200 rounded dark:border-gray-700">
                    <div className="flex items-center me-4">
                      <input
                        id="inline-radio-male"
                        type="radio"
                        value="male" // Set the value attribute to "male"
                        name="gender"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                        onChange={(e) =>
                          setUserData({ ...userData, gender: e.target.value })
                        }
                        required
                      />
                      <label
                        htmlFor="inline-radio-male"
                        className="ms-2 text-sm font-medium text-gray-900"
                      >
                        Male
                      </label>
                    </div>
                    <div className="flex items-center me-4">
                      <input
                        id="inline-2-radio-female"
                        type="radio"
                        value="female" // Set the value attribute to "female"
                        name="gender"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600"
                        onChange={(e) =>
                          setUserData({ ...userData, gender: e.target.value })
                        }
                        required
                      />
                      <label
                        htmlFor="inline-2-radio-female"
                        className="ms-2 text-sm font-medium text-gray-900"
                      >
                        Female
                      </label>
                    </div>
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="file_input"
                    >
                      Profile image
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                      aria-describedby="file_input_help"
                      id="file_input"
                      type="file"
                      accept="image/*"
                      name="profileImage"
                      value={userData.profileImage}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          profileImage: e.target.value,
                        })
                      }
                    />
                    <p
                      className="mt-1 text-sm text-gray-500"
                      id="file_input_help"
                    >
                      SVG, PNG, JPG or GIF (MAX. 800x400px).
                    </p>
                  </div>
                  <div>
                    <label
                      htmlFor="roles"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Assign role
                    </label>
                    <select
                      defaultValue="reception"
                      id="roles"
                      name="roles"
                      value={userData.roles}
                      onChange={(e) =>
                        setUserData({ ...userData, roles: e.target.value })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="reception">Reception</option>
                      <option value="graphic-designer">Graphic designer</option>
                      <option value="operator">Operator</option>
                      <option value="finance">Finance</option>
                      <option value="owner">Owner</option>
                      <option value="store-representative">Store representative</option>
                    </select>
                  </div>
                  {userData.roles === "operator" && (
                    <div>
                      <label
                        htmlFor="machinePermissions"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Assign machines
                      </label>
                      <select
                        id="machinePermissions"
                        name="machinePermissions"
                        multiple={true}
                        onChange={(e) => {
                          const selectedValues = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          );
                          setUserData({
                            ...userData,
                            machinePermissions: selectedValues,
                          });
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        {machines.map((machine) => (
                          <option key={machine.id} value={machine.id}>
                            {machine.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleModalOpen}
                >
                  Close
                </button>
                <button
                  className="bg-primary text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="submit"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default UserRegistration;
