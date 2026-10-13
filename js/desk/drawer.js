import { state, save, esc, fmt } from '../core/state.js';
import { showOverlay, hideOverlay } from './desk.js';
import { DRAWER } from '../data/days/lore.js';

// The desk drawer holds the last tenant's things. One more turns up each day.
export function initDrawer() {
  document.getElementById('drawer').addEventListener('click', openDrawer);
}

const available = () => DRAWER.filter(item => item.day <= state.day);

export function renderDrawer() {
  const unseen = available().some(item => !state.drawerSeen.includes(item.id));
  document.getElementById('drawer-new').classList.toggle('hidden', !unseen);
}

function openDrawer() {
  const items = available();
  const html = items.map(item => {
    const isNew = !state.drawerSeen.includes(item.id);
    return `<div class="drawer-item">
      <b>${esc(item.title)}${isNew ? ' <span class="drawer-tag">new</span>' : ''}</b>
      <div>${esc(fmt(item.text)).replace(/\n/g, '<br>')}</div>
    </div>`;
  }).join('');
  items.forEach(item => { if (!state.drawerSeen.includes(item.id)) state.drawerSeen.push(item.id); });
  save();
  renderDrawer();

  const ov = showOverlay(`<div class="panel drawer-panel">
    <div class="kicker">THE DESK DRAWER</div>
    <h2>The last tenant's things</h2>
    <p>Dale said to toss whatever you want. You never did.</p>
    <div class="clue-list">${html}</div>
    <div class="row"><button class="btn btn-ghost" data-close>Close the drawer</button></div>
  </div>`);
  ov.querySelector('[data-close]').onclick = hideOverlay;
}
