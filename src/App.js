import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Chart from './pages/Chart';
import Pairs from './pages/Pairs';

function App() {
  const[currentUser, setCurrentUser] = useState({id:1, name:'Nayna'});
  const handleSwitchUser = (user) => {
    setCurrentUser(user);
  }

  return (
    <BrowserRouter>
      <Navbar onUserSwitch={handleSwitchUser} />
      <div className='container mt-4'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/chart' element={<Chart/>} />
          <Route path='/pairs' element={<Pairs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
