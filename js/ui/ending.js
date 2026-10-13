import { state, fmt, esc, clearSave, everWentGo } from '../core/state.js';
import { showOverlay, blackout, updateHud } from '../desk/desk.js';
import { pushMessage, cancelQueue } from '../desk/phone.js';
import { setLaser } from '../desk/window.js';
import { clearApp } from '../apps/laptop.js';

const TOTAL_ANOMALIES = 13;
const BEAT_MS = 2400;
const ALLY_NAMES = { reyes: 'Jonah Reyes', ana: 'Ana Lindqvist', k: 'Kai' };
const PEOPLE = [['okafor', 'Paul Okafor'], ['reyes', 'Jonah Reyes'], ['ana', 'Ana Lindqvist'], ['k', 'Kai Lindqvist']];

// Each beat: { text, cls?, phone? } where phone is the contact who also receives it.
const ENDINGS = {
  accept: s => ({
    title: 'ENDING · ACCEPT THE OFFER',
    laser: false,
    beats: [
      { cls: 'e-sys', text: 'OVERWATCH: Confirmed.' },
      { text: 'The red dot on your window holds, steady, for a long time.' },
      { text: 'Then it goes out.' },
      { cls: 'e-hira', phone: 'hira', text: 'Hira: You passed! 💜' },
      { cls: 'e-hira', phone: 'hira', text: 'Hira: A system that will remove its own operator is a system we can sell.' },
      s.bonusCancelled
        ? { cls: 'e-hira', phone: 'hira', text: 'Hira: Your bonus stays withdrawn. But you have something better now: a title.' }
        : { cls: 'e-hira', phone: 'hira', text: 'Hira: Your $5,000 bonus has been sent. Rent: handled 💜' },
      { cls: 'e-hira', phone: 'hira', text: 'Hira: Welcome to Handler status. Your first task: a MeetUp invite for a new contractor across town. Say hi! 💜' },
      { text: 'Your phone rings. Mom.' },
      { text: 'It stops before you can answer. Call log: answered by You. Duration 4:12.' },
    ],
    outro: 'The van outside starts its engine. The driver\'s seat is empty. It always was.',
  }),

  logoff: s => ({
    title: 'ENDING · LOG OFF',
    laser: true,
    beats: [
      { cls: 'e-sys', text: 'OVERWATCH: SPOTTER-2, you have the target.' },
      { text: 'You run at 3:33 AM.' },
      ...(s.fates.k === 'warned' ? [
        { text: 'Kai is on the stairs. He grabs your arm. "Down, not up."' },
        { text: 'The shot meant for your window finds him on the landing instead.' },
        { text: 'You make it out. He doesn\'t.' },
      ] : [
        { text: 'The stairwell is empty. Nobody is coming for you, and nobody is coming to help.' },
        { text: 'You make it out.' },
      ]),
      { text: 'Eleven months later.' },
      { text: 'Someone new lives in 4B. There is a chipped blue mug in the cupboard.' },
      { text: 'At 3:33 AM, you send them a text.' },
      { cls: 'e-k', text: 'I was you.' },
    ],
    outro: 'You are K. now.',
  }),

  expose: (s, e) => {
    const confirmed = Object.values(s.outcomes).filter(o => o === 'go').length;
    return {
      title: 'ENDING · EXPOSE',
      laser: true,
      beats: [
        { text: 'You photograph every page on the wall.' },
        { text: 'To make anyone believe it, the files need one more thing: your own OVERWATCH call log.' },
        { text: `You attach it. You send everything to ${ALLY_NAMES[e.ally]}.` },
        { cls: 'e-sys', text: 'OVERWATCH: Spotter, respond. Spotter—' },
        { text: 'The story runs at 6 AM. DeskHire is offline by noon.' },
        everWentGo()
          ? { text: `Your call log lists every name you confirmed. So does the charge sheet: accessory, ${confirmed} count${confirmed === 1 ? '' : 's'}.` }
          : { text: 'You never pressed Go. They died anyway, confirmed by SPOTTER-2. The charge sheet reads: "trained the system."' },
        ...(s.momTaken ? [{ text: 'Mom visits you once. She says your texts were so kind this week. You don\'t tell her.' }] : []),
        { text: 'Three weeks later, a new gig app launches: WorkNest.' },
        { cls: 'e-hira', text: 'WorkNest: Hi! 💜 Ready to work from home?' },
      ],
      outro: 'The newsreader on the morning broadcast sounds a little like you.',
    };
  },
};

export function showEnding(ending) {
  const e = ENDINGS[ending.kind](state, ending);
  cancelQueue();
  clearApp();
  updateHud(5);
  setLaser(e.laser);
  if (ending.kind !== 'accept') blackout();

  const fates = PEOPLE.map(([id, name]) => {
    const f = state.fates[id];
    return `<li>${name}: <b>${f === 'warned' ? 'alive' : f === 'dead' ? 'dead' : 'unknown'}</b></li>`;
  }).join('');

  const ov = showOverlay(`<div class="ending">
    <div class="kicker">${e.title}</div>
    <div class="ending-lines"></div>
    <div class="ending-final hidden">
      <p class="e-sys">${esc(fmt(e.outro))}</p>
      <ul class="fates">${fates}</ul>
      <p class="e-sys">Things you wrote down: ${state.clues.length} / ${TOTAL_ANOMALIES}</p>
      <button class="btn" data-again>Play again</button>
    </div>
  </div>`);
  ov.style.background = 'rgba(5, 8, 10, .78)';
  const lines = ov.querySelector('.ending-lines');

  e.beats.forEach((b, i) => setTimeout(() => {
    const p = document.createElement('p');
    p.className = b.cls || '';
    p.textContent = fmt(b.text);
    lines.appendChild(p);
    if (b.phone) pushMessage(b.phone, b.text.replace(/^[^:]+:\s*/, ''));
  }, 800 + i * BEAT_MS));

  setTimeout(() => ov.querySelector('.ending-final').classList.remove('hidden'),
    800 + e.beats.length * BEAT_MS + 600);

  ov.querySelector('[data-again]').onclick = () => {
    clearSave();
    location.reload();
  };
}
