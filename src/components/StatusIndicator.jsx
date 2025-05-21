// src/components/StatusIndicator.jsx
import React, { useEffect, useState } from 'react';
import MessageModal from './MessageModal';

const STATUS_URL = 'https://referralsgrow.com/trader/status.php';

export default function StatusIndicator() {
  const [status, setStatus] = useState('stopped');
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let intervalId;
    const fetchStatus = async () => {
      try {
        const res = await fetch(STATUS_URL);
        const data = await res.json();
        if (!data.timestamp) {
          setStatus('stopped');
          setLastTimestamp(null);
        } else {
          const ts = new Date(data.timestamp);
          const age = (Date.now() - ts.getTime())/1000;
          setStatus(age <= 1800 ? 'running' : 'stopped');
          setLastTimestamp(ts.toLocaleString());
        }
      } catch {
        setStatus('stopped');
        setLastTimestamp(null);
      }
    };
    fetchStatus();
    intervalId = setInterval(fetchStatus, 120_000);
    return () => clearInterval(intervalId);
  }, []);

  const healthy = status === 'running';

  return (
    <>
      <div
        className={`status-indicator ${healthy? 'status-healthy':'status-critical'}`}
        onClick={() => !healthy && setModalOpen(true)}
      >
        {healthy ? '🟢 RUNNING' : '🔴 OFFLINE'}
      </div>

      <MessageModal
        show={modalOpen}
        title="Last Activity"
        body={lastTimestamp || 'No data available'}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

