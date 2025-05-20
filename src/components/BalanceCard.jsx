import React, { useEffect, useState } from 'react';
import '../styles/BalanceCard.css';

const BALANCE_URL = 'https://referralsgrow.com/trader/balance.php';

export default function BalanceCard() {
  const [currentBalance, setCurrentBalance] = useState(0);
  const [change24h, setChange24h] = useState(null);
  const [change7d, setChange7d] = useState(null);
  const [change30d, setChange30d] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const [currentRes, historyRes] = await Promise.all([
          fetch(BALANCE_URL),
          fetch(`${BALANCE_URL}?history=1`)
        ]);

        const currentData = await currentRes.json();
        const historyData = await historyRes.json();

        if (!currentData.success || !historyData.success) return;

        const current = parseFloat(currentData.balance);
        setCurrentBalance(current);

        const allHistory = historyData.history
          .map(entry => ({ timestamp: new Date(entry.timestamp), balance: parseFloat(entry.balance) }))
          .sort((a, b) => a.timestamp - b.timestamp);

        const findClosest = target => {
          let closest = null;
          for (const e of allHistory) {
            if (e.timestamp <= target) closest = e.balance;
            else break;
          }
          return closest;
        };

        const now = Date.now();
        const periods = {
          '1D': now - 86400_000,
          '7D': now - 604_800_000,
          '30D': now - 2592000000
        };

        const computePnL = past => past ? ((current - past) / past) * 100 : null;
        const format = val => val == null || isNaN(val)
          ? null
          : { text: `${val >= 0 ? '+' : ''}${val.toFixed(2)}% ${val >= 0 ? '▲' : '▼'}`, positive: val >= 0 };

        const pnl24 = computePnL(findClosest(periods['1D']));
        const pnl7 = computePnL(findClosest(periods['7D']));
        const pnl30 = computePnL(findClosest(periods['30D']));

        setChange24h(format(pnl24));
        setChange7d(format(pnl7));
        setChange30d(format(pnl30));
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    };

    fetchBalance();
    const id = setInterval(fetchBalance, 300_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stat-card">
      <h4>Portfolio Value</h4>
      <div className="value-row">
        <span className="main-value">${currentBalance.toFixed(2)}</span>
        {change24h && (
          <span className={change24h.positive ? 'change-pnl positive' : 'change-pnl negative'}>
            {change24h.text}
          </span>
        )}
        <span className="label24h">24h</span>
      </div>
      <div className="trend-row">
        <span className={change7d?.positive ? 'pnl-secondary positive' : 'pnl-secondary negative'}>
          7D: {change7d?.text || 'N/A'}
        </span>
        <span className={change30d?.positive ? 'pnl-secondary positive' : 'pnl-secondary negative'}>
          30D: {change30d?.text || 'N/A'}
        </span>
      </div>
    </div>
  );
}