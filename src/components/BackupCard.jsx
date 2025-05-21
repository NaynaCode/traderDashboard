import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/BackupCard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const pairColors = [
  '#FFC0CA', '#B3DFFF', '#FFF0B3', '#A3E8E8', '#D9CCFF',
  '#FFD9B3', '#C7E8A3', '#FFB7CB', '#99E6FF', '#FFF2B3'
];

const pairHoverColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#8AC249', '#EA5F89',
  '#00BFFF', '#FFD700'
];

export default function BackupCard({
  logs  = [],
  pairs = [],       // ensure it's never undefined
  backup = 0,
  usdt   = 0
}) {
  const { pieData, tokensTotal } = useMemo(() => {
    // coerce to array
    const safePairs = Array.isArray(pairs) ? pairs : [];
    
    // extract token values
    const tokenValues = safePairs.map(p =>
      parseFloat(p.value?.replace('$','')) || 0
    );
    const tokensTotal = tokenValues.reduce((sum, v) => sum + v, 0);
    
    // final slice is USDT
    const data = [...tokenValues, usdt];

    // colors
    const backgroundColor = data.map((_, i) =>
      i === data.length - 1
        ? '#d3d3d3'
        : pairColors[i % pairColors.length]
    );
    const hoverBackgroundColor = data.map((_, i) =>
      i === data.length - 1
        ? '#3f3f3f'
        : pairHoverColors[i % pairHoverColors.length]
    );

    // **always** return an object
    return {
      pieData: {
        datasets: [{
          data,
          backgroundColor,
          hoverBackgroundColor,
          hoverOffset: 8
        }]
      },
      tokensTotal
    };
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