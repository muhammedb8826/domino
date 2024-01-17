import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser, setToken, setUser } from "../redux/features/user/authentication";

interface ILogin {
  email: string | undefined;
  password: string | undefined;
}

const Login = () => {
  const { user, token, isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && token) {
      dispatch(setUser(user));
      dispatch(setToken(token));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    }
  }, [user, token, dispatch]);

  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userData: ILogin = { email: email.current?.value, password: password.current?.value };
    dispatch(loginUser(userData)).then((res) => {
      if (res.payload) {
        navigate("/dashboard");
      }
    });
  };
  return (
    <section className="flex items-center justify-center w-full h-screen">
      <div className="w-full max-w-xs">
      <div className="flex justify-center py-2">
          <NavLink to="/" className="flex text-3xl items-center"><span className="font-bold">D</span><span className="text-[#f01d52]">omino</span> </NavLink>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
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
              className="block text-gray-700 text-sm font-bold mb-2"
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
            {error ? <p className="text-red-500 text-xs italic">Incorrect username or password </p>: <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>}
           
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
            {isLoading ? "Loading..." : "Login"}
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
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

export default Login;
