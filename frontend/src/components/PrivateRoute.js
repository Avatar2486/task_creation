import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // show loading spinner while checking auth
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {/* <p className="mt-2">Loading...</p> */}
      </div>
    );
  }

  // redirect to login if not authenticated
  return user ? children : <Navigate to="/login" />;
};

// tried using redirect instead of Navigate but this is cleaner
// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     window.location.href = '/login';
//     return null;
//   }
//   return children;
// };

export default PrivateRoute;
