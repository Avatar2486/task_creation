import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // if (window.confirm('Are you sure you want to logout?')) {
    logout();
    navigate('/login');
    // }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Task Manager
        </Link>
        {user && (
          <div className="d-flex align-items-center">
            <span className="text-white me-3">Hello, {user.name}</span>
            {/* tried adding profile link but removed for now */}
            {/* <Link to="/profile" className="btn btn-outline-light btn-sm me-2">Profile</Link> */}
            <Link to="/tasks" className="btn btn-outline-light btn-sm me-2">
              Tasks
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
            >
              Logout
            </button>
          </div>
        )}
        {/* show login button if not logged in */}
        {/* {!user && (
          <div>
            <Link to="/login" className="btn btn-outline-light btn-sm me-2">Login</Link>
            <Link to="/register" className="btn btn-outline-light btn-sm">Register</Link>
          </div>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
