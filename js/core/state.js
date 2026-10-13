// Single mutable game state, persisted to localStorage when available.
const KEY = 'outOfOffice.save.v2';

function fresh() {
  return {
    username: '',
    day: 1,
    money: 50,
    rent: 1200,
    coffee: 3,
    clues: [],        // anomalies the player noticed: {id, title, text, day}
    outcomes: {},     // day number → 'go' | 'nogo' | 'warn' | 'timeout'
    fates: {},        // target id → 'dead' | 'warned'
    exposure: 0,      // rises with every Warn; Halcyon retaliates
    momTaken: false,  // exposure 2: Theo answers Mom's phone
    bonusCancelled: false,
    threads: {},      // phone: {contactId: [{text, read, me}]}
    threadOrder: [],
    snapshot: null,   // phone state at the start of the current day (for Continue)
    finale: false,    // reached the Friday notebook board
    ending: null,     // {kind, ally}
    testMode: false,  // started via "jump to a day": shows the auto-solve button
    readMail: [],     // DeskHire inbox ids opened
    drawerSeen: [],   // drawer item ids looked at
  };
}

export const state = fresh();

export function resetState(username) {
  Object.assign(state, fresh(), { username });
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    Object.assign(state, fresh(), JSON.parse(raw));
    return !!state.username;
  } catch {
    return false;
  }
}

export function clearSave() {
  try { localStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}

export function cleanName(raw) {
  return String(raw).replace(/[^\w .\-]/g, '').trim().slice(0, 16) || 'guest';
}

export function fmt(str) {
  return String(str).replaceAll('{USER}', state.username || 'you');
}

export function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function money(n) {
  return '$' + n.toLocaleString('en-US');
}

export function addClue(clue) {
  if (state.clues.some(c => c.id === clue.id)) return false;
  state.clues.push(clue);
  save();
  return true;
}

export function hasClue(id) {
  return state.clues.some(c => c.id === id);
}

// People the player warned are still alive and reachable.
export function allies() {
  return Object.entries(state.fates).filter(([, f]) => f === 'warned').map(([id]) => id);
}

export function everWentGo() {
  return Object.values(state.outcomes).includes('go');
}

export const WEEKDAYS = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
