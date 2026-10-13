// Tiny pub/sub so desk props and apps don't import each other.
const handlers = {};

export function on(evt, fn) {
  (handlers[evt] ||= []).push(fn);
  return () => off(evt, fn);
}

export function off(evt, fn) {
  handlers[evt] = (handlers[evt] || []).filter(h => h !== fn);
}

export function emit(evt, data) {
  (handlers[evt] || []).slice().forEach(fn => fn(data));
}
