import React, { useEffect, useState } from 'react';

const STATUS_URL = 'https://referralsgrow.com/trader/status.php';

export default function StatusIndicator() {
  const [status, setStatus] = useState('stopped');
  const [lastTimestamp, setLastTimestamp] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchStatus = async () => {
      try {
        const res = await fetch(STATUS_URL);
        const data = await res.json();

        if (!data.timestamp) {
          setStatus('stopped');
          setLastTimestamp(null);
          return;
        }

        const lastUpdate = new Date(data.timestamp);
        const ageSeconds = (Date.now() - lastUpdate.getTime()) / 1000;

        if (ageSeconds <= 1800) {
          setStatus('running');
          setLastTimestamp(lastUpdate);
        } else {
          setStatus('stopped');
          setLastTimestamp(lastUpdate);
        }
      } catch (err) {
        console.error('Failed to fetch status', err);
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
    <div className={`status-indicator ${healthy ? 'status-healthy' : 'status-critical'}`}>
      {healthy ? '🟢 RUNNING' : '🔴 OFFLINE'}
    </div>
  );
}
