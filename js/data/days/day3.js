// WEDNESDAY: "The Letters". Target: Ana Lindqvist, Kai's sister and Reyes's source.
export default {
  id: 'OW-0312',
  day: 3,
  title: 'The Letters',
  timerSec: 90,
  briefing: [
    'Spotter. The client is very pleased.',
    'A woman has been passing the client\'s private correspondence to outsiders. Identify her before the handoff.',
    'Some files arrived redacted. Coffee clears them.',
    'You have 90 seconds once the packet opens. Click your mug to buy time.',
  ],
  suspects: [
    { id: 'ana', name: 'Ana Lindqvist', role: 'Courier (documents)' },
    { id: 'chen', name: 'Mira Chen', role: 'Postal clerk' },
    { id: 'grant', name: 'Hollis Grant', role: 'Night guard' },
    { id: 'price', name: 'Dana Price', role: 'Barista' },
    { id: 'marsh', name: 'Teo Marsh', role: 'Student' },
  ],
  evidence: [
    {
      id: 'e1', type: 'photo', photo: 'postoffice', title: 'Post office CCTV',
      content: 'CAM 01 · Old Market Post Office · Wed 16:05\n\nA woman in a yellow raincoat posts a thick envelope of letters. Hood up. Face hidden.',
    },
    {
      id: 'e2', type: 'log', title: 'Post office badge log',
      content: 'BADGE LOG · Old Market PO\n\nM. Chen · counter 3\nIN 15:00 · OUT 20:00\nNo breaks recorded.',
    },
    {
      id: 'e3', type: 'receipt', title: 'Raincoat receipt',
      content: 'HARBOR OUTFITTERS\n\n1× raincoat, yellow, size S .... $68\nLoyalty member: A. LINDQVIST',
    },
    {
      id: 'e4', type: 'ticket', title: 'Bus ticket',
      content: 'HARROW BAY TRANSIT\nRoute 12 → Northgate\nDep. 15:50 · Wed\n\nPass holder: H. GRANT',
    },
    {
      id: 'e5', type: 'post', title: '@dana.pours',
      content: '@dana.pours · 5h\n\ndouble shift at Lantern Café 12–20 ☕ send help (and oat milk)',
    },
    {
      id: 'e6', type: 'log', title: 'Library entry log',
      content: 'CENTRAL LIBRARY · ENTRY GATE\n\nT. Marsh · IN 14:30 · OUT 18:00',
    },
    {
      id: 'e7', type: 'photo', photo: 'parkDay', title: 'Riverside Park CCTV',
      content: 'CAM 07 · Riverside Park · Wed 11:00\n\nA man in a yellow jacket feeds pigeons. Unrelated to anything, as far as anyone can tell.',
    },
    {
      id: 'e8', type: 'letter', title: 'Intercepted letter', redacted: true,
      content: s => (s.fates.reyes === 'warned' ? 'Jonah,' : 'To whoever is still listening,') +
        '\n\nI\'m sending the rest of the letters. You deserve to know who has been reading them.\n\nMeet me at the {{Riverside Park bandstand}} at {{20:00}}. Come alone.\n\n— A.\n\nP.S. Tell the translator in 4B I said hi. The one with [[a_mug|the chipped blue mug. It was my brother\'s.]]',
    },
    {
      id: 'e9', type: 'receipt', title: 'Parking ticket',
      content: 'CITY OF HARROW BAY · PARKING\n\nElm St. · Wed 16:00\nVehicle: grey van, plate [[a_van|DH-0003]]\nDuration: 3 days (unpaid)',
    },
    {
      id: 'e10', type: 'letter', title: 'Postbox archive #2291',
      content: 'POSTBOX · TRANSLATION ARCHIVE · 2 weeks ago\n\nA.L. → pen pal: "Who lives in 4B now? Are they kind?"\nTranslated by: {USER}\n\nReply, sent as "Theo": "They\'re fine. [[a_theo|Honestly? It\'s a lot. Let\'s circle back.]]"\n\nYou translated the question. You never wrote that reply.',
    },
  ],
  deductions: [
    { a: 'e2', b: 'e1', type: 'time', reveals: 'Chen was behind counter 3 for her whole shift. She isn\'t the woman at the slot.', eliminates: ['chen'] },
    { a: 'e4', b: 'e1', type: 'time', reveals: 'Grant\'s bus left fifteen minutes before the footage. He was on Route 12.', eliminates: ['grant'] },
    { a: 'e5', b: 'e1', type: 'time', reveals: 'Price was in the middle of a double shift at Lantern Café.', eliminates: ['price'] },
    { a: 'e6', b: 'e1', type: 'time', reveals: 'Marsh was inside the library until 18:00.', eliminates: ['marsh'] },
    { a: 'e3', b: 'e1', type: 'person', reveals: 'The yellow raincoat was bought by A. Lindqvist.', eliminates: [] },
    { a: 'e3', b: 'e8', type: 'person', reveals: '"A." Lindqvist signs her letters with an initial.', eliminates: [] },
    { a: 'e8', b: 'e10', type: 'person', reveals: 'Ana has been writing to whoever lives in 4B. Your apartment.', eliminates: [] },
  ],
  target: { suspect: 'ana', place: 'park', time: '20:00' },
  timeSlots: ['16:00', '18:00', '20:00', '22:00'],
  scope: {
    scene: 'park',
    line: 'Yellow raincoat at the bandstand. She is carrying letters. Confirm.',
    after: 'OVERWATCH: Correspondence recovered. Clean work, Spotter.',
  },
  warnAnomaly: 'a_mug',
  anomalies: {
    a_mug: {
      title: 'The chipped blue mug',
      text: 'Ana\'s letter: "the translator in 4B, the one with the chipped blue mug. It was my brother\'s." My mug came with the apartment.',
    },
    a_van: {
      title: 'Grey van, DH-0003',
      text: 'Parked on Elm St., MY street, for three days. DH. DeskHire. They\'re not watching the targets. They\'re watching me.',
    },
    a_theo: {
      title: 'Theo talks like me',
      text: '"Honestly? It\'s a lot. Let\'s circle back." I say that on every MeetUp call. Theo wrote it in a letter I never saw.',
    },
  },
  eveningNote: r => ({
    go: 'Overwatch: "Correspondence recovered." Fourteen letters, now in a DeskHire evidence locker.',
    warn: 'A.L. reads your text at 19:51. At 20:00 the bandstand is empty.',
  }[r.outcome] || 'Overwatch: "SPOTTER-2 confirmed target, 20:09." Fourteen letters recovered.'),
  reward: { base: 250, heatPenalty: 30, cleanBonus: 25 },
};
