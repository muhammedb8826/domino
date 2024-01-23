import { useState } from "react";
import { createUser } from "../../redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaRegWindowClose } from "react-icons/fa";
import { RootState } from "@reduxjs/toolkit/query";
import { clearSuccessMessage } from "../../redux/features/user/userSlice";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



interface UserRegistrationProps {
  handleModalOpen: () => void;
  errors: null | string;
}


const UserRegistration = ({ handleModalOpen, errors }: UserRegistrationProps) => {
  const { isLoading, registrationErrors, message } = useSelector(
    (state: RootState) => state.user
  );


  // const [errPhone, setErrPhone] = useState(null);
  // const [errEmail, setErrEmail] = useState(null);
  // const [errPassword, setErrPassword] = useState(null);

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
  });

  const dispatch = useDispatch();

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
    };

    dispatch(createUser(newUserData)).then((res) => {
      
        if(res.payload.data){
          toast(message)
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
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-1/2 inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <div className="flex justify-between items-center">
              <h3
                className="text-lg font-medium leading-6 text-gray-900"
                id="modal-headline"
              >
                Add New User
              </h3>
              
              <button
                onClick={handleModalOpen}
                type="button"
                title="close"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-blue-300 sm:ml-3 sm:w-auto"
              >
                <FaRegWindowClose />
              </button>
            </div>
            {registrationErrors && (
                <p className="text-red-500 text-xs italic">
                  {registrationErrors.message}{" "}
                </p>
              )}
            <div className="mt-2">
              <div>
               
                <hr />

                <div className="grid gap-2 md:grid-cols-3 p-2">
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

                <div className="grid gap-2 md:grid-cols-2 p-2">
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
                      placeholder="123-45-678"
                      pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
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

                  <div className="mb-6">
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
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
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

                  <div className="flex">
                    <div className="flex items-center me-4">
                      <input
                        id="inline-radio-male"
                        type="radio"
                        value="male"
                        name="gender"
                        checked
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
                        value="female"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-700 border border-transparent rounded-md shadow-sm hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default UserRegistration;
