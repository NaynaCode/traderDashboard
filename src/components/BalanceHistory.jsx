import React, { useRef, useEffect, useState, useMemo } from 'react'
import Chart from 'chart.js/auto'
import '../styles/BalanceHistory.css'

export default function BalanceHistory({ balance, balanceHistory = [] }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [period, setPeriod] = useState('day')

  useEffect(() => {
    if (!chartRef.current) return
    const ctx = chartRef.current.getContext('2d')

    const now = Date.now()
    const days = { day: 1, week: 7, month: 30 }[period]
    const cutoff = now - days * 24 * 3600e3

    const filtered = balanceHistory
      .map(h => ({ ts: new Date(h.timestamp).getTime(), bal: h.balance }))
      .filter(p => p.ts >= cutoff)
      .sort((a, b) => a.ts - b.ts)

    const intervals = { day: 3600e3, week: 6 * 3600e3, month: 24 * 3600e3 }[period]
    const seen = new Set()
    const reduced = filtered.filter(p => {
      const slot = Math.floor(p.ts / intervals)
      if (seen.has(slot)) return false
      seen.add(slot)
      return true
    })

    const labels = reduced.map(
      p =>
        new Date(p.ts).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
    )
    const data = reduced.map(p => p.bal)
    const initial = reduced[0]?.bal ?? balance
    const avg =
      reduced.reduce((sum, p) => sum + p.bal, 0) / (reduced.length || 1)

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(102, 210, 104, 0.4)');
    gradient.addColorStop(1, 'rgba(102, 210, 104, 0)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 200);
    gradient2.addColorStop(0, 'rgba(255, 0, 0 ,0)');
    gradient2.addColorStop(1, 'rgba(255, 0, 0 ,0.2)');
    // cleanup old
    if (chartInstance.current) chartInstance.current.destroy()

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Balance History (${period})`,
            data,
            fill: {
              above: gradient,
              below: gradient2,
              target: { value: initial },
            },
            borderColor: '#28a745',
            borderWidth: 2,
            segment: {
              borderColor: ctxSeg => {
                const y0 = ctxSeg.p0.parsed.y
                const y1 = ctxSeg.p1.parsed.y
                return y0 < initial && y1 < initial ? '#ec6a6a' : '#28a745'
              },
            },
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBorderColor: data.map(v =>
              v >= initial ? '#28a745' : '#ec6a6a'
            ),
            pointBackgroundColor: '#fff',
            pointHoverBackgroundColor: data.map(v =>
              v >= initial ? '#28a745' : '#ec6a6a'
            )
          },
          {
            label: `${period.toUpperCase()} Avg`,
            data: Array(data.length).fill(avg),
            type: 'line',
            borderDash: [5, 5],
            borderColor: '#efc667',
            pointRadius: 0,
            fill: false,
          },
          {
            label: 'Initial',
            data: Array(data.length).fill(initial),
            type: 'line',
            borderDash: [5, 5],
            borderColor: '#6c757d',
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false, grid: { display: false } },
          y: {
            grid: { color: '#eee', drawBorder: false },
            ticks: { callback: v => `$${v.toFixed(0)}` },
          },
        },
        plugins: {
          legend: { position: 'top', 
                    labels: {  
                    boxWidth: 12,
                    padding: 16,
                    font: { size: 13 }
                    } 
                },
          tooltip: { mode: 'nearest', intersect: false },
        },
      },
    })
  }, [balance, balanceHistory, period])

  return (
    <>
      <div className="btn-group period-group" role="group">
        {['day', 'week', 'month'].map(p => (
          <button
            key={p}
            className={`btn btn-light${period === p ? ' active' : ''}`}
            onClick={() => setPeriod(p)}>
            {p === 'day' ? '1D' : p === 'week' ? '7D' : '30D'}
          </button>
        ))}
      </div>
      <div className="chart-container">
        <canvas ref={chartRef} />
      </div>
    </>
  )
}
