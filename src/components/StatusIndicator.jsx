import React, { useEffect, useState } from 'react';
import MessageModal from './MessageModal';
import { fetchStatus } from '../helpers/fetchFunctions';

export default function StatusIndicator({ currentUser }) {
  const [status, setStatus] = useState('stopped');
  const [lastTimestamp, setLastTimestamp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const { status, timestamp } = await fetchStatus();
        setStatus(status);
        
        if (timestamp) {
          const date = new Date(timestamp);
          setLastTimestamp(date);
          setLastUpdate(date.toLocaleString());
        } else {
          setLastTimestamp(null);
          setLastUpdate('Never');
        }
      } catch (err) {
        console.error('Status check failed:', err);
        setStatus('error');
      }
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
          body={lastUpdate} 
          onClose={() => setModalOpen(false)}
        />
    </>
  );
}
