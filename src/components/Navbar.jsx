import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import StatusIndicator from './StatusIndicator'
import '../styles/Navbar.css';

const users = [
  { id: 1, name: 'Andrea', icon: '👩🏽‍💻', url: 'traderandr' },
  { id: 2, name: 'Nayna', icon: '👩🏼‍💻', url: 'trader' },
  { id: 3, name: 'Nimar', icon: '👨🏻‍💻', url: 'tradernmr' },
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Navbar({ currentUser, onUserSwitch }) {
  const [pepaTooltip, setPepaTooltip] = useState('');
  const pepaPhrases = [
    'Roooull',
    '🐾🐾',
    '(wiggles)',
    '🍗🍗',
    '(ZOOMies)',
    'Woof!',
    '🍞pls',
  ];

  return (
    <nav className="navbar">
      <div className="hdr">
        <NavLink to="/dashboard" className="brand">CryptoTrading</NavLink>
        <StatusIndicator currentUser={currentUser}/>
      </div>

      <ul className="nav-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/chart" className={({ isActive }) => (isActive ? 'active' : '')}>
            Chart
          </NavLink>
        </li>
        <li>
          <NavLink to="/pairs" className={({ isActive }) => (isActive ? 'active' : '')}>
            Pairs
          </NavLink>
        </li>
      </ul>

      <div className="chars">
        <h3
          className="pepa"
          data-tooltip={pepaTooltip}
          onMouseEnter={() => setPepaTooltip(randomPick(pepaPhrases))}
          onMouseLeave={() => setPepaTooltip('')}
        >
          🐕
        </h3>

        <div className="user-switch">
          <ul className="user-menu">
            {users.map((u) => (
              <li key={u.id}>
                <button onClick={() => onUserSwitch(u)}>{u.name}</button>
              </li>
            ))}
          </ul>
          <button className="user-button">
            <span className="user-icon">{currentUser.icon}</span>
            <span className="user-name"><strong>{currentUser.name}</strong></span>
          </button>
        </div>
      </div>
    </nav>
  );
}