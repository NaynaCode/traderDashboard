import React, { useState, useMemo } from 'react';
import '../styles/PairsTable.css';

export default function PairsTable({ pairs = [], target }) {
  const [search, setSearch] = useState('');

  const displayedPairs = useMemo(() => {
    const list = Array.isArray(pairs) ? [...pairs] : [];
    list.sort((a, b) => a.symbol.localeCompare(b.symbol));

    if (search.trim()) {
      const term = search.toLowerCase();
      return list.filter(item =>
        [item.symbol, item.value, item.base, item.target, item.buy_threshold]
          .some(val => String(val).toLowerCase().includes(term))
      );
    }
    return list;
  }, [pairs, search]);

  const calcProgress = (valueStr, baseStr, trg) => {
    const current = parseFloat(valueStr.replace('$','')) || 0;
    const threshold = (parseFloat(baseStr.replace('$','')) || 1) * trg;
    const pct = Math.min((current / threshold) * 100, 100);
    let color = '#e97171';
    if (pct >= 90) color = '#66d268';
    else if (pct >= 66) color = '#f9d172';
    return { pct, color, label: `${current.toFixed(2)} / ${threshold.toFixed(2)}` };
  };

  return (
    <div className="pairs-table-container">
      <div className="pairs-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search pairs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div>
        <table className="pairs-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pair</th>
              <th>Current Value</th>
              <th>Base</th>
              <th>Target</th>
              <th>Buy Threshold</th>
              <th>Till Selling</th>
            </tr>
          </thead>
          <tbody>
            {displayedPairs.map((pair, idx) => {
              const { pct, color, label } = calcProgress(pair.value, pair.base, target);
              return (
                <tr key={pair.symbol}>
                  <td>{idx + 1}</td>
                  <td><strong>{pair.symbol}</strong></td>
                  <td>${pair.value}</td>
                  <td>${pair.base}</td>
                  <td>${pair.target}</td>
                  <td>${pair.buy_threshold}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-filled"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      >
                        <span className="progress-bar-label">{label}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
