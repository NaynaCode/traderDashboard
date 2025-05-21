// src/components/Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import StatusIndicator from './StatusIndicator';
import '../styles/Navbar.css';

const users = [
  { id: 1, name: 'Nayna', icon: '👩🏼‍💻' },
  { id: 2, name: 'Andrea', icon: '👩🏽‍💻' },
  { id: 3, name: 'Nimar', icon: '👨🏻‍💻' }
];

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Navbar({ onUserSwitch }) {
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [pepaTooltip, setPepaTooltip] = useState('');

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    onUserSwitch?.(user);
  };

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
      <div className="d-flex flex-row gap-4">
        <NavLink to="/" className="brand">CryptoTrading</NavLink>
        <StatusIndicator />
      </div>

      <ul className="nav-menu">
        {['dashboard', 'chart', 'pairs'].map(path => (
          <li key={path}>
            <NavLink
              to={path === 'dashboard' ? '/' : `/${path}`}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {path[0].toUpperCase() + path.slice(1)}
            </NavLink>
          </li>
        ))}
      </ul>

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
          {users.map(u => (
            <li key={u.id}>
              <button onClick={() => handleUserSelect(u)}>
                {u.name}
              </button>
            </li>
          ))}
        </ul>
        <button className="user-button">
          <span className="user-icon">{currentUser.icon}</span>
          <span className="user-name"><strong>{currentUser.name}</strong></span>
        </button>
      </div>
    </nav>
  );
}
