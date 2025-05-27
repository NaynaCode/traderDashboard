import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Layout({ currentUser, onUserSwitch }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; 
  }

  return (
    <>
      <Navbar currentUser={currentUser} onUserSwitch={onUserSwitch} />
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;