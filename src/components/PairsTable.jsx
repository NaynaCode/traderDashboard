import React, { useState, useMemo } from 'react';
import '../styles/PairsTable.css';

export default function PairsTable({ pairs = [] }) {
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
      <div className="table-wrapper">
        <table className="pairs-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pair</th>
              <th>Current Value</th>
              <th>Base</th>
              <th>Target</th>
              <th>Buy Threshold</th>
            </tr>
          </thead>
          <tbody>
            {displayedPairs.map((pair, idx) => (
              <tr key={pair.symbol}>
                <td>{idx + 1}</td>
                <td><strong>{pair.symbol}</strong></td>
                <td>{pair.value}</td>
                <td>{pair.base}</td>
                <td>{pair.target}</td>
                <td>{pair.buy_threshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}