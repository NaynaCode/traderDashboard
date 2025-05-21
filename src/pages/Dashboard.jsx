import React, { useEffect, useState } from 'react';
import BalanceCard from '../components/BalanceCard';
import BackupCard  from '../components/BackupCard';
import LogsTable   from '../components/LogsTable';
import '../styles/Pages.css';

import {
  fetchLogs,
  fetchPairs,
  fetchBalance,
  fetchBackup
} from '../helpers/fetchFunctions';

export default function Dashboard() {
  const [logs,           setLogs]           = useState([]);
  const [pairs,          setPairs]          = useState([]);
  const [balance,        setBalance]        = useState(0);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [backup,         setBackup]         = useState(0);
  const [usdt,           setUsdt]           = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [logsData, pairsData, balanceData] = await Promise.all([
          fetchLogs(),
          fetchPairs(),
          fetchBalance()
        ]);

        setLogs(logsData);
        setPairs(pairsData);
        setBalance(balanceData.current);
        setBalanceHistory(balanceData.history || []);

        // now fetch backup & usdt based on those logs
        const { backup: b, usdt: u } = await fetchBackup(logsData);
        setBackup(b);
        setUsdt(u);

      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    }

    loadData();
    const interval = setInterval(loadData, 300_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='dashboard-page'>
      <div className='cards'>
        <BalanceCard 
          currentBalance={balance}
          balanceHistory={balanceHistory}
        />
        <BackupCard
          logs={logs}
          pairs={pairs}
          backup={backup}
          usdt={usdt}
        />
      </div>
      <LogsTable logs={logs} />
    </div>
  );
}

