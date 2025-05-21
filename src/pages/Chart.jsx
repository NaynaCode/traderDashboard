import React, { useState, useEffect } from 'react';
import BalanceCard from '../components/BalanceCard';
import BackupCard from '../components/BackupCard';
import BalanceHistory from '../components/BalanceHistory';
import '../styles/Dashboard.css';

const LOGS_ENDPOINT = 'https://referralsgrow.com/trader/logs.php';
const PAIRS_ENDPOINT = 'https://referralsgrow.com/trader/pairs.php';
const BALANCE_ENDPOINT = 'https://referralsgrow.com/trader/balance.php'

export default function Pairs() {
    const [logs, setLogs] = useState([]);
    const [pairs, setPairs] = useState([]);
    const [balance, setBalance] = useState();
    const [balanceHistory, setBalanceHistory] = useState();

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
                setPairs(data.pairs || []);
            } catch (err) {
                console.error('Error fetching pairs:', err);
                setPairs([]);
            }
        }
        async function fetchBalance() {
            try {
                const [currentRes, historyRes] = await Promise.all([
                fetch(BALANCE_ENDPOINT),
                fetch(`${BALANCE_ENDPOINT}?history=1`)
                ]);

                const currentData = await currentRes.json();
                const historyData = await historyRes.json();

                setBalance(currentData.balance || 0);
                setBalanceHistory(historyData.history || []);
            } catch (err) {
                console.error('Error fetching balance:', err);
            }
        }

        fetchPairs();
        fetchLogs();
        fetchBalance();
        setInterval(fetchPairs, 300000);
        setInterval(fetchLogs, 300000);
        setInterval(fetchBalance, 300000);
    }, [])

    return (
        <div className='dashboard-page'>
            <div className='cards'>
            <BalanceCard currentBalance={balance} balanceHistory={balanceHistory} />
            <BackupCard logs={logs} pairs={pairs} />
            </div>
            <BalanceHistory balance={balance} balanceHistory={balanceHistory}/>
        </div>
    )
}