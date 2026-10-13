import { state, esc, fmt, money, save } from '../core/state.js';
import { INBOX } from '../data/days/lore.js';

const area = () => document.getElementById('app-area');

export function clearApp() {
  area().innerHTML = '';
}

// DeskHire home screen: the gig list beside the inbox, with today's OVERWATCH packet ready.
export function showHome(caseData, onStart) {
  const pay = caseData.final
    ? (state.bonusCancelled ? 'bonus withdrawn' : money(caseData.reward.base) + ' bonus')
    : money(caseData.reward.base);
  area().innerHTML = `<div class="home home-split">
    <div>
      <div class="home-hero">
        <div class="hira">✦</div>
        <div><h2>Good evening, ${esc(state.username)}.</h2><p>Your DeskHire gigs</p></div>
      </div>
      <div class="gig past"><div>MeetUp · Professional Meeting Attendee</div><em>completed</em></div>
      <div class="gig past"><div>Postbox · Translator &amp; Lost and Found</div><em>completed</em></div>
      <div class="gig active">
        <div><b>OVERWATCH</b> · Executive Protection Analyst<br>
          <small>Case ${caseData.id} · today's packet is ready</small></div>
        <div class="gig-pay">${pay}</div>
      </div>
      <button class="btn" id="start-shift">Start shift ▸</button>
      <p class="home-foot">⭐ 4.9 rating · All sessions are recorded for quality and training purposes.</p>
    </div>
    <div class="inbox">
      <h4>INBOX <span class="inbox-unread"></span></h4>
      <div class="inbox-list"></div>
    </div>
    <div class="mail hidden"></div>
  </div>`;
  area().querySelector('#start-shift').onclick = onStart;
  renderInbox();
}

function renderInbox() {
  const mails = INBOX.filter(m => m.day <= state.day).reverse();
  const unread = mails.filter(m => !state.readMail.includes(m.id)).length;
  area().querySelector('.inbox-unread').textContent = unread ? `· ${unread} unread` : '';
  area().querySelector('.inbox-list').innerHTML = mails.map(m => `
    <button class="mail-row ${state.readMail.includes(m.id) ? '' : 'unread'}" data-mail="${m.id}">
      <span class="mail-from">${esc(m.from)}</span>
      <span class="mail-subject">${esc(fmt(m.subject))}</span>
    </button>`).join('');
  area().querySelectorAll('[data-mail]').forEach(b => { b.onclick = () => openMail(b.dataset.mail); });
}

function openMail(id) {
  const m = INBOX.find(x => x.id === id);
  if (!state.readMail.includes(id)) { state.readMail.push(id); save(); }
  const el = area().querySelector('.mail');
  el.innerHTML = `<div class="mail-card">
    <div class="mail-meta">From: ${esc(m.from)}<br>To: ${esc(state.username)}</div>
    <h3>${esc(fmt(m.subject))}</h3>
    <div class="mail-body">${esc(fmt(m.body)).replace(/\n/g, '<br>')}</div>
    <button class="btn btn-ghost" data-close>Back</button>
  </div>`;
  el.classList.remove('hidden');
  el.querySelector('[data-close]').onclick = () => el.classList.add('hidden');
  renderInbox();
}
