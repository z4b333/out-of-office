import { windowView } from '../ui/art.js';

const el = () => document.getElementById('window');

export function renderWindow(day) {
  el().innerHTML = windowView(day) + '<div class="laser hidden"></div>';
}

// Day 3: a red dot appears on the glass while the player looks through the scope.
export function setLaser(on) {
  el().querySelector('.laser')?.classList.toggle('hidden', !on);
}
