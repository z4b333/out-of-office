// Backstory delivered outside the cases: the prologue, phone history from before the game,
// the last tenant's drawer, and the DeskHire inbox. `day` = first day the item is available
// (0 = already there when the game starts).

export const PROLOGUE = [
  {
    kicker: 'ELEVEN MONTHS AGO',
    text: 'Brightline Support replaced its whole night shift with a chatbot. It had been trained on your calls. You got two weeks\' pay and a thank-you email signed by no one.',
  },
  {
    kicker: 'TEN MONTHS AGO',
    text: 'You moved to Harrow Bay, into a furnished one-bedroom on Elm St.: Apartment 4B. The last tenant left in a hurry. He left a desk, a drawer full of things, and a chipped blue mug.',
  },
  {
    kicker: 'THREE WEEKS AGO',
    text: 'An app called DeskHire found you. "Work from home. Flexible hours. Your judgment, valued." First you sat in on meetings. Then you translated letters. The pay kept going up.',
  },
  {
    kicker: 'THIS WEEK',
    text: 'Rent is $1,200, due Friday at noon. You have $50. DeskHire says you\'ve been promoted.',
  },
];

// Already on the phone, already read, when the game starts. `me` = sent by the player.
export const PHONE_HISTORY = [
  { from: 'dale', text: 'Welcome to 4B! Last guy left some stuff in the desk drawer. Toss whatever you want.' },
  { from: 'dale', text: 'Also the radiator knocks at night. It\'s fine. Probably.' },
  { from: 'mom', text: 'Are you settled in? Send pics of the new place!' },
  { from: 'mom', text: 'It\'s small but it has a nice window', me: true },
  { from: 'mom', text: 'Proud of you. Something better will come along ❤️' },
  { from: 'hira', text: 'Welcome to DeskHire, {USER}! 💜 Your first gig is ready: MeetUp, Professional Meeting Attendee.' },
  { from: 'hira', text: 'Great work on Postbox! Your translations have a real human touch 💜' },
  { from: 'mom', text: 'How is the app job? Is it legit? Your aunt says those are scams' },
  { from: 'mom', text: 'It\'s fine Mom. It\'s just meetings and letters.', me: true },
];

// The last tenant's things. One new item turns up each day.
export const DRAWER = [
  {
    id: 'lease', day: 1, title: 'Lease, Unit 4B',
    text: 'RESIDENTIAL LEASE · ELM ST. · UNIT 4B\n\nTenant: Kai Lindqvist\nSigned: 13 months ago\nEmergency contact: Ana Lindqvist (sister)\n\nSomeone has scribbled over Ana\'s phone number until the pen tore the paper.',
  },
  {
    id: 'cards', day: 2, title: 'MeetUp cue cards',
    text: 'A stack of index cards held with a rubber band.\n\nMR. PRESCOTT · APPROVED REACTIONS\n- slow nod (agreement)\n- "Let\'s circle back."\n- short laugh, 0.8 sec\n- never look at the window\n\nThe last card, in different handwriting: "why does he never blink when I don\'t?"',
  },
  {
    id: 'photo', day: 3, title: 'Photo-booth strip',
    text: 'Four frames. A man and a woman pulling faces. In the last one he holds up a chipped blue mug like a trophy. She is wearing a yellow raincoat.\n\nOn the back: "K + A, Old Market fair. Don\'t lose the mug, it was Dad\'s."',
  },
  {
    id: 'note', day: 4, title: 'Note taped under the drawer',
    text: 'If you\'re reading this, they\'ve moved you to OVERWATCH.\n\nThey learn faster from the small things. How you hum. How long you hesitate. What you do when nobody is on the line.\n\nThey\'ll give you a last package. I won\'t tell you who\'s in it. Just: don\'t press it.\n\n— K.',
  },
  {
    id: 'key', day: 5, title: 'A brass key',
    text: 'It was taped inside the drawer\'s back panel. You only found it because the drawer stuck.\n\nTag: ROOF · ELM ST.\nOn the back, in K.\'s handwriting: "for whoever\'s next. down, not up."',
  },
];

// DeskHire inbox on the laptop.
export const INBOX = [
  {
    id: 'welcome', day: 0, from: 'DeskHire', subject: 'Welcome to DeskHire 💜',
    body: 'Hi {USER}!\n\nWelcome to the future of work. At DeskHire, your judgment is valued, and we mean that literally.\n\nGigs are matched to you by our assistant, Hira. The better you do, the more interesting your work becomes.\n\nAll sessions may be recorded for quality and training purposes.\n\n💜 The DeskHire Team',
  },
  {
    id: 'meetup', day: 0, from: 'MeetUp', subject: 'Matched: Mr. R. Prescott',
    body: 'You\'ve been matched as stand-in attendee for Mr. R. Prescott (Prescott Holdings).\n\nMr. Prescott prefers cameras on. Please use the approved reaction sheet. Do not comment on his background.\n\nThank you for helping Mr. Prescott be everywhere at once.',
  },
  {
    id: 'postbox', day: 0, from: 'Postbox', subject: 'New pen-pal pairing: A.L. ↔ Theo',
    body: 'You will translate both sides of this correspondence.\n\nFor your convenience, Theo\'s replies are pre-drafted. Please translate them as written.\n\nA.L. has asked several times about "the person in 4B." This is not relevant to your task.',
  },
  {
    id: 'tos', day: 1, from: 'DeskHire Legal', subject: 'We\'ve updated our Terms of Service',
    body: 'Section 14 has changed. By continuing to work, you agree.\n\n§14.2 The Contractor consents to the creation of a Derivative Behavioral Model ("DBM") from session recordings.\n§14.3 The DBM may continue to perform services after the Contractor\'s engagement ends.\n§14.4 The Contractor waives any claim to the DBM\'s earnings, decisions, or correspondence.\n§14.5 This includes correspondence with family members.',
  },
  {
    id: 'investor', day: 2, from: 'halcyon-ir@halcyon.partners', subject: 'Q3 investor note (internal, do not forward)',
    body: 'SPOTTER-2 remains on track for licensing next quarter.\n\nEach analyst contributes ~4,000 labeled decisions per evaluation week. Final-week performance under self-referential targeting is our strongest signal of reliability.\n\nContractor retention is not a concern. Replacement is the product.\n\nPrescott Holdings continues to operate normally. Mr. Prescott\'s schedule is fully booked.',
  },
  {
    id: 'wellness', day: 3, from: 'Hira', subject: 'Your weekly wellness check-in 💜',
    body: 'Hi {USER}!\n\nWe noticed you hum when calls go quiet. We\'ve added it to your profile. It\'s the small things that make you, you!\n\nWe also noticed you\'ve been sleeping less. Your 3:33 AM phone activity has been flagged. Rest is important 💜',
  },
  {
    id: 'bounce', day: 4, from: 'Mail Delivery System', subject: 'Undeliverable: "please"',
    body: 'Your message could not be delivered to kai.lindqvist@deskhire.work.\n\nReason: account converted to model (SPOTTER-1 / K).\n\n----- Original message -----\nFrom: Ana Lindqvist\n\nKai, it\'s Ana. Someone keeps answering your phone. It sounds like you but it isn\'t you. If you\'re still in there, answer me. Please.',
  },
  {
    id: 'handler', day: 5, from: 'DeskHire', subject: 'You\'ve been shortlisted 💜',
    body: 'Congratulations, {USER}!\n\nTop contractors are offered Handler status at the end of their evaluation week. Handlers onboard and supervise new talent in their region.\n\nPrevious candidate for your region: K. Lindqvist (declined).\n\nWe hope you\'ll make a different choice 💜',
  },
];
