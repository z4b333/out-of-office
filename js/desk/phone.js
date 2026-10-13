import { state, fmt, esc, save } from '../core/state.js';

const CONTACTS = {
  hira: { name: 'Hira · DeskHire', avatar: '✦', color: '#6d4fe6' },
  mom: { name: 'Mom', avatar: '♥', color: '#e0668a' },
  dale: { name: 'Dale (landlord)', avatar: 'D', color: '#c98e2e' },
  k: { name: 'Unknown', avatar: '?', color: '#2a2d31' },
  k2: { name: 'Unknown', avatar: '?', color: '#4a1f1f' },
  ana: { name: 'A.L.', avatar: 'A', color: '#c9a227' },
  reyes: { name: 'J.R. (encrypted)', avatar: 'J', color: '#2f7a6b' },
};

let openThread = null;
let queueGen = 0;
let bannerTimer = null;

const body = () => document.getElementById('phone-body');

export function initPhone() {
  body().addEventListener('click', e => {
    const row = e.target.closest('[data-thread]');
    if (row) { openThread = row.dataset.thread; render(); return; }
    if (e.target.closest('[data-back]')) { openThread = null; render(); }
  });
}

export function renderPhone() {
  openThread = null;
  render();
}

function render() {
  if (openThread) renderThread(openThread);
  else renderList();
}

function renderList() {
  const rows = state.threadOrder.map(id => {
    const c = CONTACTS[id];
    const msgs = state.threads[id] || [];
    const unread = msgs.filter(m => !m.read).length;
    const last = msgs[msgs.length - 1];
    return `<button class="thread-row" data-thread="${id}">
      <span class="avatar" style="background:${c.color}">${c.avatar}</span>
      <span class="thread-meta"><span class="thread-name">${c.name}</span>
      <span class="thread-last">${last ? (last.me ? 'You: ' : '') + esc(last.text) : ''}</span></span>
      ${unread ? `<span class="badge">${unread}</span>` : ''}
    </button>`;
  }).join('');
  body().innerHTML = `<div class="phone-title">Messages</div>${rows || '<p style="padding:0 16px;color:#888">No messages.</p>'}`;
}

function renderThread(id) {
  const c = CONTACTS[id];
  const msgs = state.threads[id] || [];
  msgs.forEach(m => { m.read = true; });
  body().innerHTML = `<div class="thread-${id}">
    <div class="thread-head"><button data-back>‹ Back</button>
      <span class="avatar" style="background:${c.color};width:24px;height:24px;font-size:11px">${c.avatar}</span>${c.name}</div>
    <div class="bubbles">${msgs.map(m => `<div class="bubble${m.me ? ' me' : ''}">${esc(m.text)}</div>`).join('')}</div>
  </div>`;
  body().scrollTop = body().scrollHeight;
  save();
}

// `me: true` puts a message on the player's side of a thread: messages "you" sent.
// The player never sends any. Theo does, as them, so outgoing messages arrive silently.
export function pushMessage(from, text, { me = false } = {}) {
  const msg = { text: fmt(text), read: me, me };
  (state.threads[from] ||= []).push(msg);
  state.threadOrder = [from, ...state.threadOrder.filter(id => id !== from)];
  save();
  render();
  if (me) return;
  buzz();
  showBanner(CONTACTS[from].name, msg.text);
}

// Messages from before the game started: already read, no buzz.
export function seedHistory(list) {
  list.forEach(m => {
    (state.threads[m.from] ||= []).push({ text: fmt(m.text), read: true, me: !!m.me });
    state.threadOrder = [m.from, ...state.threadOrder.filter(id => id !== m.from)];
  });
  save();
  render();
}

function buzz() {
  const phone = document.getElementById('phone');
  phone.classList.remove('buzz');
  void phone.offsetWidth;
  phone.classList.add('buzz');
}

function showBanner(name, text) {
  const el = document.getElementById('phone-banner');
  el.innerHTML = `<b>${esc(name)}</b>${esc(text)}`;
  el.classList.remove('hidden');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => el.classList.add('hidden'), 3200);
}

// Sends scripted messages one after another.
// Items: {from, text | text(ctx), delay, me?, if?(ctx)}.
export function queueMessages(list = [], ctx = {}) {
  const gen = queueGen;
  let t = 0;
  list.filter(m => !m.if || m.if(ctx)).forEach(m => {
    t += m.delay ?? 1500;
    const text = typeof m.text === 'function' ? m.text(ctx) : m.text;
    setTimeout(() => { if (gen === queueGen) pushMessage(m.from, text, { me: !!m.me }); }, t);
  });
}

export function cancelQueue() {
  queueGen++;
}
