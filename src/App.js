import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chart from './pages/Chart';
import Pairs from './pages/Pairs';
import UserSelection from './pages/UserSelection';
import Layout from './components/Layout';

function App() {
  const [currentUser, setCurrentUser] = useState(null); // Start with no user selected
  const navigate = useNavigate();

  const handleSwitchUser = (user) => {
    setCurrentUser(user);
    navigate('/dashboard'); // Navigate to dashboard when switching users
  };

  return (
    <Routes>
      {/* User selection page at root */}
      <Route path="/" element={<UserSelection setUser={setCurrentUser} />} />
      {/* Layout wraps pages that require a user */}
      <Route element={<Layout currentUser={currentUser} onUserSwitch={handleSwitchUser} />}>
        <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
        <Route path="/chart" element={<Chart currentUser={currentUser} />} />
        <Route path="/pairs" element={<Pairs currentUser={currentUser} />} />
      </Route>
    </Routes>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
