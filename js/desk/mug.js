import { state, save } from '../core/state.js';
import { emit } from '../core/bus.js';
import { toast } from './desk.js';

const MAX = 3;

export function initMug() {
  document.getElementById('mug').addEventListener('click', () => emit('mug:click'));
  renderMug();
}

export function renderMug() {
  document.getElementById('mug').style.setProperty('--fill', String(state.coffee / MAX));
}

export function refillCoffee() {
  state.coffee = MAX;
  renderMug();
}

export function spendCoffee(n = 1) {
  if (state.coffee < n) {
    toast('☕ The mug is empty.');
    return false;
  }
  state.coffee -= n;
  renderMug();
  save();
  return true;
}
