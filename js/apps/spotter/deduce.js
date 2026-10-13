// Validates player links against the case's deductions and tracks eliminated suspects.
export function createDeducer(caseData) {
  const key = (a, b, type) => [a, b].sort().join('|') + '|' + type;
  const byKey = new Map(caseData.deductions.map(d => [key(d.a, d.b, d.type), d]));
  const found = new Set();
  const eliminated = new Set();

  return {
    tryLink(a, b, type) {
      const k = key(a, b, type);
      const d = byKey.get(k);
      if (!d) return { status: 'wrong' };
      if (found.has(k)) return { status: 'duplicate', deduction: d };
      found.add(k);
      d.eliminates.forEach(id => eliminated.add(id));
      return { status: 'correct', deduction: d };
    },
    isEliminated: id => eliminated.has(id),
    remaining: () => caseData.suspects.filter(s => !eliminated.has(s.id)),
  };
}
