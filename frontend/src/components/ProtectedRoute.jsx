import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { getUserData } from '../redux/slices/user.slice';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isLoggedIn, data } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  // Check localStorage and cookies for initial auth data
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const storedData = JSON.parse(localStorage.getItem('data') || '{}');
  const storedRole = localStorage.getItem('role');
  const authToken = Cookies.get('token');

  // Determine if we can skip the API call
  const hasValidLocalData =
    storedIsLoggedIn &&
    storedData &&
    Object.keys(storedData).length > 0 &&
    storedRole &&
    authToken &&
    isLoggedIn &&
    data &&
    Object.keys(data).length > 0;

  useEffect(() => {
    const validateSession = async () => {
      // Skip API call if local data and Redux state are valid
      if (hasValidLocalData && isValidated) {
        setIsLoading(false);
        return;
      }

      try {
        await dispatch(getUserData()).unwrap();
        setIsValidated(true);
      } catch (error) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('data');
        localStorage.removeItem('role');
        Cookies.remove('token');
        toast.error('Session invalid. Please log in.');
        setIsValidated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [dispatch, hasValidLocalData, isValidated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#1F1F1F]">
        <p className="text-orange-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  const isAuthenticated = isLoggedIn && data && Object.keys(data).length > 0 && isValidated;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = data.role || storedRole;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    toast.error('Access denied. Admins only.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;