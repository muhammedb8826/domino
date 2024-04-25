import { Link, NavLink, useNavigate } from 'react-router-dom';
import { loginUser, setToken, setUser } from '@/redux/features/user/authentication';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ThunkDispatch } from '@reduxjs/toolkit';

interface ILogin {
  email: string | undefined;
  password: string | undefined;
}

const SignIn = () => {

  const { user, token, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();

  useEffect(() => {
    if (user && token) {
      dispatch(setUser(user));
      dispatch(setToken(token));
      navigate('/dashboard');
   }
  }, [user, token, dispatch, navigate]);

  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData: ILogin = {
      email: email.current?.value,
      password: password.current?.value,
    };
    try {
      await dispatch(loginUser(userData));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <section className="flex items-center justify-center w-full h-screen">
    <div className="w-full max-w-xs">
      <div className="flex justify-center py-2">
        <NavLink to="/" className="text-graydark flex text-3xl items-center">
          <span className="">IAN PLC</span>
        </NavLink>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-graydark text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            ref={email}
            name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-graydark text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            ref={password}
            name="password"
            className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
          {error ? (
            <p className="text-danger text-xs italic">
              Incorrect username or password{" "}
            </p>
          ) : (
            <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          {isLoading ? (
            <button
              disabled
              type="button"
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </button>
          ) : (
            <button
              className="text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-primary dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
              type="submit"
            >
              Login
            </button>
          )}
          <a
            className="inline-block align-baseline font-bold text-sm text-meta-5 hover:text-meta-5/80"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2024 Domino. All rights reserved.
      </p>
    </div>
  </section>
      
  );
};

export default SignIn;
