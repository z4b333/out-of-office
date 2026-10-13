import { state, resetState, save, fmt } from './state.js';
import CASES from '../data/days/index.js';

// Testing shortcut: start at any day as if the earlier days were already played.
// preset 'go'   → every earlier target confirmed (no allies, full pay)
// preset 'warn' → every earlier target warned (allies alive, Exposure consequences applied)
// Every earlier day's clues are already in the notebook.
export function jumpTo(username, day, preset, { finale = false } = {}) {
  resetState(username);
  state.testMode = true;
  state.day = day;

  for (let d = 1; d < day; d++) {
    const c = CASES[d];
    const canWarn = !!c.warnAnomaly;
    const outcome = preset === 'warn' ? (canWarn ? 'warn' : 'nogo') : 'go';
    state.outcomes[d] = outcome;
    state.fates[c.target.suspect] = outcome === 'warn' ? 'warned' : 'dead';
    if (outcome === 'warn') state.exposure++;
    if (outcome === 'go') state.money += c.reward.base + c.reward.cleanBonus;
    Object.entries(c.anomalies).forEach(([id, a]) =>
      state.clues.push({ id, title: fmt(a.title), text: fmt(a.text), day: d }));
  }
  state.momTaken = state.exposure >= 2;
  state.bonusCancelled = state.exposure >= 3;

  if (finale) {
    Object.entries(CASES[5].anomalies).forEach(([id, a]) =>
      state.clues.push({ id, title: fmt(a.title), text: fmt(a.text), day: 5 }));
    state.outcomes[5] = 'nogo';
    state.finale = true;
  }
  save();
}
