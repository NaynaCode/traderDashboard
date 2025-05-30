import React, { useEffect, useState } from 'react';
import MessageModal from './MessageModal';
import { fetchStatus } from '../helpers/fetchFunctions';

export default function StatusIndicator({ currentUser }) {
  const [status, setStatus] = useState('stopped');
  const [rawTimestamp, setRawTimestamp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const load = async () => {
      const { status, timestamp } = await fetchStatus(currentUser.id);
      setStatus(status);
      setRawTimestamp(timestamp);
    };

    load();
    const id = setInterval(load, 120_000);
    return () => clearInterval(id);
  }, [currentUser]);

  const healthy = status === 'running';
  const displayTime = rawTimestamp
    ? new Date(rawTimestamp).toLocaleString()
    : 'Never';

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
        body={displayTime}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}