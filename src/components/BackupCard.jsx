import React, { useEffect, useState, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/BackupCard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const BACKUP_URL = 'https://referralsgrow.com/trader/backup.php';

// Define color arrays for pairs and their hover states
const pairColors = [
      '#FFC0CA', '#B3DFFF', '#FFF0B3', '#A3E8E8', '#D9CCFF',
      '#FFD9B3', '#C7E8A3', '#FFB7CB', '#99E6FF', '#FFF2B3'
    ];

const pairHoverColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#8AC249', '#EA5F89',
    '#00BFFF', '#FFD700'
];

export default function BackupCard({ logs = [], pairs = [] }) {
  const [backup, setBackup] = useState(0);
  const [usdt, setUsdt] = useState(0);

  useEffect(() => {
    async function fetchBackup() {
      try {
        const [currentRes] = await Promise.all([fetch(BACKUP_URL)]);
        const currentData = await currentRes.json();
        if (currentData.success) {
          setBackup(parseFloat(currentData.backup));
        }
        const sorted = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        if (sorted.length) {
          setUsdt(parseFloat(sorted[0].usdt_balance));
        }
      } catch (err) {
        console.error('Error fetching backup:', err);
      }
    }
    fetchBackup();
  }, [logs]);

  const { pieData, tokensTotal } = useMemo(() => {
    if (!Array.isArray(pairs)) {
      console.error('pairs is not an array:', pairs);
      return {
        pieData: { labels: [], datasets: [] },
        tokensTotal: 0
      };
    }

    const tokenValues = pairs.map(p => parseFloat(p.value.replace('$', '')));
    const tokensTotal = tokenValues.reduce((sum, value) => sum + value, 0);
    const usdtValue = usdt;
    const data = tokenValues.concat(usdtValue);

    // Generate colors based on data array indices
    const backgroundColor = data.map((_, index) => 
      index === data.length - 1 ? '#d3d3d3' : pairColors[index % pairColors.length]
    );
    
    const hoverBackgroundColor = data.map((_, index) =>
      index === data.length - 1 ? '#3f3f3f' : pairHoverColors[index % pairHoverColors.length]
    );

    const pieData = {
      datasets: [{
        data,
        backgroundColor,
        hoverBackgroundColor,
        hoverOffset: 8,
      }]
    };

    return { pieData, tokensTotal };
  }, [pairs, usdt]);

  return (
    <div className="bckp-card">
      <div className='d-flex flex-column justify-content-center'>
        <div className="d-flex justify-content-between align-items-center">
          <h4>Backup</h4>
        </div>
        <div id='backup-value' className="d-flex align-items-center">
          <h2 id="usdt">${usdt.toFixed(2)}</h2>
          <h2>/</h2>
          <h3 id="bckp">${backup.toFixed(2)}</h3>
        </div>
      </div>

      <div className="pie-chart-container">
        <Pie data={pieData} options={{
          maintainAspectRatio: false,
        }} />
      </div>

      <div className='d-flex flex-column justify-content-center'>
        <div className="d-flex justify-content-end align-items-center"> 
            <h4>Tokens</h4>
        </div>
        <div className="d-flex justify-content-end align-items-center">
            <h2 id="tokens">${tokensTotal.toFixed(2)}</h2>
        </div>
      </div>
    </div>
  );
}