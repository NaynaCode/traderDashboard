import React, { useState, useEffect } from 'react';
import BalanceCard from '../components/BalanceCard';
import BackupCard from '../components/BackupCard';
import LogsTable from '../components/LogsTable';

const LOGS_ENDPOINT = 'https://referralsgrow.com/trader/logs.php';
const PAIRS_ENDPOINT = 'https://referralsgrow.com/trader/pairs.php';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(LOGS_ENDPOINT);
        const data = await res.json();
        setLogs(data); // Consider adding Array.isArray check here too if needed
      } catch (err) {
        console.error('Error fetching trade_logs:', err);
      }
    }
    async function fetchPairs() {
        try {
            const res = await fetch(PAIRS_ENDPOINT);
            const data = await res.json();
            console.log('Fetched pairs data:', data); // Debug the raw response
            setPairs(data.pairs || []); // Set pairs to data.pairs, or [] if undefined
        } catch (err) {
            console.error('Error fetching pairs:', err);
            setPairs([]); // Fallback to empty array on error
        }
        }

    fetchPairs();
    fetchLogs();
  }, []);

  return (
    <div className='dashboard-page'>
      <div className='cards'>
        <BalanceCard />
        <BackupCard logs={logs} pairs={pairs} />
      </div>
      <LogsTable logs={logs} />
    </div>
  );
}
