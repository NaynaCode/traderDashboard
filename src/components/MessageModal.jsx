// src/components/MessageModal.jsx
import React from 'react';
import '../styles/MessageModal.css';

export default function MessageModal({ show, title, body, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {body}
        </div>
      </div>
    </div>
  );
}
