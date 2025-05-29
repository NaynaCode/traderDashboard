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

    const safePairs = Array.isArray(pairs) ? pairs : [];
    
    const symbols     = safePairs.map(p => p.symbol);
    const tokenValues = safePairs.map(p =>
      parseFloat(p.value?.replace('$','')) || 0
    );
    const tokensTotal = tokenValues.reduce((sum, v) => sum + v, 0);
    
    symbols.push('USDT');
    tokenValues.push(usdt);

    // colors
    const backgroundColor = tokenValues.map((_, i) =>
      i === tokenValues.length - 1
        ? '#d3d3d3'
        : pairColors[i % pairColors.length]
    );
    const hoverBackgroundColor = tokenValues.map((_, i) =>
      i === tokenValues.length - 1
        ? '#3f3f3f'
        : pairHoverColors[i % pairHoverColors.length]
    );

    return {
      labels: symbols,
      pieData: {
        labels:      symbols,          
        datasets: [{
          data:                 tokenValues,
          backgroundColor,
          hoverBackgroundColor,
          hoverOffset:         8,
          borderWidth:         1,
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
        <Pie
          data={pieData}
          options={{
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value    = context.parsed;           // raw slice value
                    const total    = context.chart._metasets[0].total;
                    const percent  = (value / total) * 100;
                    const label    = context.label;             // symbol name
                    return `${label}: ${percent.toFixed(2)}%`;
                  }
                }
              },
              legend: { display: false }
            }
          }}
        />
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