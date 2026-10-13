import { state, save, money, esc, fmt, hasClue, WEEKDAYS } from './state.js';
import { on } from './bus.js';
import CASES from '../data/days/index.js';
import MESSAGES from '../data/days/messages.js';
import { setDayTheme, updateHud, setClock, renderCalendar, showOverlay, hideOverlay } from '../desk/desk.js';
import { renderWindow, setLaser } from '../desk/window.js';
import { clearNotes, addNote } from '../desk/notes.js';
import { refillCoffee } from '../desk/mug.js';
import { renderDrawer } from '../desk/drawer.js';
import { queueMessages, cancelQueue, pushMessage } from '../desk/phone.js';
import { showHome, clearApp } from '../apps/laptop.js';
import { startSpotter } from '../apps/spotter/spotterApp.js';
import { startFinale } from '../apps/finale.js';
import { showEnding } from '../ui/ending.js';

let clockId = null;
let minutes = 0;
let clockDay = 1;

// What Halcyon does to the people around you each time you Warn someone.
const RETALIATION = {
  1: () => pushMessage('dale', 'Got a call from your "employer." Offered me a lot of money to change your locks. I said no. For now.'),
  2: () => {
    state.momTaken = true;
    pushMessage('mom', 'Hi sweetie! 💜 So proud of you for working so hard. Remember to log in tomorrow!');
  },
  3: () => {
    state.bonusCancelled = true;
    pushMessage('hira', 'Heads up! 💜 Your Friday bonus has been withdrawn pending a conduct review.');
  },
};

export function initDayCycle() {
  on('scope:open', caseData => {
    // The desk clock jumps to the moment the target is in the crosshairs.
    const m = /^(\d\d):(\d\d)$/.exec(caseData.target.time || '');
    if (m) { minutes = +m[1] * 60 + +m[2]; renderClock(); }
    const script = MESSAGES[caseData.day];
    if (script.scope) {
      queueMessages(script.scope, { s: state });
      setTimeout(() => setLaser(true), 1800);
    }
  });
}

// Continue resumes at the start of the saved day, so roll the phone back to that point.
export function restoreDayStart() {
  if (!state.snapshot) return;
  state.threads = structuredClone(state.snapshot.threads);
  state.threadOrder = [...state.snapshot.threadOrder];
}

export function resume() {
  if (state.ending) showEnding(state.ending);
  else if (state.finale) startFinale(5);
  else startDay();
}

// Morning: intro card, overnight desk changes, texts, then the DeskHire home screen.
export function startDay() {
  cancelQueue();
  stopClock();
  hideOverlay();

  const day = state.day;
  const caseData = CASES[day];
  const script = MESSAGES[day];

  state.snapshot = { threads: structuredClone(state.threads), threadOrder: [...state.threadOrder] };
  refillCoffee();
  save();

  setDayTheme(day);
  renderWindow(day);
  setLaser(false);
  renderCalendar(day);
  updateHud(day);
  clearApp();
  clearNotes();
  script.notes.forEach(n => addNote(n.text, n));
  renderDrawer();

  clockDay = day;
  minutes = script.clock[0] * 60 + script.clock[1];
  renderClock();

  const ov = showOverlay(`<div class="panel">
    <div class="kicker">${WEEKDAYS[day].toUpperCase()} · DAY ${day} OF 5</div>
    <h2>${esc(script.intro.sub)}</h2>
    <p>${esc(fmt(script.intro.line))}</p>
    <div class="row"><button class="btn" data-go>Clock in</button></div>
  </div>`);
  ov.querySelector('[data-go]').onclick = () => {
    hideOverlay();
    startClock();
    queueMessages(script.morning, { s: state });
    showHome(caseData, () => beginShift(caseData, script));
  };
}

function beginShift(caseData, script) {
  queueMessages(script.shift, { s: state });
  startSpotter(caseData, result => endShift(caseData, script, result));
}

function endShift(caseData, script, result) {
  stopClock();
  state.outcomes[caseData.day] = result.outcome;

  if (caseData.final) {
    if (result.outcome === 'go') {
      if (!state.bonusCancelled) state.money += caseData.reward.base;
      state.ending = { kind: 'accept' };
      save();
      showEnding(state.ending);
    } else {
      state.finale = true;
      save();
      startFinale(caseData.day);
    }
    return;
  }

  // Only a Warn saves anyone. A No-go just hands the job to SPOTTER-2.
  const warnedNow = result.outcome === 'warn';
  state.fates[caseData.target.suspect] = warnedNow ? 'warned' : 'dead';
  if (warnedNow) state.exposure = Math.min(3, state.exposure + 1);

  // Pay and advance now, so a reload during the evening never double-pays.
  const pay = payout(caseData, result);
  state.money += pay.total;
  state.day = caseData.day + 1;
  save();
  updateHud(caseData.day);
  queueMessages(script.evening, { s: state, r: result });
  if (warnedNow) setTimeout(() => { RETALIATION[state.exposure]?.(); save(); }, 7000);
  showEvening(caseData, pay, script, result);
}

function payout(caseData, result) {
  const { base, heatPenalty, cleanBonus } = caseData.reward;
  if (result.outcome === 'go') {
    const penalty = Math.min(base, result.heat * heatPenalty);
    const bonus = result.heat === 0 ? cleanBonus : 0;
    return {
      headline: caseData.callType === 'flag' ? 'Flag filed.' : 'Target confirmed.',
      rows: [['Base fee', base], [`Heat penalty (${result.heat})`, penalty ? -penalty : 0], ['Clean call bonus', bonus]],
      total: base - penalty + bonus,
    };
  }
  if (result.outcome === 'timeout') {
    const fee = Math.round(base * 0.2);
    return { headline: 'Too slow. Reassigned to SPOTTER-2.', rows: [['Show-up fee', fee]], total: fee };
  }
  if (result.outcome === 'warn') {
    return { headline: 'Connection lost.', rows: [['Session interrupted', 0]], total: 0 };
  }
  return { headline: 'Reassigned to SPOTTER-2.', rows: [['Docked for hesitation', 0]], total: 0 };
}

// Evening: the payment screen on the laptop, so the phone stays usable.
function showEvening(caseData, pay, script, result) {
  const area = document.getElementById('app-area');
  const pct = Math.min(100, Math.round((state.money / state.rent) * 100));
  const short = state.rent - state.money;
  const rows = pay.rows.map(([label, n]) =>
    `<tr><td>${esc(label)}</td><td>${n < 0 ? '−' + money(-n) : money(n)}</td></tr>`).join('');
  const note = caseData.eveningNote ? caseData.eveningNote(result, state) : '';
  const { found, total } = noticed(caseData);
  area.innerHTML = `<div class="home">
    <div class="kicker">DESKHIRE · PAYMENT · ${WEEKDAYS[caseData.day].toUpperCase()}</div>
    <h2 style="margin:10px 0 4px">${esc(pay.headline)}</h2>
    <table class="pay-table">${rows}<tr class="total"><td>Paid tonight</td><td>${money(pay.total)}</td></tr></table>
    <div class="rent-meta"><span>Wallet ${money(state.money)}</span><span>Rent ${money(state.rent)} · Friday noon</span></div>
    <div class="rent-bar"><span style="width:${pct}%"></span></div>
    <p class="home-foot">${short > 0 ? `You're ${money(short)} short. Friday is coming.` : 'Rent is covered.'}</p>
    ${note ? `<p class="evening-note">${esc(fmt(note))}</p>` : ''}
    <p class="home-foot">✎ Written in your notebook today: ${found} of ${total}${found < total ? '. Some files had more in them.' : '.'}</p>
    <button class="btn" data-sleep style="margin-top:18px">Log off for the night</button>
  </div>`;
  area.querySelector('[data-sleep]').onclick = () => showNight(script, caseData);
}

// 3:33 AM: K. always writes at the same time. Unless K. is gone, and something else does.
function noticed(caseData) {
  const ids = Object.keys(caseData.anomalies);
  return { found: ids.filter(hasClue).length, total: ids.length };
}

function showNight(script, caseData) {
  cancelQueue();
  clearApp();
  const msg = script.night({ s: state });
  // K. (while alive) nudges players who aren't writing anything down.
  const nudge = noticed(caseData).found === 0 && state.fates.k !== 'dead'
    ? "you're not writing anything down. they're counting on that."
    : null;
  const ov = showOverlay(`<div class="panel night">
    <div class="big">3:33 AM</div>
    <p>Your phone lights up the dark room.</p>
    <div class="k-msg">Unknown: ${esc(fmt(msg.text))}${nudge ? `<br>Unknown: ${esc(nudge)}` : ''}</div>
    <button class="btn btn-ghost" data-wake>Go back to sleep</button>
  </div>`);
  pushMessage(msg.from, msg.text);
  if (nudge) pushMessage('k', nudge);
  ov.querySelector('[data-wake]').onclick = startDay;
}

function startClock() {
  stopClock();
  clockId = setInterval(() => { minutes++; renderClock(); }, 2000);
}

function stopClock() {
  clearInterval(clockId);
  clockId = null;
}

function renderClock() {
  const h = String(Math.floor(minutes / 60) % 24).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  setClock(`${WEEKDAYS[clockDay]} ${h}:${m}`);
}
