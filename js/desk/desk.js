import { state, money, WEEKDAYS } from '../core/state.js';

const STAGE_W = 1600;
const STAGE_H = 900;
let scale = 1;

const stage = () => document.getElementById('stage');

export function initDesk() {
  fit();
  addEventListener('resize', fit);
  scatterDust();
}

// Dust motes drifting through the lamp light. Motion lives in desk.css; each mote gets its own path.
function scatterDust(n = 26) {
  const rnd = (a, b) => a + Math.random() * (b - a);
  document.getElementById('dust').innerHTML = Array.from({ length: n }, () => {
    const size = rnd(1.5, 3.5).toFixed(1);
    return `<i style="left:${rnd(0, 100).toFixed(1)}%;top:${rnd(5, 90).toFixed(1)}%;width:${size}px;height:${size}px;`
      + `--dx:${rnd(-60, 60).toFixed(0)}px;--dy:${rnd(-90, -20).toFixed(0)}px;--o:${rnd(0.15, 0.45).toFixed(2)};`
      + `animation-duration:${rnd(18, 40).toFixed(1)}s;animation-delay:-${rnd(0, 40).toFixed(1)}s"></i>`;
  }).join('');
}

function fit() {
  scale = Math.min(innerWidth / STAGE_W, innerHeight / STAGE_H);
  stage().style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// Converts a pointer event to coordinates local to `el`, in unscaled stage pixels.
export function localPoint(e, el) {
  const r = el.getBoundingClientRect();
  return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
}

export function setDayTheme(day) {
  stage().dataset.day = String(day);
  stage().classList.remove('blackout');
}

export function updateHud(day = state.day) {
  document.getElementById('hud-day').textContent = `${WEEKDAYS[day]} · Day ${day} of 5`;
  document.getElementById('hud-money').innerHTML =
    `Wallet <b>${money(state.money)}</b> · Rent ${money(state.rent)} due Fri noon`;
}

export function setClock(text) {
  document.getElementById('hud-clock').textContent = text;
  document.getElementById('phone-time').textContent = text.split(' ').pop();
}

const DAYS = [
  { label: 'Mon', note: 'new gig' },
  { label: 'Tue', note: '' },
  { label: 'Wed', note: '' },
  { label: 'Thu', note: '' },
  { label: 'Fri', note: 'RENT! noon' },
];

export function renderCalendar(day) {
  const items = DAYS.map((d, i) => {
    const n = i + 1;
    const cls = n === day ? 'today' : n < day ? 'past' : '';
    return `<li class="${cls}"><span>${d.label}</span><span class="hand">${d.note}</span></li>`;
  }).join('');
  document.getElementById('calendar').innerHTML = `<h5>THIS WEEK</h5><ul>${items}</ul>`;
}

export function showOverlay(html) {
  const ov = document.getElementById('overlay');
  ov.innerHTML = html;
  ov.classList.remove('hidden');
  return ov;
}

export function hideOverlay() {
  const ov = document.getElementById('overlay');
  ov.classList.add('hidden');
  ov.innerHTML = '';
}

export function toast(text, ms = 2600) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), ms);
}

export function blackout() {
  stage().classList.add('blackout');
}
