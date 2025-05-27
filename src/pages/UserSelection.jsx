import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Pages.css';

const users = [
  { id: 1, name: 'Andrea', icon: '👩🏽‍💻', url: 'traderandr' },
  { id: 2, name: 'Nayna', icon: '👩🏼‍💻', url: 'trader' },
  { id: 3, name: 'Nimar', icon: '👨🏻‍💻', url: 'tradernmr' },
];

export default function UserSelection({ setUser }) {
  const navigate = useNavigate();

  const handleSelectUser = (user) => {
    setUser(user);
    navigate('/dashboard');
  };

  return (
    <div className="user-selection">
      <h5 className="fade-down"><i>*knock knock*</i></h5>
      <h1 className="fade-down delay-1">Who's there?</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <button
            key={user.id}
            onClick={() => handleSelectUser(user)}
            className="user-button fade-up"
            style={{ '--i': index }}
          >
            <span className="user-icon">{user.icon}</span>
            <span className="user-name">{user.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
