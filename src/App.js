import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Chart from './pages/Chart';
import Pairs from './pages/Pairs';
import './styles/Navbar.css';
import './styles/Dashboard.css';
import './styles/BalanceCard.css';
import './styles/BackupCard.css';
import './styles/LogsTable.css';

function App() {
  const[currentUser, setCurrentUser] = useState({id:1, name:'Nayna', icon: '👩🏼‍💻'});
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
