const LOGS_ENDPOINT = 'https://referralsgrow.com/trader/logs.php';
const PAIRS_ENDPOINT = 'https://referralsgrow.com/trader/pairs.php';
const BALANCE_ENDPOINT = 'https://referralsgrow.com/trader/balance.php';
const TARGET_ENDPOINT = 'https://referralsgrow.com/trader/target.php';
const BACKUP_URL = 'https://referralsgrow.com/trader/backup.php';
const STATUS_URL = 'https://referralsgrow.com/trader/status.php';

export async function fetchLogs() {
  const res = await fetch(LOGS_ENDPOINT);
  const data = await res.json();
  return data;
}

export async function fetchPairs() {
  const res = await fetch(PAIRS_ENDPOINT);
  const data = await res.json();
  return data.pairs || [];
}

export async function fetchBalance() {
  const [currentRes, historyRes] = await Promise.all([
    fetch(BALANCE_ENDPOINT),
    fetch(`${BALANCE_ENDPOINT}?history=1`)
  ]);

  const currentData = await currentRes.json();
  const historyData = await historyRes.json();

  return {
    current: currentData.balance || 0,
    history: historyData.history || []
  };
}

export async function fetchTarget() {
  try {
    const res = await fetch(TARGET_ENDPOINT);
    const data = await res.json();
    return data.target || 1.5;
  } catch (err) {
    console.error('Error fetching target:', err);
    return 1.5; 
  }
}

export async function fetchBackup(logs = []) {
  try {

    const res = await fetch(BACKUP_URL);
    const currentData = await res.json();
    const backup = currentData.success ? parseFloat(currentData.backup) : 0;

    const sorted = Array.isArray(logs)
      ? [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      : [];
    const usdt = sorted.length
      ? parseFloat(sorted[0].usdt_balance)
      : 0;

    return { backup, usdt };
  } catch (err) {
    console.error('Error fetching backup:', err);
    return { backup: 0, usdt: 0 };
  }
}

export async function fetchStatus() {

  try {
    const res = await fetch(STATUS_URL);
    const data = await res.json();
    
    if (!data.timestamp) {
      return {
        status: 'stopped',
        timestamp: null
      };
    }

    const ts = new Date(data.timestamp);
    const ageInSeconds = (Date.now() - ts.getTime()) / 1000;

    return {
      status: ageInSeconds <= 1800 ? 'running' : 'stopped',
      timestamp: ts.toLocaleString()
    };
  } catch {
    return {
      status: 'stopped',
      timestamp: null
    };
  }
}
