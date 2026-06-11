const DB_NAME = 'SurveyDB';
const DB_VERSION = 1;
const STORE_NAME = 'responses';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('participant_id', 'participant_id', { unique: false });
        store.createIndex('questionnaire', 'questionnaire', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveRows(rows) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  for (const row of rows) {
    store.add(row);
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function getAllRows() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCompletedParticipants() {
  const rows = await getAllRows();
  const byPid = {};
  for (const r of rows) {
    if (r.completed !== 'TRUE') continue;
    if (!byPid[r.participant_id]) byPid[r.participant_id] = new Set();
    byPid[r.participant_id].add(r.questionnaire);
  }
  return byPid;
}

async function getEligibleSatisfactionIds() {
  const byPid = await getCompletedParticipants();
  const eligible = [];
  for (const [pid, quests] of Object.entries(byPid)) {
    if (quests.has('risk') && quests.has('time') && quests.has('decision_style') && !quests.has('satisfaction')) {
      eligible.push(pid);
    }
  }
  return eligible.sort();
}

function rowToCSV(row) {
  return RESULT_COLUMNS.map(col => {
    const val = row[col] == null ? '' : String(row[col]);
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return '"' + val.replace(/"/g, '""') + '"';
    }
    return val;
  }).join(',');
}

async function exportCSV() {
  const rows = await getAllRows();
  const header = RESULT_COLUMNS.join(',');
  const lines = [header, ...rows.map(rowToCSV)];
  return lines.join('\n');
}

async function clearAllData() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
