import { fmt, esc } from '../../core/state.js';
import { localPoint } from '../../desk/desk.js';
import { scene } from '../../ui/art.js';
import { emit } from '../../core/bus.js';

// Scope view: a sharp circle follows the mouse over a dimmed scene, with a little sway.
// `onWarn` is only passed once the player knows who the target really is.
// With `warnLocked`, a disabled Warn button shows that the option exists.
export function showScope(root, caseData, { onGo, onNoGo, onWarn, warnLocked }) {
  root.innerHTML = `<div class="scope">
    <div class="scope-view">
      <div class="scope-layer dim">${scene(caseData.scope.scene)}</div>
      <div class="scope-layer sharp">${scene(caseData.scope.scene)}</div>
      <div class="scope-cross"></div>
    </div>
    <div class="scope-bar">
      <div class="scope-line">OVERWATCH: ${esc(fmt(caseData.scope.line))}</div>
      <div class="scope-wind">WIND 3 kt<br>RANGE 412 m</div>
      <div class="scope-btns">
        ${onWarn ? '<button class="btn btn-teal" data-warn title="Text them from your phone. Halcyon will see.">Warn them</button>' : ''}
        ${warnLocked ? `<button class="btn btn-teal" disabled title="You don't know who they really are. Something in today's files would tell you.">Warn them 🔒</button>` : ''}
        <button class="btn btn-ghost" data-nogo>No-go</button>
        <button class="btn" data-go>GO · confirm target</button>
      </div>
    </div>
  </div>`;

  const view = root.querySelector('.scope-view');
  const sharp = root.querySelector('.sharp');
  const cross = root.querySelector('.scope-cross');
  const line = root.querySelector('.scope-line');
  let target = { x: view.clientWidth / 2, y: view.clientHeight / 2 };
  let raf = 0;

  view.addEventListener('pointermove', e => { target = localPoint(e, view); });

  const tick = t => {
    const x = target.x + Math.sin(t / 700) * 4;
    const y = target.y + Math.cos(t / 900) * 3;
    sharp.style.clipPath = `circle(120px at ${x}px ${y}px)`;
    cross.style.left = x + 'px';
    cross.style.top = y + 'px';
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  root.querySelector('[data-go]').onclick = () => onGo();
  root.querySelector('[data-nogo]').onclick = () => onNoGo();
  if (onWarn) root.querySelector('[data-warn]').onclick = () => onWarn();
  emit('scope:open', caseData);

  return {
    say(text) { line.textContent = fmt(text); },
    lock() { root.querySelectorAll('.scope-btns button').forEach(b => { b.disabled = true; }); },
    flash() {
      const s = root.querySelector('.scope');
      s.classList.remove('flash');
      void s.offsetWidth;
      s.classList.add('flash');
    },
    destroy() { cancelAnimationFrame(raf); },
  };
}
