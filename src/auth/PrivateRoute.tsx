import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Navigate, Outlet } from 'react-router-dom';
import { setToken } from '../redux/features/user/authentication';
import { RootState } from '../redux/store';


const PrivateRoute = () => {
    const {  token } = useSelector(
        (state: RootState) => state.auth
      );
      const dispatch = useDispatch();
      useEffect(() => {
        if (token) {
          dispatch(setToken(token));
        }
      }, [token, dispatch]);

    return token ? (
      <>
        <Outlet />
      </>
    ) : (
      <Navigate to="/sign-in" replace />
    );
  };

  export default PrivateRoute;