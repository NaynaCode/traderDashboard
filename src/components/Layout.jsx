import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Layout({ currentUser, onUserSwitch }) {
  const navigate = useNavigate();

  // Redirect to user selection if no user is set
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Prevent rendering until redirected
  }

  return (
    <>
      <Navbar currentUser={currentUser} onUserSwitch={onUserSwitch} />
      <div className="container mt-4">
        <Outlet /> {/* Renders the matched child route */}
      </div>
    </>
  );
}

export default Layout;