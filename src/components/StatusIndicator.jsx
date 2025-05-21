import React, { useEffect, useState } from 'react';
import MessageModal from './MessageModal';
import { fetchStatus } from '../helpers/fetchFunctions';

export default function StatusIndicator() {
  const [status, setStatus] = useState('stopped');
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      const { status, timestamp } = await fetchStatus();
      setStatus(status);
      setLastTimestamp(timestamp);
    };

    loadStatus();
    const intervalId = setInterval(loadStatus, 120_000);
    return () => clearInterval(intervalId);
  }, []);

  const healthy = status === 'running';

  return (
    <>
      <div
        className={`status-indicator ${healthy ? 'status-healthy' : 'status-critical'}`}
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
