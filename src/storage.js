const STORAGE_KEY = 'ifs-data';

const DEFAULT_DATA = {
  parts: {
    depression:  { lastVisit: null, sessionIds: [] },
    anger:       { lastVisit: null, sessionIds: [] },
    selfDoubt:   { lastVisit: null, sessionIds: [] },
    ocd:         { lastVisit: null, sessionIds: [] },
    grief:       { lastVisit: null, sessionIds: [] },
    heart:       { lastVisit: null, sessionIds: [] },
  },
  sessions: [],
  explore: {
    e1: { touched: false, count: 0 },
    e2: { touched: false, count: 0 },
    e3: { touched: false, count: 0 },
    e4: { touched: false, count: 0 },
  },
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (e) {
    console.warn('IFS: localStorage parse failed, using defaults.', e);
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('IFS: localStorage write failed.', e);
  }
}
