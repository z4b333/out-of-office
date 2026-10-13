import { state, fmt, esc, addClue, hasClue } from '../../core/state.js';
import { on, emit } from '../../core/bus.js';
import { toast } from '../../desk/desk.js';
import { spendCoffee } from '../../desk/mug.js';
import { renderMarkup } from '../../ui/markup.js';
import { scene } from '../../ui/art.js';
import { createBoard } from './board.js';
import { createDeducer } from './deduce.js';
import { showMap } from './mapPin.js';
import { showScope } from './scope.js';

const MAX_HEAT = 5;

// Case fields may be plain values or functions of state (for carry-over choices).
const val = x => (typeof x === 'function' ? x(state) : x);
const COLORS = ['#7a4b3a', '#3a5a7a', '#4f6b3a', '#6b3a6b', '#7a6b3a'];

// OVERWATCH shift: briefing → evidence board → locate on map → scope → Go / No-go / Warn.
// Monday has no scope: the call is a "Flag for HR".
// Calls onComplete({ outcome: 'go' | 'nogo' | 'warn' | 'timeout', heat }).
export function startSpotter(caseData, onComplete) {
  const evidence = caseData.evidence.filter(e => !e.if || e.if(state));
  const isFlag = caseData.callType === 'flag';
  const area = document.getElementById('app-area');
  area.innerHTML = `<div class="ow">
    <header class="ow-head">
      <span class="ow-logo">OVERWATCH</span>
      <span class="ow-case">CASE ${caseData.id} · ${esc(fmt(caseData.title))}</span>
      <span class="ow-spacer"></span>
      <span class="ow-heat" title="Heat: every wrong call costs you pay"></span>
      <span class="ow-timer"></span>
    </header>
    <div class="ow-body">
      <div class="ow-board"></div>
      <aside class="ow-side">
        <section><h4>SUSPECTS</h4><ul class="ow-suspects"></ul></section>
        <section class="ow-logwrap"><h4>COMMS</h4><div class="ow-log"></div></section>
        ${state.testMode ? '<button class="btn btn-ghost ow-test" data-autosolve>⚡ Auto-solve board (testing)</button>' : ''}
        <button class="btn ow-locate" disabled>${isFlag ? 'Flag for HR ▸' : 'Locate target ▸'}</button>
      </aside>
    </div>
    <div class="ow-modal hidden"></div>
  </div>`;

  const $ = sel => area.querySelector(sel);
  const modal = $('.ow-modal');
  const deducer = createDeducer(caseData);
  const unredacted = new Set();
  let heat = 0;
  let timeLeft = caseData.timerSec;
  let timerId = null;
  let scope = null;
  let finished = false;
  let board = null;

  const offMug = on('mug:click', () => {
    if (finished) return;
    if (timerId && spendCoffee(1)) {
      timeLeft += 30;
      renderTimer();
      toast('☕ +30 seconds of focus.');
    } else if (!timerId) {
      toast('☕ Coffee buys unredactions and extra time.');
    }
  });

  renderSuspects();
  renderHeat();
  renderTimer();
  showBriefing();

  // ---------- Briefing ----------
  function showBriefing() {
    openModal(`<div class="briefing">
      <div class="kicker">INCOMING · CASE ${caseData.id}</div>
      <div class="lines"></div>
      <button class="btn hidden" data-open>Open packet ▸</button>
    </div>`);
    const lines = modal.querySelector('.lines');
    caseData.briefing.forEach((text, i) => setTimeout(() => {
      if (finished) return;
      const p = document.createElement('p');
      p.innerHTML = renderMarkup(val(text));
      lines.appendChild(p);
      wireAnomalies(p);
      if (i === caseData.briefing.length - 1) modal.querySelector('[data-open]').classList.remove('hidden');
    }, 500 + i * 900));
    modal.querySelector('[data-open]').onclick = () => {
      closeModal();
      startBoard();
    };
  }

  function startBoard() {
    board = createBoard($('.ow-board'), evidence, {
      onLink: handleLink,
      onOpen: openDoc,
      isRedacted: id => isRedacted(id),
      hasHint: id => unfound(evidence.find(e => e.id === id)).length > 0,
    });
    log('Packet open. Link evidence pin to pin.', '');
    if (timeLeft > 0) startTimer();
    $('.ow-locate').onclick = isFlag ? openFlag : openMap;
    const auto = $('[data-autosolve]');
    if (auto) auto.onclick = () => {
      caseData.deductions.forEach(d => board.link(d.a, d.b, d.type));
      Object.entries(caseData.anomalies).forEach(([id, a]) =>
        addClue({ id, title: fmt(a.title), text: fmt(a.text), day: caseData.day }));
      emit('clue:new');
      evidence.forEach(e => board.setHint(e.id, false));
      auto.remove();
    };
  }

  // ---------- Linking ----------
  function handleLink(a, b, type) {
    const r = deducer.tryLink(a, b, type);
    if (r.status === 'correct') {
      log(r.deduction.reveals, 'ok');
      renderSuspects();
      const left = deducer.remaining();
      if (left.length === 1 && !$('.ow-locate').dataset.ready) {
        $('.ow-locate').dataset.ready = '1';
        $('.ow-locate').disabled = false;
        log(`One name left: ${fmt(val(left[0].name))}. ${isFlag ? 'Flag them.' : 'Locate the target.'}`, 'ok');
      }
    } else if (r.status === 'duplicate') {
      toast('Already linked.');
    } else {
      addHeat('That connection doesn\'t hold. Heat rising.');
    }
    return r.status;
  }

  function addHeat(msg) {
    heat = Math.min(MAX_HEAT, heat + 1);
    renderHeat();
    log(msg, 'bad');
  }

  // ---------- Documents ----------
  function isRedacted(id) {
    const ev = evidence.find(e => e.id === id);
    return !!ev?.redacted && !unredacted.has(id);
  }

  // Anomalies hidden in a file's text, and the ones not written down yet.
  function anomalyIds(ev) {
    return [...String(val(ev.content)).matchAll(/\[\[(\w+)\|/g)].map(m => m[1]);
  }

  function unfound(ev) {
    return anomalyIds(ev).filter(id => !hasClue(id));
  }

  function hintText(ev) {
    const n = unfound(ev).length;
    if (n) return n === 1
      ? "✎ Something in this file doesn't add up. Click it to write it down."
      : `✎ ${n} things in this file don't add up. Click them to write them down.`;
    return anomalyIds(ev).length ? '✎ Written in your notebook.' : '';
  }

  function openDoc(ev) {
    const red = isRedacted(ev.id);
    const content = val(ev.content);
    openModal(`<div class="doc doc-t-${ev.type}">
      <div class="doc-type">${ev.type.toUpperCase()} · ${ev.id.toUpperCase()}</div>
      <h3>${esc(fmt(ev.title))}</h3>
      ${ev.photo ? `<div class="doc-photo thumb">${scene(ev.photo)}</div>` : ''}
      <div class="doc-text">${renderMarkup(content, { unredacted: !red })}</div>
      <div class="doc-hint">${hintText(ev)}</div>
      <div class="doc-actions">
        ${red ? '<button class="btn btn-ghost" data-unredact>Unredact · ☕ 1</button>' : ''}
        <button class="btn" data-close>Back to board</button>
      </div>
    </div>`);
    wireAnomalies(modal, () => {
      modal.querySelector('.doc-hint').textContent = hintText(ev);
      modal.querySelector('.doc-hint').classList.toggle('done', !unfound(ev).length);
      board.setHint(ev.id, unfound(ev).length > 0);
    });
    modal.querySelector('.doc-hint').classList.toggle('done', !unfound(ev).length);
    modal.querySelector('[data-close]').onclick = closeModal;
    const un = modal.querySelector('[data-unredact]');
    if (un) un.onclick = () => {
      if (!spendCoffee(1)) return;
      unredacted.add(ev.id);
      board.setStamped(ev.id, false);
      openDoc(ev);
    };
  }

  function wireAnomalies(root, onFound = () => {}) {
    root.querySelectorAll('.anomaly').forEach(span => {
      const id = span.dataset.anomaly;
      if (hasClue(id)) span.classList.add('found');
      span.onclick = () => {
        const a = caseData.anomalies[id];
        if (!a) return;
        if (addClue({ id, title: fmt(a.title), text: fmt(a.text), day: caseData.day })) {
          toast(`✎ Noted: ${fmt(a.title)}`);
          emit('clue:new');
        }
        span.classList.add('found');
        onFound();
      };
    });
  }

  // ---------- Monday: flag instead of scope ----------
  function openFlag() {
    const name = fmt(val(deducer.remaining()[0].name));
    openModal(`<div class="briefing">
      <div class="kicker">HR REFERRAL</div>
      <p>Flag <b>${esc(name)}</b> to DeskHire HR for a policy breach?</p>
      <p style="color:var(--muted)">HR will take it from here. You won't need to do anything else.</p>
      <button class="btn btn-ghost" data-no>Don't flag</button>
      <button class="btn" data-yes>Flag for HR</button>
    </div>`);
    modal.querySelector('[data-yes]').onclick = () => {
      log('Flag received. Thanks! HR will take it from here 💜', 'ok');
      finish('go');
    };
    modal.querySelector('[data-no]').onclick = () => {
      log('Understood. Reassigning to SPOTTER-2.', 'bad');
      finish('nogo');
    };
  }

  // ---------- Map & scope ----------
  function openMap() {
    openModal('');
    showMap(modal, caseData, {
      onBack: closeModal,
      onConfirm: (place, time) => {
        const t = caseData.target;
        if (place === t.place && time === t.time) {
          log('Position confirmed. Sniper moving.', 'ok');
          openScope();
        } else {
          addHeat('Negative. The target won\'t be there.');
          toast('✕ Wrong position. Heat +1');
        }
      },
    });
  }

  function openScope() {
    clearInterval(timerId);
    timerId = null;
    openModal('');
    const canWarn = caseData.warnAnomaly && hasClue(caseData.warnAnomaly);
    const beats = (lines, outcome) => {
      scope.lock();
      lines.forEach(([ms, text]) => setTimeout(() => {
        if (text) scope.say(text); else scope.flash();
      }, ms));
      setTimeout(() => finish(outcome), lines[lines.length - 1][0] + 2200);
    };
    scope = showScope(modal, caseData, {
      onGo: () => {
        if (caseData.final) { scope.lock(); finish('go'); return; }
        beats([
          [0, 'OVERWATCH: Target confirmed. Wren, you are cleared.'],
          [1400, 'WREN: …Sending.'],
          [2600, null],
          [3000, caseData.scope.after || 'OVERWATCH: Clean work, Spotter. Payment processing.'],
        ], 'go');
      },
      onNoGo: () => {
        if (caseData.final) { scope.lock(); finish('nogo'); return; }
        beats([
          [0, 'OVERWATCH: Noted. Reassigning to SPOTTER-2.'],
          [1800, 'OVERWATCH: We don\'t pay for hesitation, Spotter.'],
        ], 'nogo');
      },
      warnLocked: !!caseData.warnAnomaly && !canWarn,
      onWarn: canWarn ? () => {
        beats([
          [0, 'You pick up your phone and text a number from the file: "They know where you\'ll be. Run. Now."'],
          [2200, 'OVERWATCH: …Target is moving. Spotter, did you make contact?'],
          [4000, 'OVERWATCH: Connection logged.'],
        ], 'warn');
      } : null,
    });
  }

  // ---------- Timer ----------
  function startTimer() {
    timerId = setInterval(() => {
      timeLeft--;
      renderTimer();
      if (timeLeft <= 0) {
        log('Window closed. Target lost.', 'bad');
        finish('timeout');
      }
    }, 1000);
  }

  function renderTimer() {
    const el = $('.ow-timer');
    if (!caseData.timerSec) { el.textContent = ''; return; }
    const m = Math.floor(Math.max(timeLeft, 0) / 60);
    const s = String(Math.max(timeLeft, 0) % 60).padStart(2, '0');
    el.textContent = `⏱ ${m}:${s}`;
    el.classList.toggle('low', timeLeft <= 20);
  }

  // ---------- Sidebar ----------
  function renderSuspects() {
    const left = deducer.remaining();
    $('.ow-suspects').innerHTML = caseData.suspects.map((s, i) => {
      const out = deducer.isEliminated(s.id);
      const name = fmt(val(s.name));
      const initials = name.replace(/[^\w ]/g, '').split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase();
      const cls = out ? 'out' : left.length === 1 ? 'last' : '';
      return `<li class="${cls}"><span class="avatar" style="background:${COLORS[i % COLORS.length]}">${esc(initials)}</span>
        <span><span class="s-name">${esc(name)}</span><small>${esc(fmt(val(s.role)))}</small></span></li>`;
    }).join('');
  }

  function renderHeat() {
    $('.ow-heat').innerHTML = 'HEAT ' + Array.from({ length: MAX_HEAT },
      (_, i) => `<i class="${i < heat ? 'on' : ''}">●</i>`).join('');
  }

  function log(text, kind) {
    const p = document.createElement('p');
    p.className = kind;
    p.textContent = fmt(text);
    const el = $('.ow-log');
    el.appendChild(p);
    el.scrollTop = el.scrollHeight;
  }

  function openModal(html) {
    modal.innerHTML = html;
    modal.classList.remove('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.innerHTML = '';
  }

  function finish(outcome) {
    if (finished) return;
    finished = true;
    clearInterval(timerId);
    offMug();
    scope?.destroy();
    board?.destroy();
    onComplete({ outcome, heat });
  }
}
