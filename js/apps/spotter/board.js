import { fmt, esc } from '../../core/state.js';
import { localPoint } from '../../desk/desk.js';
import { scene } from '../../ui/art.js';

const NS = 'http://www.w3.org/2000/svg';
const LINK_TYPES = [
  { type: 'person', label: '👤 Same person' },
  { type: 'place', label: '📍 Same place' },
  { type: 'time', label: '🕒 Same time' },
];

// Corkboard with draggable evidence cards. Click a card's pin, then another card's pin,
// then pick how they connect. `onLink(a, b, type)` returns 'correct' | 'wrong' | 'duplicate'.
// With a single link type the picker is skipped.
export function createBoard(el, evidence, {
  onLink, onOpen, isRedacted = () => false, hasHint = () => false,
  linkTypes = LINK_TYPES, layout = { cols: 4, dx: 156, dy: 172, x0: 20, y0: 26 },
}) {
  el.innerHTML = '<svg class="strings"></svg>';
  const svg = el.querySelector('svg');
  const cards = new Map();
  const links = [];
  let armed = null;
  let rubber = null;
  let picker = null;

  evidence.forEach((ev, i) => {
    const card = document.createElement('div');
    card.className = `card card-${ev.type}`;
    card.style.left = (layout.x0 + (i % layout.cols) * layout.dx + ((i * 37) % 13)) + 'px';
    card.style.top = (layout.y0 + Math.floor(i / layout.cols) * layout.dy + ((i * 53) % 17)) + 'px';
    card.style.setProperty('--r', (((i * 47) % 9) - 4) + 'deg');
    card.innerHTML = `<div class="pin" title="Connect"></div>
      ${ev.photo ? `<div class="thumb">${scene(ev.photo)}</div>` : ''}
      <div class="card-type">${ev.type}</div>
      <div class="card-title">${esc(fmt(ev.title))}</div>`;
    card.classList.toggle('stamped', isRedacted(ev.id));
    card.classList.toggle('hint', hasHint(ev.id));
    el.appendChild(card);
    cards.set(ev.id, card);
    enableDrag(card, ev);
    card.querySelector('.pin').addEventListener('pointerdown', e => {
      e.stopPropagation();
      pinClicked(ev.id);
    });
  });

  el.addEventListener('pointermove', e => {
    if (!armed || !rubber) return;
    const p = localPoint(e, el);
    rubber.setAttribute('x2', p.x);
    rubber.setAttribute('y2', p.y);
  });
  el.addEventListener('pointerdown', e => {
    if (e.target === el || e.target === svg) disarm();
  });
  const onKey = e => { if (e.key === 'Escape') { disarm(); closePicker(); } };
  addEventListener('keydown', onKey);

  function pinPos(id) {
    const c = cards.get(id);
    return { x: c.offsetLeft + c.offsetWidth / 2, y: c.offsetTop + 2 };
  }

  function line(a, b, cls) {
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('class', cls);
    svg.appendChild(l);
    setLine(l, pinPos(a), pinPos(b));
    return l;
  }

  function setLine(l, p, q) {
    l.setAttribute('x1', p.x); l.setAttribute('y1', p.y);
    l.setAttribute('x2', q.x); l.setAttribute('y2', q.y);
  }

  function updateLines() {
    links.forEach(k => setLine(k.line, pinPos(k.a), pinPos(k.b)));
    if (armed && rubber) {
      const p = pinPos(armed);
      rubber.setAttribute('x1', p.x);
      rubber.setAttribute('y1', p.y);
    }
  }

  function pinClicked(id) {
    closePicker();
    if (!armed) {
      armed = id;
      cards.get(id).querySelector('.pin').classList.add('armed');
      rubber = line(id, id, 'string rubber');
      el.classList.add('linking');
      return;
    }
    if (armed === id) { disarm(); return; }
    const a = armed;
    disarm();
    openPicker(a, id);
  }

  function disarm() {
    if (armed) cards.get(armed).querySelector('.pin').classList.remove('armed');
    armed = null;
    el.classList.remove('linking');
    rubber?.remove();
    rubber = null;
  }

  function applyLink(a, b, type) {
    const status = onLink(a, b, type);
    if (status === 'correct') {
      links.push({ a, b, line: line(a, b, 'string') });
    } else if (status === 'wrong') {
      const l = line(a, b, 'string wrong');
      setTimeout(() => l.remove(), 1600);
    }
  }

  function openPicker(a, b) {
    if (linkTypes.length === 1) { applyLink(a, b, linkTypes[0].type); return; }
    const pa = pinPos(a), pb = pinPos(b);
    const preview = line(a, b, 'string rubber');
    picker = document.createElement('div');
    picker.className = 'picker';
    picker.innerHTML = `<b>HOW ARE THEY LINKED?</b>` +
      linkTypes.map(t => `<button data-type="${t.type}">${t.label}</button>`).join('') +
      `<button class="cancel" data-type="">Cancel</button>`;
    const x = Math.min(Math.max((pa.x + pb.x) / 2 - 70, 6), el.clientWidth - 160);
    const y = Math.min(Math.max((pa.y + pb.y) / 2 - 60, 6), el.clientHeight - 170);
    picker.style.left = x + 'px';
    picker.style.top = y + 'px';
    picker.addEventListener('pointerdown', e => e.stopPropagation());
    picker.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      preview.remove();
      closePicker();
      if (btn.dataset.type) applyLink(a, b, btn.dataset.type);
    });
    picker._preview = preview;
    el.appendChild(picker);
  }

  function closePicker() {
    if (!picker) return;
    picker._preview?.remove();
    picker.remove();
    picker = null;
  }

  function enableDrag(card, ev) {
    let start = null, orig = null, moved = false;
    card.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      start = localPoint(e, el);
      orig = { x: card.offsetLeft, y: card.offsetTop };
      moved = false;
      card.setPointerCapture(e.pointerId);
    });
    card.addEventListener('pointermove', e => {
      if (!start) return;
      const p = localPoint(e, el);
      const dx = p.x - start.x, dy = p.y - start.y;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 5) return;
      moved = true;
      card.classList.add('dragging');
      const maxX = el.clientWidth - card.offsetWidth;
      const maxY = el.clientHeight - card.offsetHeight;
      card.style.left = Math.min(Math.max(orig.x + dx, 0), maxX) + 'px';
      card.style.top = Math.min(Math.max(orig.y + dy, 8), maxY) + 'px';
      updateLines();
    });
    card.addEventListener('pointerup', () => {
      if (!start) return;
      start = null;
      card.classList.remove('dragging');
      cards.forEach(c => { c.style.zIndex = ''; });
      card.style.zIndex = 3;
      if (moved) return;
      // While a pin is armed, clicking anywhere on another card completes the link.
      if (armed && armed !== ev.id) pinClicked(ev.id);
      else onOpen(ev);
    });
  }

  return {
    setStamped(id, on) { cards.get(id)?.classList.toggle('stamped', on); },
    link(a, b, type) { applyLink(a, b, type); },
    setHint(id, on) { cards.get(id)?.classList.toggle('hint', on); },
    destroy() { removeEventListener('keydown', onKey); },
  };
}
