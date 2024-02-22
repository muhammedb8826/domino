import {  useSelector } from 'react-redux';
import {  Navigate, Outlet } from 'react-router-dom';
import {  selectToken } from "../redux/features/user/authentication";


const PrivateRoute = () => {
    const  token  = useSelector(selectToken);
    console.log(token);
    
    return token ? (
      <>
        <Outlet />
      </>
    ) : (
      <Navigate to="/sign-in" replace />
    );
  };

  export default PrivateRoute;