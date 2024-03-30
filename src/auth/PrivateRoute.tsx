import {  useSelector } from 'react-redux';
import {  Navigate, Outlet } from 'react-router-dom';
import {  selectToken } from "../redux/features/user/authentication";


const PrivateRoute = () => {
    const  token  = useSelector(selectToken);    
    return token ? (
      <>
        <Outlet />
      </>
    ) : (
      <Navigate to="/signin" replace />
    );
  };

  export default PrivateRoute;