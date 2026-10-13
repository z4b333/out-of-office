// MONDAY: "The Leak". Tutorial. No sniper, just an HR flag. Okafor dies anyway.
export default {
  id: 'OW-0310',
  day: 1,
  title: 'The Leak',
  callType: 'flag',
  timerSec: 0,
  briefing: [
    'Spotter. Welcome to OVERWATCH. We protect high-value clients.',
    'This afternoon, our client Mr. R. Prescott had his private schedule leaked to a journalist.',
    'Find the leak. No sniper today: just flag them. HR will handle the rest.',
    'HOW TO: click a red pin, then a second pin, then choose how they connect. Click a card to read it. Drag cards to rearrange. If anything in a file feels off, click it to write it in your notebook.',
  ],
  suspects: [
    { id: 'okafor', name: 'Paul Okafor', role: 'Hotel concierge' },
    { id: 'hale', name: 'Victor Hale', role: 'Courier' },
    { id: 'ito', name: 'Lena Ito', role: 'Front desk' },
  ],
  evidence: [
    {
      id: 'e1', type: 'email', title: 'Anonymous tip to J. Reyes',
      content: 'From: terminal-3@kesslerhotel.com\nTo: j.reyes@harrowbaypost.com\nSent: Mon 14:20\n\n"He\'s never actually here. Check the schedule. Check the door."\n\nAttached: prescott_itinerary.pdf',
    },
    {
      id: 'e2', type: 'log', title: 'Staff terminal 3 sign-in',
      content: 'KESSLER · STAFF TERMINAL 3\n\nMon 14:11 – 14:26 ..... P. OKAFOR\nMon 14:26 – 18:00 ..... (idle)',
    },
    {
      id: 'e3', type: 'photo', photo: 'suite', title: 'Corridor CCTV, floor 12',
      content: 'CAM 12 · Kessler 12th floor · Mon 14:02\n\nThe concierge swipes his master key at Suite 1201: Mr. Prescott, permanent resident. The light turns green. He waits. He doesn\'t go in.',
    },
    {
      id: 'e4', type: 'log', title: 'Suite 1201 door sensor',
      content: 'SUITE 1201 · DOOR SENSOR · LAST 30 DAYS\n\nKeycard accepted: Mon 14:02 (master key)\nDoor opened: [[a_room|0 times. Not once in thirty days. Not even housekeeping.]]',
    },
    {
      id: 'e5', type: 'log', title: 'Prescott itinerary (the attachment)',
      content: 'R. PRESCOTT · MONDAY\n\n10:00 Board review ....... MeetUp\n13:00 Investor call ...... MeetUp\n16:00 Press prep ......... MeetUp\n\nIn-person meetings this quarter: none\nStand-in on all calls: [[a_prescott|{USER} (DeskHire contractor)]]',
    },
    {
      id: 'e6', type: 'log', title: 'Courier GPS log',
      content: 'SWIFTDROP COURIERS · GPS\nV. Hale · Mon\n\n13:00–17:00 ..... Old Market district\nNo stops outside zone. Verified.',
    },
    {
      id: 'e7', type: 'receipt', title: 'Lantern Café receipt',
      content: 'LANTERN CAFÉ · Mon 14:18\n\n1× oat latte ........ $5.20\nCARDHOLDER: L. ITO\n\n(Lantern Café is across the street from the Kessler.)',
    },
  ],
  deductions: [
    { a: 'e1', b: 'e6', type: 'time', reveals: 'Hale was across town in Old Market when the tip went out at 14:20.', eliminates: ['hale'] },
    { a: 'e1', b: 'e7', type: 'time', reveals: 'Ito was paying for a latte across the street at 14:18. She wasn\'t at terminal 3.', eliminates: ['ito'] },
    { a: 'e1', b: 'e2', type: 'time', reveals: 'The tip left terminal 3 at 14:20, while Okafor was signed in.', eliminates: [] },
    { a: 'e3', b: 'e4', type: 'place', reveals: 'Okafor swiped the suite door. The sensor says it never opened. He was checking whether anyone lives there.', eliminates: [] },
    { a: 'e3', b: 'e2', type: 'person', reveals: 'Okafor went from Suite 1201 to the staff terminal in nine minutes.', eliminates: [] },
  ],
  target: { suspect: 'okafor' },
  anomalies: {
    a_room: {
      title: 'The door that never opens',
      text: 'Suite 1201 is Prescott\'s permanent residence. Its door hasn\'t opened in thirty days. Nobody lives there.',
    },
    a_prescott: {
      title: 'Prescott only exists on MeetUp',
      text: 'Every meeting he "attended" this quarter was a MeetUp call, and I was his stand-in on all of them. Has anyone ever seen him in person?',
    },
  },
  eveningNote: r => r.outcome === 'go'
    ? 'Out of curiosity, you check the Kessler staff page. Paul Okafor\'s profile now returns 404.'
    : 'Overwatch log: "Reassigned to SPOTTER-2. Flag filed 19:02." Paul Okafor\'s staff profile now returns 404.',
  reward: { base: 150, heatPenalty: 25, cleanBonus: 25 },
};
