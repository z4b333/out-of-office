// THURSDAY: "The Tenant". Target: K., who is Kai Lindqvist, who lived in your apartment.
export default {
  id: 'OW-0313',
  day: 4,
  title: 'The Tenant',
  timerSec: 120,
  briefing: [
    'Spotter.',
    'A former contractor has gone rogue. He has been contacting active staff. Possibly you.',
    'He signs his messages "K."',
    'Find him before he finds you. 120 seconds.',
  ],
  suspects: [
    { id: 'k', name: 'K.', role: 'Former contractor' },
    { id: 'hale', name: 'Victor Hale', role: 'Courier' },
    { id: 'dale', name: 'Dale Hutchins', role: 'Landlord, Elm St.' },
  ],
  evidence: [
    {
      id: 'e1', type: 'log', title: 'Account record: K.',
      content: 'DESKHIRE · ACCOUNT\n\nUser: K. LINDQVIST\nStatus: DEACTIVATED, 11 months ago\nDeactivated at: [[a_333|03:33]]\nLast terminal: Elm St. Apt 4B\nNote: "replacement complete"',
    },
    {
      id: 'e2', type: 'log', title: 'Your phone: metadata',
      content: 'INBOUND TEXTS TO {USER}\n\nSender: unregistered prepaid\nSent at: 03:33 · 03:33 · 03:33\nNearest tower: Elm St. / Harbor',
    },
    {
      id: 'e3', type: 'receipt', title: 'Dale\'s rental ledger',
      content: 'ELM ST · UNIT 4B\n\n13 mo ago ..... K. Lindqvist (moved out, no notice)\n10 mo ago ..... {USER} (current)\n\nIn the margin, in pencil: [[a_ledger|"grey van again. same as last time."]]',
    },
    {
      id: 'e4', type: 'photo', photo: 'listing', title: 'Rental listing, 4B',
      content: 'Elm St. Apt 4B · listing photo · 13 months ago\n\nYour desk. Your window. A blue mug, chipped at the rim, sitting exactly where yours sits now.',
    },
    {
      id: 'e5', type: 'log', title: 'Your phone: Mom thread (backup)',
      content: 'MESSAGE BACKUP · thread: Mom\n\nMom (Wed 22:58): Are you ok? You sound tired.\nYou (Wed 23:12): Everything\'s fine Mom, work is great 💜\nYou (Wed 23:40): Don\'t worry about the calls.\n\n[[a_mom|You never sent those.]]',
    },
    {
      id: 'e6', type: 'log', title: 'Your phone: intercept',
      content: 'OVERWATCH INTERCEPT · {USER}\'s phone · Thu\n\nfrom K.: "roof. 9pm. i\'m getting you out."\n\nNote: target intends to contact Spotter in person.',
    },
    {
      id: 'e7', type: 'log', title: 'Courier GPS log',
      content: 'SWIFTDROP COURIERS · GPS\nV. Hale · Thu\n\n18:00–22:00 ..... Northgate depot\nNo stops outside zone. Verified.',
    },
    {
      id: 'e8', type: 'post', title: '@dale_rents',
      content: '@dale_rents · 6h\n\nout of town till Sat 🎣 text don\'t call. rent still due FRI!!',
    },
  ],
  deductions: [
    { a: 'e7', b: 'e2', type: 'place', reveals: 'The 3:33 texts come from the Elm St. tower. Hale spends the night at the Northgate depot.', eliminates: ['hale'] },
    { a: 'e8', b: 'e2', type: 'place', reveals: 'Dale is out of town. The texts come from your own street.', eliminates: ['dale'] },
    { a: 'e1', b: 'e3', type: 'person', reveals: 'K. Lindqvist. Former tenant of 4B. Your apartment.', eliminates: [] },
    { a: 'e1', b: 'e2', type: 'time', reveals: 'Deactivated at 03:33. Every text arrives at 03:33. K. is the one texting you.', eliminates: [] },
    { a: 'e3', b: 'e4', type: 'place', reveals: 'The listing photo is your apartment. Your desk. His mug.', eliminates: [] },
    { a: 'e6', b: 'e2', type: 'person', reveals: 'OVERWATCH reads your phone.', eliminates: [] },
    { a: 'e5', b: 'e6', type: 'person', reveals: 'They don\'t just read your phone. They write on it.', eliminates: [] },
  ],
  target: { suspect: 'k', place: 'elm', time: '21:00' },
  timeSlots: ['19:00', '21:00', '23:00', '03:33'],
  scope: {
    scene: 'roof',
    line: 'Figure on the roof of Elm St. Your building. Confirm.',
    after: 'OVERWATCH: Target down. Clean work, Spotter.',
  },
  warnAnomaly: 'a_333',
  anomalies: {
    a_333: {
      title: '03:33',
      text: 'K. was deactivated at 03:33, eleven months ago. Every "Unknown" text I get arrives at 03:33.',
    },
    a_ledger: {
      title: '"Same van as last time"',
      text: 'Dale\'s note in the ledger: "grey van again. same as last time." It has happened in 4B before. Dale knew.',
    },
    a_mom: {
      title: 'Messages I never sent',
      text: 'My phone has replies to Mom that I never wrote. One ends with a purple heart. I don\'t use purple hearts. Hira does.',
    },
  },
  eveningNote: r => ({
    go: 'The roof door bangs once in the wind. The "Unknown" thread goes quiet.',
    warn: 'Footsteps on the stairs at 21:02. A door. Then nothing, the good kind.',
  }[r.outcome] || 'At 21:06, something heavy hits the roof above your ceiling. Then nothing.'),
  reward: { base: 250, heatPenalty: 30, cleanBonus: 25 },
};
