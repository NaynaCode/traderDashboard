// File: src/components/Navbar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

const users = [
  { id: 1, name: 'Nayna' },
  { id: 2, name: 'Andrea' },
  { id: 3, name: 'Nimar' }
];

export default function Navbar({ onUserSwitch }) {
  const [currentUser, setCurrentUser] = useState(users[0]);

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    onUserSwitch?.(user);
  };

  return (
    <nav className="navbar">

        <NavLink to="/" className="brand">CryptoTrading</NavLink>

        <ul className="nav-menu">
            {['dashboard', 'chart', 'pairs'].map((path) => (
            <li key={path}>
                <NavLink
                to={`/${path === 'dashboard' ? '' : path}`}
                className={({ isActive }) => isActive ? 'active' : ''}
                >
                {path.charAt(0).toUpperCase() + path.slice(1)}
                </NavLink>
            </li>
            ))}
        </ul>

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
                <span className="user-icon">👤</span>
                <span className="user-name">{currentUser.name}</span>
            </button>
        </div>
    </nav>
  );
}