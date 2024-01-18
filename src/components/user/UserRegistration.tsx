import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { createUser } from "../../redux/features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const UserRegistration = () => {
const { isLoading, error, message, errors } = useSelector((state: any) => state.user);
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
    };

    dispatch(createUser(newUserData));
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
    });
  };

  return (
    <div className="p-4 flex justify-center h-screen overflow-hidden">
      <form className="bg-white w-10/12 p-4 rounded-md h-full overflow-y-scroll" onSubmit={handleSubmit}>
        <h1 className="text-xl font-bold p-4">User Registration</h1>
        {message ? <div className="flex justify-center text-green-400">{message}</div>: <div className="flex justify-center text-red-400">{error}</div>}
        <hr />

        <div className="grid gap-6 mb-6 md:grid-cols-3 p-4">
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

        <div className="grid gap-6 mb-6 md:grid-cols-2 p-4">
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
                setUserData({ ...userData, phoneNumber: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              placeholder="123-45-678"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
              required
            />
            {errPhone && <p className="text-red-500 text-xs italic">{errPhone} </p>}
          </div>
          <div className="mb-6">
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
            {errEmail && <p className="text-red-500 text-xs italic">{errEmail} </p>}
          </div>
          <div className="mb-6">
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
            {errPassword && <p className="text-red-500 text-xs italic">{errPassword} </p>}
          </div>
          <div className="mb-6">
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
                setUserData({ ...userData, confirmPassword: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
              placeholder="•••••••••"
              required
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

          {/* <div>
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
                setUserData({ ...userData, profileImage: e.target.value })
              }
            />
            <p className="mt-1 text-sm text-gray-500" id="file_input_help">
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>
          </div> */}

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
            <input
              datepicker-buttons={userData.joinedDate.toString()}
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={userData.joinedDate.toString()}
              onChange={(e) =>
                setUserData({ ...userData, joinedDate: e.target.value })
              }
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2"
              placeholder="Select date"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="flex items-center justify-between gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
          >
            <IoMdAddCircle />
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistration;
