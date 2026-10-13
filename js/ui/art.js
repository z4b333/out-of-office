// Inline SVG art: CCTV-style evidence photos, scope scenes, and the desk window view.
// Every photo carries a small red "recording" dot — a motif that follows the player.

let uid = 0;

export function person(x, y, s = 1, fill = '#111', extra = '') {
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">
    <circle cx="0" cy="-46" r="11"/><path d="M-15 -32 Q0 -38 15 -32 L19 18 L-19 18 Z"/>${extra}</g>`;
}

function rand(seed) {
  let s = seed;
  return () => (s = (s * 9301 + 49297) % 233280) / 233280;
}

function svg(inner, { w = 320, h = 200, label = '' } = {}) {
  const tag = label
    ? `<text x="8" y="16" font-family="monospace" font-size="10" fill="#e6f2ee" opacity=".85">${label}</text>
       <circle cx="${w - 12}" cy="12" r="4" fill="#e0453a"/>`
    : '';
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${inner}${tag}</svg>`;
}

// `live` is the chance a window gets an animated overlay: a light switching on or off
// now and then, or the blue flicker of a TV. Only the desk window view uses it.
function windows(r, x0, y0, cols, rows, w, h, gap, litChance, lit = '#f2c27a', dark = '#1b2129', live = 0) {
  let out = '';
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const on = r() < litChance;
      const x = x0 + i * (w + gap), y = y0 + j * (h + gap);
      out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${on ? lit : dark}" opacity="${on ? 0.85 : 1}"/>`;
      if (live && r() < live) {
        const tv = on && r() < 0.4;
        const timing = `animation-duration:${(tv ? 3 : 16) + r() * 14}s;animation-delay:-${r() * 30}s`;
        out += `<rect class="${tv ? 'win-tv' : 'win-flick'}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${tv ? '#8fb8ff' : on ? dark : lit}" style="${timing}"/>`;
      }
    }
  }
  return out;
}

const SCENES = {
  lobby() {
    const r = rand(7);
    let rain = '';
    for (let i = 0; i < 16; i++) {
      const x = 26 + r() * 98, y = 34 + r() * 84;
      rain += `<line x1="${x}" y1="${y}" x2="${x - 3}" y2="${y + 14}" stroke="#9fc3d6" stroke-width="1" opacity=".7"/>`;
    }
    return svg(`
      <rect width="320" height="200" fill="#2a2724"/>
      <rect y="140" width="320" height="60" fill="#3d3832"/>
      <rect x="20" y="30" width="110" height="105" fill="#2d4250" stroke="#6b7f8a" stroke-width="3"/>${rain}
      <rect x="200" y="40" width="84" height="100" fill="#8a8f94"/>
      <line x1="242" y1="40" x2="242" y2="140" stroke="#5a5f64" stroke-width="2"/>
      <rect x="230" y="26" width="24" height="8" fill="#e8c547" opacity=".8"/>
      ${person(165, 150, 1.1, '#55595e', '<rect x="-2" y="-30" width="4" height="22" fill="#e8c547"/>')}`,
      { label: 'CAM 03 · KESSLER · 19:10' });
  },

  pier() {
    const id = 'g' + (++uid);
    return svg(`
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3a3f6b"/><stop offset="1" stop-color="#c87a5a"/></linearGradient></defs>
      <rect width="320" height="120" fill="url(#${id})"/>
      <rect y="120" width="320" height="80" fill="#1d3346"/>
      <path d="M0 150 Q40 146 80 150 T160 150 T240 150 T320 150" stroke="#3d5f7a" fill="none"/>
      <path d="M0 175 Q40 171 80 175 T160 175 T240 175 T320 175" stroke="#3d5f7a" fill="none"/>
      <rect x="60" y="128" width="260" height="14" fill="#2a2522"/>
      <rect x="110" y="70" width="6" height="60" fill="#222"/><rect x="230" y="70" width="6" height="60" fill="#222"/>
      <rect x="104" y="62" width="138" height="16" fill="#222"/>
      <text x="173" y="74" text-anchor="middle" font-family="monospace" font-size="10" fill="#e8c547">PIER 9 · FERRY</text>
      <rect x="282" y="60" width="4" height="70" fill="#222"/><circle cx="284" cy="58" r="14" fill="#ffd27a" opacity=".25"/><circle cx="284" cy="58" r="4" fill="#ffe7b0"/>
      ${person(175, 128, 0.9, '#4a4e53', '<rect x="-2" y="-30" width="4" height="22" fill="#e8c547"/>')}`,
      { label: 'SCOPE · PIER 9 · 21:00' });
  },

  park() {
    let trees = '';
    [[30, 110, 34], [80, 100, 26], [270, 105, 36], [300, 120, 24]].forEach(([x, y, rr]) => {
      trees += `<circle cx="${x}" cy="${y}" r="${rr}" fill="#16301f"/>`;
    });
    return svg(`
      <rect width="320" height="200" fill="#111a24"/>
      <rect y="130" width="320" height="70" fill="#16241a"/>${trees}
      <polygon points="120,70 200,70 220,92 100,92" fill="#2b2f36"/>
      <rect x="108" y="92" width="4" height="46" fill="#2b2f36"/><rect x="208" y="92" width="4" height="46" fill="#2b2f36"/>
      <rect x="100" y="136" width="120" height="8" fill="#2b2f36"/>
      <circle cx="160" cy="80" r="40" fill="#ffd27a" opacity=".06"/>
      ${person(160, 136, 0.85, '#d9b52c', '<circle cx="0" cy="-48" r="14" fill="#d9b52c"/><rect x="10" y="-14" width="14" height="10" fill="#f4efe4"/>')}`,
      { label: 'SCOPE · RIVERSIDE PARK · 20:00' });
  },

  parkDay() {
    let birds = '';
    const r = rand(3);
    for (let i = 0; i < 7; i++) birds += `<ellipse cx="${120 + r() * 120}" cy="${168 + r() * 20}" rx="5" ry="3" fill="#6b6f74"/>`;
    return svg(`
      <rect width="320" height="200" fill="#7fa7c4"/>
      <rect y="120" width="320" height="80" fill="#5d8a4e"/>
      <circle cx="40" cy="100" r="34" fill="#355f34"/><circle cx="280" cy="96" r="40" fill="#355f34"/>
      <rect x="60" y="150" width="70" height="8" fill="#6b4a32"/>
      ${person(100, 160, 0.9, '#d9b52c')}${birds}`,
      { label: 'CAM 07 · RIVERSIDE PARK · 11:00' });
  },

  postoffice() {
    return svg(`
      <rect width="320" height="200" fill="#2f3533"/>
      <rect y="150" width="320" height="50" fill="#3b3631"/>
      <rect x="190" y="100" width="130" height="60" fill="#5b4a3a"/>
      <rect x="60" y="80" width="60" height="10" fill="#151515"/>
      <text x="90" y="74" text-anchor="middle" font-family="monospace" font-size="8" fill="#cfcfcf">LETTERS</text>
      ${person(255, 104, 0.7, '#4b5257')}
      ${person(96, 158, 1.05, '#d9b52c', '<circle cx="0" cy="-48" r="14" fill="#d9b52c"/><circle cx="0" cy="-44" r="8" fill="#6b5a1a"/><rect x="-28" y="-28" width="16" height="10" fill="#f4efe4"/>')}`,
      { label: 'CAM 01 · OLD MARKET PO · 16:05' });
  },

  windowExt() {
    const r = rand(11);
    const id = 'g' + (++uid);
    return svg(`
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f6cf8e"/><stop offset="1" stop-color="#b9824a"/></linearGradient></defs>
      <rect width="320" height="200" fill="#12161c"/>
      ${windows(r, 20, 20, 7, 4, 30, 30, 14, 0.12, '#6b5a40', '#1b2129')}
      <rect x="128" y="62" width="66" height="54" fill="#cfc7b6"/>
      <rect x="132" y="66" width="58" height="46" fill="url(#${id})"/>
      <rect x="132" y="98" width="58" height="14" fill="#4b3a2c"/>
      <rect x="148" y="82" width="28" height="16" fill="#8fd3ff" opacity=".85"/>
      ${person(161, 104, 0.42, '#1a1410')}
      <rect x="179" y="92" width="7" height="8" fill="#3f78c2"/>
      <line x1="161" y1="66" x2="161" y2="112" stroke="#cfc7b6" stroke-width="2"/>
      <line x1="132" y1="89" x2="190" y2="89" stroke="#cfc7b6" stroke-width="2"/>
      <circle cx="166" cy="78" r="2.2" fill="#ff2a2a"/>`,
      { label: 'LONG LENS · ELM ST 4B · NOW' });
  },

  suite() {
    return svg(`
      <rect width="320" height="200" fill="#2b2622"/>
      <polygon points="0,200 110,120 210,120 320,200" fill="#4a2f2a"/>
      <rect x="110" y="30" width="100" height="90" fill="#352d27"/>
      <rect x="135" y="42" width="50" height="78" fill="#5a3d2a" stroke="#8a6a4a" stroke-width="2"/>
      <text x="160" y="38" text-anchor="middle" font-family="monospace" font-size="9" fill="#d8c89a">1201</text>
      <rect x="180" y="80" width="6" height="10" fill="#2f2" opacity=".8"/>
      ${person(212, 150, 0.85, '#3b3f44', '<rect x="-12" y="-28" width="24" height="5" fill="#b8963a"/>')}`,
      { label: 'CAM 12 · KESSLER 12F · MON 14:02' });
  },

  listing() {
    return svg(`
      <rect width="320" height="200" fill="#e9dcc4"/>
      <rect x="20" y="20" width="120" height="100" fill="#9fb8cf" stroke="#fff" stroke-width="6"/>
      <line x1="80" y1="20" x2="80" y2="120" stroke="#fff" stroke-width="4"/>
      <line x1="20" y1="70" x2="140" y2="70" stroke="#fff" stroke-width="4"/>
      <rect x="0" y="130" width="320" height="70" fill="#8a6a4e"/>
      <rect x="150" y="96" width="90" height="36" fill="#2b2e33" rx="3"/>
      <rect x="156" y="100" width="78" height="26" fill="#6fa8d6"/>
      <rect x="252" y="108" width="18" height="22" fill="#3f78c2"/>
      <polygon points="262,108 268,108 265,113" fill="#8a6a4e"/>
      <text x="300" y="190" text-anchor="end" font-family="sans-serif" font-size="11" fill="#fff">4B · bright, quiet, furnished</text>`,
      { label: 'RENTAL LISTING · 13 MONTHS AGO' });
  },

  roof() {
    let city = '';
    const r = rand(9);
    for (let i = 0; i < 9; i++) {
      const h = 40 + r() * 70;
      city += `<rect x="${i * 36}" y="${150 - h}" width="32" height="${h}" fill="#141b26"/>`;
    }
    const id = 'g' + (++uid);
    return svg(`
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#22345a"/><stop offset="1" stop-color="#5b6f9c"/></linearGradient></defs>
      <rect width="320" height="200" fill="url(#${id})"/>
      <circle cx="250" cy="40" r="16" fill="#e8ecf5"/><circle cx="250" cy="40" r="34" fill="#e8ecf5" opacity=".12"/>
      ${city}
      <rect y="150" width="320" height="50" fill="#2a2f38"/>
      <rect x="40" y="110" width="36" height="40" fill="#343a44"/>
      <rect x="50" y="122" width="16" height="28" fill="#f2c27a" opacity=".85"/>
      <rect x="230" y="128" width="50" height="22" fill="#30353e"/>
      ${person(150, 160, 0.95, '#07090c')}`,
      { label: 'SCOPE · ELM ST ROOF · 21:00' });
  },

  notebook() {
    return svg(`
      <rect width="320" height="200" fill="#22252a"/>
      <rect x="40" y="20" width="240" height="160" fill="#2c3036" rx="6"/>
      <rect x="250" y="20" width="10" height="160" fill="#b0201a"/>
      ${[50, 75, 100, 125, 150].map(y => `<line x1="60" y1="${y}" x2="235" y2="${y}" stroke="#4a5058"/>`).join('')}
      <text x="70" y="70" font-family="cursive" font-size="16" fill="#e6dfcf">things that</text>
      <text x="70" y="95" font-family="cursive" font-size="16" fill="#e6dfcf">don't add up</text>`);
  },
};

export function scene(key) {
  return (SCENES[key] || SCENES.notebook)();
}

// What the player sees out of their own window. Changes a little every day.
// Ambient motion (clouds, birds, stars, window lights, a passing car) is driven by CSS in desk.css.
export function windowView(day) {
  const sky = {
    1: ['#f6a66b', '#7b5ea7'], 2: ['#d9806b', '#4b3f78'], 3: ['#4a5f8f', '#1d2747'],
    4: ['#1c2440', '#0b0f1e'], 5: ['#0b1020', '#05070d'],
  }[day] || ['#0b1020', '#05070d'];
  const lit = { 1: 0.4, 2: 0.32, 3: 0.24, 4: 0.14, 5: 0.06 }[day] ?? 0.06;
  const live = { 1: 0.12, 2: 0.12, 3: 0.14, 4: 0.16, 5: 0.1 }[day] ?? 0.1;
  const r = rand(5);
  const d = rand(13 + day);
  const id = 'g' + (++uid);

  // Never rain: rain in a window is a clue elsewhere (a_rain).
  let clouds = '';
  if (day <= 3) {
    const tint = day === 3 ? '#8fa0c8' : '#ffe0c8';
    for (let i = 0; i < 3; i++) {
      const y = 12 + d() * 34, s = 0.7 + d() * 0.6;
      clouds += `<g class="cloud" style="animation-duration:${70 + d() * 50}s;animation-delay:-${d() * 120}s">
        <g transform="translate(0 ${y}) scale(${s})" fill="${tint}" opacity="${day === 3 ? 0.22 : 0.32}">
          <ellipse cx="0" cy="0" rx="26" ry="7"/><ellipse cx="-10" cy="-4" rx="12" ry="7"/><ellipse cx="9" cy="-5" rx="14" ry="8"/>
        </g></g>`;
    }
  }

  let stars = '';
  const starCount = { 3: 8, 4: 16, 5: 22 }[day] || 0;
  for (let i = 0; i < starCount; i++) {
    stars += `<circle class="star" cx="${(d() * 266).toFixed(1)}" cy="${(3 + d() * 62).toFixed(1)}" r="${(0.5 + d() * 0.7).toFixed(2)}" fill="#e8ecf5"
      style="animation-duration:${2.5 + d() * 4}s;animation-delay:-${d() * 6}s"/>`;
  }

  const birds = day <= 2 ? `<g class="birds"><g fill="none" stroke="#2a2235" stroke-width="1" stroke-linecap="round">
      <path class="wing" d="M0 30 q3 -3 6 0 q3 -3 6 0"/>
      <path class="wing" d="M14 24 q2.5 -2.5 5 0 q2.5 -2.5 5 0" style="animation-delay:-.2s"/>
      <path class="wing" d="M-12 22 q2.5 -2.5 5 0 q2.5 -2.5 5 0" style="animation-delay:-.4s"/>
    </g></g>` : '';

  const night = day >= 4;
  const car = `<g class="car" style="animation-duration:${{ 1: 14, 2: 16, 3: 20, 4: 26, 5: 34 }[day] ?? 34}s">
      ${night || day === 3 ? '<polygon points="0,210 46,204 46,220" fill="#ffe7b0" opacity=".16"/>' : ''}
      <rect x="-34" y="204" width="34" height="10" rx="3" fill="#2a2e35"/>
      <rect x="-26" y="199" width="18" height="7" rx="2" fill="#23272d"/>
      <circle cx="-1" cy="208" r="1.6" fill="#ffe7b0"/>
      <rect x="-34" y="206" width="2" height="3" fill="#e0453a"/>
      <circle cx="-26" cy="214" r="3.5" fill="#0d0f12"/><circle cx="-8" cy="214" r="3.5" fill="#0d0f12"/>
    </g>`;

  const van = day >= 2 ? `
    <rect x="118" y="170" width="84" height="32" rx="4" fill="#7d838a"/>
    <rect x="180" y="174" width="18" height="12" fill="#22282e"/>
    <circle class="rec-dot" cx="193" cy="177" r="1.3" fill="#ff2a2a"/>
    <circle cx="136" cy="203" r="7" fill="#111"/><circle cx="186" cy="203" r="7" fill="#111"/>
    <rect x="124" y="190" width="22" height="7" fill="#e9e3d2"/>
    <text x="135" y="196" text-anchor="middle" font-family="monospace" font-size="5" fill="#111">DH-0003</text>` : '';
  const watcher = day >= 5 ? person(224, 200, 0.42, '#05070a') : '';
  const lamp = { 1: 'lamp-glow', 2: 'lamp-glow', 3: 'lamp-flicker' }[day] || '';
  return `<svg viewBox="0 0 266 226" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky[1]}"/><stop offset="1" stop-color="${sky[0]}"/></linearGradient></defs>
    <rect width="266" height="226" fill="url(#${id})"/>
    ${stars}${clouds}${birds}
    <rect x="0" y="70" width="70" height="140" fill="#1a1f27"/>${windows(r, 8, 80, 3, 6, 14, 12, 8, lit, undefined, undefined, live)}
    <rect x="80" y="40" width="96" height="170" fill="#151a21"/>${windows(r, 90, 50, 4, 7, 14, 12, 8, lit, undefined, undefined, live)}
    <rect x="186" y="90" width="80" height="120" fill="#1d222a"/>${windows(r, 194, 100, 3, 5, 16, 12, 8, lit, undefined, undefined, live)}
    <rect y="196" width="266" height="30" fill="#202428"/>
    <rect x="34" y="120" width="4" height="80" fill="#0d0f12"/>
    <g class="${lamp}">
      <circle cx="36" cy="118" r="${day >= 4 ? 0 : 16}" fill="#ffd27a" opacity=".22"/>
      <circle cx="36" cy="118" r="4" fill="${day >= 4 ? '#333' : '#ffe7b0'}"/>
    </g>
    ${van}${car}${watcher}
  </svg>`;
}
