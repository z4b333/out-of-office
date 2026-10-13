import { esc, fmt } from '../core/state.js';
import { showOverlay } from '../desk/desk.js';
import { PROLOGUE } from '../data/days/lore.js';

// Four short cards before Monday: who you are and how you got here.
export function showPrologue(onDone) {
  let i = 0;
  const render = () => {
    const card = PROLOGUE[i];
    const last = i === PROLOGUE.length - 1;
    const ov = showOverlay(`<div class="panel prologue">
      <div class="kicker">${esc(card.kicker)}</div>
      <p class="prologue-text">${esc(fmt(card.text))}</p>
      <div class="row">
        <button class="btn" data-next>${last ? 'Start Monday' : 'Next'}</button>
        ${last ? '' : '<button class="btn btn-ghost" data-skip>Skip</button>'}
      </div>
      <div class="prologue-dots">${PROLOGUE.map((_, n) => `<i class="${n === i ? 'on' : ''}"></i>`).join('')}</div>
    </div>`);
    ov.querySelector('[data-next]').onclick = () => {
      if (last) onDone();
      else { i++; render(); }
    };
    ov.querySelector('[data-skip]')?.addEventListener('click', onDone);
  };
  render();
}
