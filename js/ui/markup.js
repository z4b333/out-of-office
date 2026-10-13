import { fmt, esc } from '../core/state.js';

// Content markup:
//   [[anomalyId|text]]  → clickable anomaly the player can write down
//   {{text}}            → redacted until unredacted with coffee
//   {USER}              → player's username
export function renderMarkup(text, { unredacted = true } = {}) {
  let out = esc(fmt(text));
  out = out.replace(/\[\[(\w+)\|([^\]]+)\]\]/g,
    (_, id, t) => `<span class="anomaly" data-anomaly="${id}">${t}</span>`);
  out = out.replace(/\{\{([^}]+)\}\}/g,
    (_, t) => unredacted
      ? `<mark class="unredacted">${t}</mark>`
      : `<span class="redacted">${'█'.repeat(Math.max(4, t.length))}</span>`);
  return out.replace(/\n/g, '<br>');
}
