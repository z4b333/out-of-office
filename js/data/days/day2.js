// TUESDAY: "The Shadow". Wren, the "non-lethal deterrent", is introduced. Target: Jonah Reyes.
export default {
  id: 'OW-0311',
  day: 2,
  title: 'The Shadow',
  timerSec: 0,
  briefing: [
    'Spotter. Quick work yesterday. The client is pleased.',
    'Today a man is shadowing Mr. Prescott around the Kessler Hotel. Our deterrent specialist, Wren, is on standby.',
    'Wren is non-lethal. A warning, nothing more.',
    'Find him. Find where he will be. Call it.',
  ],
  suspects: [
    { id: 'reyes', name: 'Jonah Reyes', role: 'Freelance journalist' },
    { id: 'hale', name: 'Victor Hale', role: 'Courier' },
    { id: 'bell', name: 'Marcus Bell', role: 'Hotel guest' },
  ],
  evidence: [
    {
      id: 'e1', type: 'photo', photo: 'lobby', title: 'Kessler lobby CCTV',
      content: 'CAM 03 · Kessler Hotel lobby · Tue 19:10\n\nA man in a grey coat with a press lanyard watches the client\'s elevator for forty minutes. The client never comes down.\n\nReflected in the lobby glass: [[a_rain|a rain-streaked window, on a night with no rain]].',
    },
    {
      id: 'e2', type: 'receipt', title: 'Lantern Café receipt',
      content: 'LANTERN CAFÉ · Tue 18:42\n\n1× flat white ....... $4.50\nCARD ****4471\nCARDHOLDER: J. REYES',
    },
    {
      id: 'e3', type: 'log', title: 'Guest folio, Room 804',
      content: 'KESSLER · GUEST FOLIO\n\nM. Bell · Room 804\nChecked out: Tue 17:30\nAirport taxi: 17:45 (pickup confirmed)',
    },
    {
      id: 'e4', type: 'post', title: '@jreyes_writes',
      content: '@jreyes_writes · 2h\n\nBig story about a "work from home" company that isn\'t what it seems. Press badge on, staking out the Kessler.\n\nMeeting my source at the Pier 9 ferry gate tonight, 21:00. 👀',
    },
    {
      id: 'e5', type: 'log', title: 'Courier GPS log',
      content: 'SWIFTDROP COURIERS · GPS\nV. Hale · Tue\n\n18:00–21:00 ..... Old Market district\nNo stops outside zone. Verified.',
    },
    {
      id: 'e6', type: 'letter', title: 'Reyes\'s notebook (photographed)',
      content: 'Photographed over his shoulder at Lantern Café, Tue 18:40.\n\nDESKHIRE = HALCYON?\n- Prescott: nobody has seen him in person. Why?\n- Source: [[a_source|A.L., courier, has the letters]]\n- [[a_okafor|Okafor stopped answering. Monday.]]\n- Pier 9, 21:00',
    },
  ],
  deductions: [
    { a: 'e3', b: 'e1', type: 'time', reveals: 'Bell was in an airport taxi long before 19:10. Not him.', eliminates: ['bell'] },
    { a: 'e5', b: 'e1', type: 'time', reveals: 'Hale\'s GPS puts him in Old Market at 19:10.', eliminates: ['hale'] },
    { a: 'e4', b: 'e1', type: 'person', reveals: 'Press badge, staking out the Kessler: the man in the lobby is Reyes.', eliminates: [] },
    { a: 'e2', b: 'e4', type: 'person', reveals: 'Card ****4471 belongs to J. Reyes.', eliminates: [] },
    { a: 'e6', b: 'e4', type: 'person', reveals: 'The notebook is Reyes\'s. Same story, same pier, same time.', eliminates: [] },
  ],
  target: { suspect: 'reyes', place: 'pier9', time: '21:00' },
  timeSlots: ['19:00', '21:00', '23:00', '07:00'],
  scope: {
    scene: 'pier',
    line: 'Target at the ferry gate. Grey coat, lanyard. Confirm.',
    after: 'OVERWATCH: Deterrent delivered. Clean work, Spotter.',
  },
  warnAnomaly: 'a_okafor',
  anomalies: {
    a_rain: {
      title: 'The rain window',
      text: 'The Kessler lobby glass reflects rain on a dry night. Prescott\'s window on MeetUp always shows rain too. The exact same rain, frame for frame.',
    },
    a_source: {
      title: '"A.L., courier"',
      text: 'Reyes\'s source. Someone who has "the letters." Which letters?',
    },
    a_okafor: {
      title: 'Okafor stopped answering',
      text: 'On Monday. The day I flagged him. "HR will handle it."',
    },
  },
  eveningNote: r => ({
    go: 'Overwatch: "Deterrent delivered." Reyes\'s last post is still up. No new ones.',
    warn: 'Reyes\'s account goes private at 20:58. Overwatch logs you as "connection lost" for four minutes.',
  }[r.outcome] || 'Overwatch: "SPOTTER-2 confirmed target, 21:47." Same pier, same man, just without you.'),
  reward: { base: 250, heatPenalty: 30, cleanBonus: 25 },
};
