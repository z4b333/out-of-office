import { state, load, resetState, save, cleanName, esc } from './core/state.js';
import { initDayCycle, startDay, restoreDayStart, resume } from './core/dayCycle.js';
import { initDesk, showOverlay, setDayTheme, renderCalendar, updateHud } from './desk/desk.js';
import { initPhone, renderPhone, seedHistory } from './desk/phone.js';
import { initDrawer, renderDrawer } from './desk/drawer.js';
import { showPrologue } from './ui/prologue.js';
import { PHONE_HISTORY } from './data/days/lore.js';
import { initNotes, updateCount } from './desk/notes.js';
import { initMug } from './desk/mug.js';
import { renderWindow } from './desk/window.js';
import { jumpTo } from './core/jump.js';

initDesk();
initPhone();
initNotes();
initMug();
initDrawer();
initDayCycle();

const hasSave = load();
setDayTheme(state.day);
renderWindow(state.day);
renderCalendar(state.day);
updateHud();
showTitle();

function showTitle() {
  const cont = hasSave
    ? `<div class="row"><button class="btn btn-ghost" data-continue>Continue as ${esc(state.username)} · ${state.ending ? 'ending' : state.finale ? 'Friday night' : 'Day ' + state.day + ' of 5'}</button></div>`
    : '';
  const ov = showOverlay(`<div class="panel">
    <div class="kicker">A WORK-FROM-HOME THRILLER</div>
    <h1>Out of Office</h1>
    <p>Five nights as a remote <b>Spotter</b>. Collect the evidence. Clear the innocent. Call it in. Make rent by Friday.</p>
    <p style="font-size:13px">Write down anything that doesn't add up. You'll need it.</p>
    <div class="row">
      <input id="username" maxlength="16" placeholder="Your DeskHire username" autocomplete="off">
      <button class="btn" data-new>New game</button>
    </div>
    ${cont}
    <details class="jump">
      <summary>Testing: jump to a day</summary>
      <p>Earlier days count as played, and their clues are already in your notebook. Each board gets an ⚡ Auto-solve button.</p>
      <div class="row">
        <select id="jump-preset">
          <option value="go">Earlier targets: confirmed (Go)</option>
          <option value="warn">Earlier targets: warned (allies alive)</option>
        </select>
      </div>
      <div class="row jump-days">
        ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => `<button class="btn btn-ghost" data-jump="${i + 1}">${d}</button>`).join('')}
        <button class="btn btn-ghost" data-jump="finale">Fri: notebook</button>
      </div>
    </details>
    <p style="font-size:12px;margin-top:22px">Best in a desktop browser. All sessions are recorded for quality and training purposes.</p>
  </div>`);

  const input = ov.querySelector('#username');
  input.focus();

  const begin = () => {
    resetState(cleanName(input.value));
    seedHistory(PHONE_HISTORY);
    save();
    renderPhone();
    updateCount();
    renderDrawer();
    showPrologue(startDay);
  };
  ov.querySelector('[data-new]').onclick = begin;

  ov.querySelectorAll('[data-jump]').forEach(btn => btn.addEventListener('click', () => {
    const preset = ov.querySelector('#jump-preset').value;
    const finale = btn.dataset.jump === 'finale';
    jumpTo(cleanName(input.value), finale ? 5 : +btn.dataset.jump, preset, { finale });
    seedHistory(PHONE_HISTORY);
    renderPhone();
    updateCount();
    resume();
  }));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') begin(); });

  ov.querySelector('[data-continue]')?.addEventListener('click', () => {
    restoreDayStart();
    renderPhone();
    updateCount();
    resume();
  });
}
