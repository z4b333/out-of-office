import { state, esc, WEEKDAYS } from '../core/state.js';
import { showOverlay, hideOverlay } from './desk.js';
import { on } from '../core/bus.js';

const SLOTS = [
  { x: 10, y: 0, r: -4 },
  { x: 160, y: 10, r: 5 },
  { x: 30, y: 125, r: 3 },
  { x: 165, y: 120, r: -6 },
];

let count = 0;

export function initNotes() {
  document.getElementById('notebook').addEventListener('click', openNotebook);
  on('clue:new', () => {
    updateCount();
    const nb = document.getElementById('notebook');
    nb.classList.remove('pulse');
    void nb.offsetWidth;
    nb.classList.add('pulse');
  });
  updateCount();
}

export function updateCount() {
  document.getElementById('notebook-count').textContent = state.clues.length;
}

export function clearNotes() {
  document.getElementById('notes').innerHTML = '';
  count = 0;
}

export function addNote(text, { strange = false } = {}) {
  const slot = SLOTS[count % SLOTS.length];
  count++;
  const el = document.createElement('div');
  el.className = 'sticky' + (strange ? ' strange' : '');
  el.style.left = slot.x + 'px';
  el.style.top = slot.y + 'px';
  el.style.setProperty('--r', slot.r + 'deg');
  el.style.setProperty('--sway', (5 + Math.random() * 3).toFixed(1) + 's');
  el.textContent = text;
  document.getElementById('notes').appendChild(el);
}

function openNotebook() {
  const items = state.clues.length
    ? state.clues.map(c => `<div class="clue"><b>${esc(c.title)}</b>${esc(c.text)}<br><small>${WEEKDAYS[c.day]} · Day ${c.day}</small></div>`).join('')
    : '<p>Nothing written down yet. Click anything in the files that feels <i>off</i>.</p>';
  const ov = showOverlay(`<div class="panel">
    <div class="kicker">NOTEBOOK</div>
    <h2>Things that don't add up</h2><p>${state.clues.length} of 13 written down.</p>
    <div class="clue-list">${items}</div>
    <div class="row"><button class="btn btn-ghost" data-close>Close</button></div>
  </div>`);
  ov.querySelector('[data-close]').onclick = hideOverlay;
}
