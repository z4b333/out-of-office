import { state, save, fmt, esc, allies, WEEKDAYS } from '../core/state.js';
import { showOverlay, blackout, toast } from '../desk/desk.js';
import { setLaser } from '../desk/window.js';
import { cancelQueue } from '../desk/phone.js';
import { clearApp } from './laptop.js';
import { createBoard } from './spotter/board.js';
import { renderMarkup } from '../ui/markup.js';
import { showEnding } from '../ui/ending.js';

const SECONDS = 150;
const NEEDED = 5;

// The seven things you can prove. Linking any two cards from the same set proves it.
const TRUTHS = [
  { ids: ['a_prescott', 'a_room', 'a_rain', 'a_dead'], text: 'Prescott has been dead for two years. Every meeting, every rainy window: a recording. Hira is the client.' },
  { ids: ['a_van', 'a_ledger'], text: 'The van came for Kai first. DeskHire watches its own workers, not the targets.' },
  { ids: ['a_mug', 'a_333'], text: 'K. is Kai Lindqvist. He sat at this desk, drank from this mug, and logged off at 3:33.' },
  { ids: ['a_theo', 'a_mom'], text: 'Theo is me: a copy built from my calls. It has been talking to Mom.' },
  { ids: ['a_okafor', 'calllog'], text: 'Monday\'s "HR flag" was a killing. Every OVERWATCH call is real.' },
  { ids: ['a_source', 'a_mug'], text: 'A.L. is Ana Lindqvist: Kai\'s sister, and Reyes\'s source.' },
  { ids: ['calllog', 'a_chip'], text: 'Every call I made trained the thing that was aiming at me.' },
];

const TARGETS = { 1: 'Paul Okafor', 2: 'Jonah Reyes', 3: 'Ana Lindqvist', 4: 'K. Lindqvist', 5: '{USER}' };
const ALLY_NAMES = { reyes: 'Jonah Reyes', ana: 'Ana Lindqvist', k: 'Kai Lindqvist' };

function callLog() {
  const label = (day, o) => ({
    go: day === 1 ? 'FLAGGED' : 'CONFIRMED',
    warn: 'connection lost (you warned them)',
    nogo: 'no-go → SPOTTER-2 confirmed',
    timeout: 'timeout → SPOTTER-2 confirmed',
  }[o] || '—');
  return 'OVERWATCH · CALL LOG · {USER}\n\n' + [1, 2, 3, 4, 5]
    .map(d => `${WEEKDAYS[d]} · ${TARGETS[d]} · ${label(d, state.outcomes[d])}`).join('\n');
}

// Friday after a No-go: the laptop is dead. All you have is what you wrote down.
export function startFinale() {
  cancelQueue();
  clearApp();
  blackout();
  setLaser(true);

  const ov = showOverlay(`<div class="panel">
    <div class="kicker">FRIDAY · 20:41</div>
    <h2>The laptop dies.</h2>
    <p>The last line on the screen: <span style="font-family:var(--font-mono)">OVERWATCH: Reassigning to SPOTTER-2.</span></p>
    <p>The red dot is still on your window. You have a couple of minutes, maybe less.</p>
    <p>All you have is your notebook. Tear the pages out, pin them to the wall, and prove what DeskHire is. Prove at least ${NEEDED} things, and you'll have something worth sending, if anyone is still alive to send it to.</p>
    <div class="row"><button class="btn" data-go>Pin the notebook to the wall</button></div>
  </div>`);
  ov.querySelector('[data-go]').onclick = openBoard;
}

function openBoard() {
  const cards = [
    { id: 'calllog', type: 'log', title: 'Your OVERWATCH call log', content: callLog() },
    ...state.clues.map(c => ({ id: c.id, type: 'note', title: c.title, content: c.text })),
  ];
  const ally = allies();

  const ov = showOverlay(`<div class="finale">
    <header class="ow-head">
      <span class="ow-logo">THE NOTEBOOK</span>
      <span class="ow-case">Link two pages that prove the same thing.</span>
      <span class="ow-spacer"></span>
      <span class="ow-timer"></span>
    </header>
    <div class="finale-body">
      <div class="ow-board finale-board"></div>
      <aside class="ow-side">
        <section><h4>PROVEN <span class="finale-count"></span></h4></section>
        <section class="ow-logwrap"><div class="ow-log"></div></section>
        <section class="finale-send">
          <h4>SEND IT TO</h4>
          ${ally.length
            ? ally.map(id => `<button class="btn btn-teal" data-ally="${id}" disabled>${ALLY_NAMES[id]}</button>`).join('')
            : '<p class="finale-empty">There is no one left to send it to.</p>'}
        </section>
        <button class="btn btn-ghost" data-run>Run (log off)</button>
      </aside>
    </div>
    <div class="ow-modal hidden"></div>
  </div>`);

  const $ = s => ov.querySelector(s);
  const modal = $('.ow-modal');
  const found = new Set();
  let timeLeft = SECONDS;
  let done = false;

  const board = createBoard($('.finale-board'), cards, {
    linkTypes: [{ type: 'truth', label: 'Connect' }],
    layout: { cols: 5, dx: 190, dy: 165, x0: 22, y0: 30 },
    onOpen: c => {
      modal.innerHTML = `<div class="doc ${c.type === 'note' ? 'doc-t-notebook' : ''}">
        <div class="doc-type">${c.type === 'note' ? 'NOTEBOOK PAGE' : 'CALL LOG'}</div>
        <h3>${esc(fmt(c.title))}</h3>
        <div class="doc-text">${renderMarkup(c.content)}</div>
        <div class="doc-actions"><button class="btn" data-close>Back to the wall</button></div>
      </div>`;
      modal.classList.remove('hidden');
      modal.querySelector('[data-close]').onclick = () => modal.classList.add('hidden');
    },
    onLink: (a, b) => {
      const matches = TRUTHS.filter(t => t.ids.includes(a) && t.ids.includes(b));
      const fresh = matches.find(t => !found.has(t));
      if (fresh) {
        found.add(fresh);
        log(fresh.text);
        render();
        return 'correct';
      }
      if (matches.length) { toast('You already proved that.'); return 'duplicate'; }
      timeLeft = Math.max(1, timeLeft - 5);
      toast('Those don\'t prove anything together. −5 seconds');
      return 'wrong';
    },
  });

  function log(text) {
    const p = document.createElement('p');
    p.className = 'ok';
    p.textContent = fmt(text);
    $('.ow-log').appendChild(p);
    $('.ow-log').scrollTop = $('.ow-log').scrollHeight;
  }

  function render() {
    $('.finale-count').textContent = `${found.size} / ${TRUTHS.length} · need ${NEEDED}`;
    ov.querySelectorAll('[data-ally]').forEach(b => { b.disabled = found.size < NEEDED; });
    const m = Math.floor(timeLeft / 60), s = String(timeLeft % 60).padStart(2, '0');
    $('.ow-timer').textContent = `⏱ ${m}:${s}`;
    $('.ow-timer').classList.toggle('low', timeLeft <= 30);
  }

  const timer = setInterval(() => {
    timeLeft--;
    render();
    if (timeLeft <= 0) end({ kind: 'logoff' });
  }, 1000);

  function end(ending) {
    if (done) return;
    done = true;
    clearInterval(timer);
    board.destroy();
    state.ending = { ...ending, proven: found.size };
    save();
    showEnding(state.ending);
  }

  ov.querySelectorAll('[data-ally]').forEach(b => {
    b.onclick = () => end({ kind: 'expose', ally: b.dataset.ally });
  });
  $('[data-run]').onclick = () => end({ kind: 'logoff' });
  render();
}
