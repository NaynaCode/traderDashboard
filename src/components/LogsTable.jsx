import React, { useState, useMemo } from 'react';
import '../styles/LogsTable.css';

export default function LogsTable({ logs }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    let result = Array.isArray(logs) ? logs : [];
    if (filter === 'error') {
      result = result.filter(l => ['ERROR','WARNING'].includes(l.action));
    } else if (filter === 'trades') {
      result = result.filter(l => ['BUY','SELL','BASE_INCREASE'].includes(l.action));
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(l =>
        [l.timestamp, l.action, l.symbol, l.amount, l.price, l.total_cost, l.usdt_balance]
          .some(val => String(val).toLowerCase().includes(term))
      );
    }
    return result.sort((a,b)=> new Date(b.timestamp)-new Date(a.timestamp));
  }, [logs, filter, search]);

  return (
    <div className="logs-table-container">
      <div className="controls">
        <div className="filter-btns">
          <button
            className={filter==='all' ? 'pill active all' : 'pill'}
            onClick={()=>setFilter('all')}>All</button>
          <button
            className={filter==='error' ? 'pill active err' : 'pill'}
            onClick={()=>setFilter('error')}>Errors</button>
          <button
            className={filter==='trades' ? 'pill active trs' : 'pill'}
            onClick={()=>setFilter('trades')}>Trades</button>
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search logs..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>
      <div className="table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Time</th><th>Action</th><th>Symbol</th>
              <th>Amount</th><th>Price</th><th>Total</th><th>USDT</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, idx)=>(
              <tr key={idx}>
                <td>{log.timestamp}</td>
                <td><span className={`badge ${log.action.toLowerCase()}`}>{log.action}</span></td>
                <td><b>{log.symbol}</b></td>
                <td>{log.amount!=null?parseFloat(log.amount).toFixed(4):'-'}</td>
                <td>{log.price!=null?parseFloat(log.price).toFixed(4):'-'}</td>
                <td>{log.total_cost!=null?`$${parseFloat(log.total_cost).toFixed(2)}`:'-'}</td>
                <td><b>{log.usdt_balance!=null?`$${parseFloat(log.usdt_balance).toFixed(2)}`:'-'}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}