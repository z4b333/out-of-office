// FRIDAY: "The Terminal". Rent day. Target: you.
export default {
  id: 'OW-0314',
  day: 5,
  title: 'The Terminal',
  final: true,
  timerSec: 0,
  briefing: [
    'Spotter.',
    'Final package. You know this one better than anyone.',
    'A subject has been accessing restricted client files from a residential terminal. Reading things they shouldn\'t. Taking notes.',
    s => s.bonusCancelled ? 'Clear the names. Call it.' : 'Clear the names. Call it. The $5,000 bonus is yours.',
  ],
  suspects: [
    { id: 'you', name: '{USER}', role: 'DeskHire contractor' },
    { id: 'k', name: 'K. Lindqvist', role: s => s.fates.k === 'warned' ? 'Former contractor (whereabouts unknown)' : 'Former contractor (deceased)' },
    { id: 'prescott', name: 'R. Prescott', role: 'Client' },
    { id: 'theo', name: 'Theo Wren', role: 'Pen pal' },
  ],
  evidence: [
    {
      id: 'e1', type: 'photo', photo: 'windowExt', title: 'Residential surveillance',
      content: 'LONG LENS · Elm St. Apt 4B · Fri, now\n\nSubject at a desk. Laptop open. A blue mug, [[a_chip|chipped at the rim]].\n\nPhoto taken from street level, from inside a parked van.',
    },
    {
      id: 'e2', type: 'log', title: 'DeskHire session log',
      content: 'DESKHIRE · ACTIVE SESSIONS\n\nUser: {USER}\nTerminal: Elm St. Apt 4B\nGigs: MeetUp, Postbox, OVERWATCH\nStatus: ONLINE NOW',
    },
    {
      id: 'e3', type: 'log', title: 'Account record: K.',
      content: s => 'DESKHIRE · ACCOUNT\n\nUser: K. LINDQVIST\nLast terminal: Elm St. Apt 4B\nStatus: DEACTIVATED\n' +
        (s.fates.k === 'warned' ? 'Thu 21:02: target lost (OVERWATCH)' : 'Thu 21:04: target confirmed (OVERWATCH)') +
        '\nNote: "replacement complete"',
    },
    {
      id: 'e4', type: 'log', title: 'Death record',
      content: 'HARROW BAY REGISTRY · DEATH CERTIFICATE\n\nRhys Prescott\nDied: 2 years ago · cardiac arrest\nReported by: [[a_dead|Hira Systems Ltd.]]\n\nMeetings "attended" since: 412',
    },
    {
      id: 'e5', type: 'letter', title: 'Letter from Theo',
      content: 'Hey you,\n\nSorry, I keep thinking about your chipped blue mug. And that song you hum when a call goes quiet.\n\n— Theo\n\n[metadata] generated_from: MeetUp/recordings/{USER}/*.mp4 · model: SPOTTER-2',
    },
    {
      id: 'e6', type: 'notebook', photo: 'notebook', title: 'Your notebook',
      content: s => s.clues.length
        ? 'Recovered from the subject\'s desk:\n\n' + s.clues.map(c => '• ' + c.title).join('\n')
        : 'Recovered from the subject\'s desk:\n\n(Empty. You never wrote anything down. Someone else did.)',
    },
  ],
  deductions: [
    { a: 'e3', b: 'e2', type: 'place', reveals: 'K. worked from this same terminal. He can\'t be the one at that desk tonight.', eliminates: ['k'] },
    { a: 'e4', b: 'e1', type: 'person', reveals: 'Prescott has been dead for two years. He can\'t be the person at that desk.', eliminates: ['prescott'] },
    { a: 'e5', b: 'e2', type: 'person', reveals: 'Theo is generated from {USER}\'s call recordings. Theo isn\'t a person.', eliminates: ['theo'] },
    { a: 'e1', b: 'e2', type: 'place', reveals: 'The surveillance photo and the active terminal are the same apartment.', eliminates: [] },
    { a: 'e6', b: 'e1', type: 'person', reveals: 'Every note in that notebook points back to this desk.', eliminates: [] },
  ],
  target: { suspect: 'you', place: 'elm', time: 'Now' },
  timeSlots: ['19:00', '21:00', 'Now', '03:33'],
  scope: { scene: 'windowExt', line: 'Subject at the desk. You know what to do, Spotter. Confirm.' },
  anomalies: {
    a_chip: {
      title: 'Chipped at the rim',
      text: 'My mug. Kai\'s mug. In their photo, taken tonight.',
    },
    a_dead: {
      title: 'Reported by Hira',
      text: 'Prescott died two years ago, and the one who reported it was Hira Systems. Hira has been the client all along.',
    },
  },
  reward: { base: 5000, heatPenalty: 0, cleanBonus: 0 },
};
