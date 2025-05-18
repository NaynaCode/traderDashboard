// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import StatusIndicator from '../components/StatusIndicator';

const STATUS_URL = 'https://referralsgrow.com/trader/status.php';

const users = [
  { id: 1, name: 'Nayna', icon: '👩🏼‍💻' },
  { id: 2, name: 'Andrea', icon: '👩🏽‍💻' },
  { id: 3, name: 'Nimar', icon: '👨🏻‍💻' }
];

export default function Navbar({ onUserSwitch }) {
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [statusLog, setStatusLog] = useState({
    status: 'stopped',
    timestamp: null
  });

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    onUserSwitch?.(user);
  };

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const res = await fetch(STATUS_URL);
        const data = await res.json();

        if (!data.timestamp) {
          // No valid timestamp → treat as stopped
          setStatusLog({ status: 'stopped', timestamp: null });
          return;
        }

        const lastUpdate = new Date(data.timestamp);
        const ageSeconds = (Date.now() - lastUpdate.getTime()) / 1000;

        // Consider healthy if update within last 30 minutes (1800 s)
        if (ageSeconds <= 1800) {
          setStatusLog({ status: 'running', timestamp: lastUpdate });
        } else {
          setStatusLog({ status: 'stopped', timestamp: lastUpdate });
        }
      } catch (err) {
        console.error('Failed to fetch status', err);
        setStatusLog({ status: 'stopped', timestamp: null });
      }
    };

    fetchStatus();
    intervalId = setInterval(fetchStatus, 120_000); // every 2 min

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="navbar">
      <div className="d-flex flex-row gap-4">
        <NavLink to="/" className="brand">CryptoTrading</NavLink>
        <StatusIndicator
          status={statusLog.status}
          lastTimestamp={statusLog.timestamp}
        />
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
