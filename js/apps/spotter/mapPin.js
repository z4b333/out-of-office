// City map of Harrow Bay: pick where and when the target will be.
export const PLACES = [
  { id: 'kessler', name: 'Kessler Hotel', x: 150, y: 110 },
  { id: 'cafe', name: 'Lantern Café', x: 260, y: 70 },
  { id: 'station', name: 'Marlow Station', x: 470, y: 70 },
  { id: 'market', name: 'Old Market', x: 380, y: 160 },
  { id: 'library', name: 'Central Library', x: 90, y: 230 },
  { id: 'park', name: 'Riverside Park', x: 300, y: 270 },
  { id: 'elm', name: 'Elm St. Apartments', x: 170, y: 330 },
  { id: 'pier9', name: 'Pier 9 Ferry', x: 520, y: 310 },
];

export function placeName(id) {
  return PLACES.find(p => p.id === id)?.name ?? id;
}

export function showMap(root, caseData, { onConfirm, onBack }) {
  let place = null, time = null;

  let blocks = '';
  for (let x = 20; x < 600; x += 70) {
    for (let y = 20; y < 380; y += 60) {
      if ((x * 7 + y * 3) % 5 !== 0) blocks += `<rect x="${x}" y="${y}" width="52" height="40" rx="3" fill="#13232a"/>`;
    }
  }
  const pins = PLACES.map(p => `<g class="map-place" data-place="${p.id}">
      <circle cx="${p.x}" cy="${p.y}" r="9"/>
      <text x="${p.x + 14}" y="${p.y + 4}">${p.name}</text></g>`).join('');

  root.innerHTML = `<div class="map">
    <div class="map-head">LOCATE · Where and when will the target be?</div>
    <div class="map-body">
      <svg class="map-svg" viewBox="0 0 600 380">
        ${blocks}
        <path d="M-10 250 C 120 220, 200 300, 330 290 S 520 250, 610 360" stroke="#1b4f5c" stroke-width="34" fill="none" opacity=".8"/>
        ${pins}
      </svg>
      <div class="map-side">
        <h4>LOCATION</h4><div class="map-sel">—</div>
        <h4>TIME</h4>
        <div class="map-times">${caseData.timeSlots.map(t => `<button data-time="${t}">${t}</button>`).join('')}</div>
        <div class="spacer"></div>
        <button class="btn" data-confirm disabled>Confirm position</button>
        <button class="btn btn-ghost" data-back>Back to board</button>
      </div>
    </div>
  </div>`;

  const confirm = root.querySelector('[data-confirm]');
  const refresh = () => { confirm.disabled = !(place && time); };

  root.querySelectorAll('.map-place').forEach(g => g.addEventListener('click', () => {
    place = g.dataset.place;
    root.querySelectorAll('.map-place').forEach(o => o.classList.toggle('sel', o === g));
    root.querySelector('.map-sel').textContent = placeName(place);
    refresh();
  }));
  root.querySelectorAll('[data-time]').forEach(b => b.addEventListener('click', () => {
    time = b.dataset.time;
    root.querySelectorAll('[data-time]').forEach(o => o.classList.toggle('sel', o === b));
    refresh();
  }));
  confirm.onclick = () => onConfirm(place, time);
  root.querySelector('[data-back]').onclick = onBack;
}
