import React, { useState, useEffect } from 'react';
import BalanceCard   from '../components/BalanceCard';
import BackupCard    from '../components/BackupCard';
import PairsTable    from '../components/PairsTable';
import '../styles/Pages.css';

import {
  fetchLogs,
  fetchPairs,
  fetchTarget,
  fetchBalance,
  fetchBackup
} from '../helpers/fetchFunctions';

export default function Pairs() {
  const [logs,           setLogs]           = useState([]);
  const [pairs,          setPairs]          = useState([]);
  const [target,         setTarget]         = useState(1.5);
  const [balance,        setBalance]        = useState(0);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [backup,         setBackup]         = useState(0);
  const [usdt,           setUsdt]           = useState(0);

  useEffect(() => {
    // single loader function
    async function loadAll() {
      try {
        const [logsData, pairsData, tgt, bal] = await Promise.all([
          fetchLogs(),
          fetchPairs(),
          fetchTarget(),
          fetchBalance()
        ]);
        setLogs(logsData);
        setPairs(pairsData);
        setTarget(tgt);
        setBalance(bal.current);
        setBalanceHistory(bal.history);

        const { backup: b, usdt: u } = await fetchBackup(logsData);
            setBackup(b);
            setUsdt(u);
      } catch (err) {
        console.error('Dashboard loading error:', err);
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
      <PairsTable pairs={pairs} target={target} />
    </div>
  );
}
