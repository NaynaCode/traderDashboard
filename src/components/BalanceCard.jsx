import React, { useMemo } from 'react';
import '../styles/BalanceCard.css';

export default function BalanceCard({ currentBalance = 0, balanceHistory = [] }) {
  // Pre‑process history: sort by timestamp ascending
  const sortedHistory = useMemo(
    () =>
      balanceHistory
        .map((h) => ({
          ts: new Date(h.timestamp).getTime(),
          bal: parseFloat(h.balance),
        }))
        .sort((a, b) => a.ts - b.ts),
    [balanceHistory]
  );

  // Compute P&L for 1D, 7D, 30D
  const { pnl1d, pnl7d, pnl30d } = useMemo(() => {
    const now = Date.now();
    const ms = { '1D': 86400e3, '7D': 604800e3, '30D': 2592000000 };
    const findPast = (cutoff) => {
      let past = null;
      for (const point of sortedHistory) {
        if (point.ts <= cutoff) past = point.bal;
        else break;
      }
      return past;
    };
    const compute = (past) => (past ? ((currentBalance - past) / past) * 100 : null);
    const format = (v) =>
      v == null || isNaN(v)
        ? null
        : {
            text: `${v >= 0 ? '+' : ''}${v.toFixed(2)}% ${v >= 0 ? '▲' : '▼'}`,
            positive: v >= 0,
          };

    const p1 = compute(findPast(now - ms['1D']));
    const p7 = compute(findPast(now - ms['7D']));
    const p30 = compute(findPast(now - ms['30D']));

    return {
      pnl1d: format(p1),
      pnl7d: format(p7),
      pnl30d: format(p30),
    };
  }, [currentBalance, sortedHistory]);

  return (
    <div className="stat-card">
      <h4>Portfolio Value</h4>
      <div className="value-row">
        <span className="main-value">${currentBalance.toFixed(2)}</span>
        {pnl1d && (
          <span className={pnl1d.positive ? 'change-pnl positive' : 'change-pnl negative'}>
            {pnl1d.text}
          </span>
        )}
        <span className="label24h">24h</span>
      </div>
      <div className="trend-row">
        <span className={pnl7d?.positive ? 'pnl-secondary positive' : 'pnl-secondary negative'}>
          7D: {pnl7d?.text || 'N/A'}
        </span>
        <span
          className={pnl30d?.positive ? 'pnl-secondary positive' : 'pnl-secondary negative'}
        >
          30D: {pnl30d?.text || 'N/A'}
        </span>
      </div>
    </div>
  );
}
