import React from 'react';

export default function StatusIndicator({ status, lastTimestamp }) {
  const healthy = status === 'running';
  return (
    <div className={`status-indicator ${healthy? 'status-healthy':'status-critical'}`}>  
      {healthy ? '🟢 RUNNING' : '🔴 OFFLINE'}
    </div>
  );
}