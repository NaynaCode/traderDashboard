import React, { useState, useEffect } from 'react';
import BalanceCard    from '../components/BalanceCard';
import BackupCard     from '../components/BackupCard';
import BalanceHistory from '../components/BalanceHistory';
import '../styles/Pages.css';

import {
  fetchLogs,
  fetchPairs,
  fetchBalance,
  fetchBackup
} from '../helpers/fetchFunctions';

export default function Chart() {
  const [logs,           setLogs]           = useState([]);
  const [pairs,          setPairs]          = useState([]);
  const [balance,        setBalance]        = useState(0);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [backup,         setBackup]         = useState(0);
  const [usdt,           setUsdt]           = useState(0);

  useEffect(() => {
    async function loadAll() {
      try {
        const [logsData, pairsData, balData] = await Promise.all([
          fetchLogs(),
          fetchPairs(),
          fetchBalance()
        ]);
        setLogs(logsData);
        setPairs(pairsData);
        setBalance(balData.current);
        setBalanceHistory(balData.history);

        const { backup: b, usdt: u } = await fetchBackup(logsData);
        setBackup(b);
        setUsdt(u);
      } catch (err) {
        console.error('Chart loading error:', err);
      }
    }

    loadAll();
    const id = setInterval(loadAll, 300_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="dashboard-page">
      <div className="cards">
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
      <BalanceHistory
        balance={balance}
        balanceHistory={balanceHistory}
      />
    </div>
  );
}
