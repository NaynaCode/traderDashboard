const LOGS_ENDPOINT = 'https://referralsgrow.com/trader/logs.php';
const PAIRS_ENDPOINT = 'https://referralsgrow.com/trader/pairs.php';
const BALANCE_ENDPOINT = 'https://referralsgrow.com/trader/balance.php';
const TARGET_ENDPOINT = 'https://referralsgrow.com/trader/target.php';
const BACKUP_URL = 'https://referralsgrow.com/trader/backup.php';
const STATUS_URL = 'https://referralsgrow.com/trader/status.php';

export async function fetchLogs(userId) {
  const res = await fetch(`${LOGS_ENDPOINT}?user_id=${userId}`);
  const data = await res.json();
  return data;
}

export async function fetchPairs(userId) {
  const res = await fetch(`${PAIRS_ENDPOINT}?user_id=${userId}`);
  const data = await res.json();
  return data.pairs || [];
}

export async function fetchBalance(userId) {
  const [currentRes, historyRes] = await Promise.all([
    fetch(`${BALANCE_ENDPOINT}?user_id=${userId}`),
    fetch(`${BALANCE_ENDPOINT}?user_id=${userId}&history=1`)
  ]);

  const currentData = await currentRes.json();
  const historyData = await historyRes.json();

  return {
    current: currentData.balance || 0,
    history: historyData.history || []
  };
}

export async function fetchTarget(userId) {
  try {
    const res = await fetch(`${TARGET_ENDPOINT}?user_id=${userId}`);
    const data = await res.json();
    return data.target || 1.5;
  } catch (err) {
    console.error('Error fetching target:', err);
    return 1.5;
  }
}

export async function fetchBackup(userId, logs = []) {
  try {
    const res = await fetch(`${BACKUP_URL}?user_id=${userId}`);
    const currentData = await res.json();
    const backup = currentData.success ? parseFloat(currentData.backup) : 0;

    const sorted = Array.isArray(logs)
      ? [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      : [];
    const usdt = sorted.length ? parseFloat(sorted[0].usdt_balance) : 0;

    return { backup, usdt };
  } catch (err) {
    console.error('Error fetching backup:', err);
    return { backup: 0, usdt: 0 };
  }
}

export async function fetchStatus(userId) {
  try {
    const res = await fetch(`${STATUS_URL}?user_id=${userId}`);
    const data = await res.json();

    // if no timestamp, treat as stopped
    if (!data.timestamp) {
      return { status: 'stopped', timestamp: null };
    }

    // leave timestamp as the raw ISO string
    const ts = new Date(data.timestamp);
    const ageInSeconds = (Date.now() - ts.getTime()) / 1000;

    return {
      status: ageInSeconds <= 2400 ? 'running' : 'stopped', // 40 min = 2400 s
      timestamp: data.timestamp
    };
  } catch (err) {
    console.error('fetchStatus error:', err);
    return { status: 'stopped', timestamp: null };
  }
}