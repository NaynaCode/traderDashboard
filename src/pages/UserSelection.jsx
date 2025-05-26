import React from 'react';
import { useNavigate } from 'react-router-dom';

const users = [
  { id: 1, name: 'Andrea', icon: '👩🏽‍💻', url: 'traderandr' },
  { id: 2, name: 'Nayna', icon: '👩🏼‍💻', url: 'trader' },
  { id: 3, name: 'Nimar', icon: '👨🏻‍💻', url: 'tradernmr' },
];

export default function UserSelection({ setUser }) {
  const navigate = useNavigate();

  const handleSelectUser = (user) => {
    setUser(user); // Set the selected user
    navigate('/dashboard'); // Navigate to dashboard
  };

  return (
    <div className="user-selection">
      <h1>Select a User</h1>
      <div className="user-list">
        {users.map((user) => (
          <button key={user.id} onClick={() => handleSelectUser(user)}>
            <span className="user-icon">{user.icon}</span>
            <span className="user-name">{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}