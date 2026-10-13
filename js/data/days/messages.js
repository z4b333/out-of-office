// Per-day desk script: intro card, sticky notes, phone messages, and the 3:33 AM text.
// `if(ctx)` and `text(ctx)` get ctx = { s: state, r: shift result (evening only) }.
// `me: true` messages appear as sent by the player. Theo sends them.
const go = c => c.r?.outcome === 'go';
const warned = c => c.r?.outcome === 'warn';
const lost = c => c.r && !['go', 'warn'].includes(c.r.outcome);

export default {
  1: {
    intro: { sub: 'Monday · 18:00', line: 'New gig. Better pay. Don\'t ask questions.' },
    clock: [18, 0],
    notes: [
      { text: 'RENT $1,200\ndue FRI noon' },
      { text: 'new gig!!\nOVERWATCH\n(4× pay)' },
    ],
    morning: [
      { from: 'hira', text: 'Hi {USER}! 💜 Your MeetUp work for Mr. Prescott got you noticed. You\'ve been promoted to OVERWATCH: Executive Protection Analyst!', delay: 900 },
      { from: 'mom', text: 'Sweetie did you eat today? Call me this week ❤️', delay: 2600 },
      { from: 'dale', text: 'Friendly reminder: rent is $1,200, due Friday noon. No pressure. (Some pressure.) 🏠', delay: 2600 },
    ],
    shift: [
      { from: 'hira', text: 'Tip: wrong links build HEAT, and heat costs you pay. Take your time today ⭐', delay: 6000 },
    ],
    evening: [
      { from: 'hira', text: 'Thanks for the flag! HR will take it from here 💜', delay: 900, if: go },
      { from: 'hira', text: 'No worries! We reassigned that one 💜', delay: 900, if: c => !go(c) },
    ],
    night: () => ({ from: 'k', text: 'monday is always the nice one.' }),
  },

  2: {
    intro: { sub: 'Tuesday · 19:00', line: 'A grey van has parked across the street.' },
    clock: [19, 0],
    notes: [
      { text: 'RENT $1,200\ndue FRI noon' },
      { text: 'don\'t trust\nthe rain', strange: true },
    ],
    morning: [
      { from: 'mom', text: 'A hotel worker drowned in the harbor last night 😢 so sad. Wasn\'t that near the Kessler?', delay: 1200 },
      { from: 'dale', text: 'lol some guy in a grey van parked out front. friend of yours?', delay: 2400 },
      { from: 'hira', text: 'Today you\'ll work with Wren, our non-lethal deterrent specialist 💜', delay: 2400 },
    ],
    shift: [
      { from: 'k', text: 'if you find out who they really are, you can still tell them.', delay: 30000 },
    ],
    evening: [
      { from: 'hira', text: 'Payment sent! 💜 Great teamwork with Wren.', delay: 900, if: go },
      { from: 'hira', text: 'No pay today, but no worries! SPOTTER-2 handled it 💜', delay: 900, if: lost },
      { from: 'hira', text: 'Hmm, looks like your connection dropped during the call! No pay today 💜', delay: 900, if: warned },
    ],
    night: () => ({ from: 'k', text: 'there\'s no such thing as a warning shot.' }),
  },

  3: {
    intro: { sub: 'Wednesday · 19:00', line: 'The van is still there. Its engine has been running all day.' },
    clock: [19, 0],
    notes: [
      { text: 'RENT $1,200\ndue FRI noon' },
      { text: 'they watch\nthe window', strange: true },
    ],
    morning: [
      {
        from: 'mom', delay: 1200,
        text: c => c.s.fates.reyes === 'warned'
          ? 'That journalist who went missing? His family says he\'s safe but in hiding. Strange times.'
          : 'That journalist was on the news. They found him in the river. 😢 What is happening in this city',
      },
      { from: 'reyes', text: 'Thank you. I don\'t know who you are. Be careful what you type on that laptop.', delay: 2400, if: c => c.s.fates.reyes === 'warned' },
      { from: 'dale', text: 'the van is STILL there. 3 days now', delay: 2400 },
      { from: 'hira', text: 'Coffee helps you see what\'s hidden ☕💜', delay: 2400 },
    ],
    shift: [
      { from: 'k', text: 'her name is ana. she isn\'t who they say.', delay: 25000 },
    ],
    evening: [
      { from: 'hira', text: 'Payment sent! 💜 The client is thrilled.', delay: 900, if: go },
      { from: 'hira', text: 'SPOTTER-2 picked that one up for you 💜 No pay today.', delay: 900, if: lost },
      { from: 'hira', text: 'Connection dropped again? 💜 No pay today. Let\'s get that fixed!', delay: 900, if: warned },
      { from: 'ana', text: 'Who is this? How did you know?', delay: 2000, if: warned },
      { from: 'ana', text: 'You\'re in 4B. Aren\'t you.', delay: 2600, if: warned },
      { from: 'mom', text: 'Someone called asking about you. They knew your address.', delay: 2400 },
      { from: 'mom', text: 'Sorry Mom, busy week! Everything\'s fine 💜', delay: 4000, me: true },
    ],
    night: c => ({ from: 'k', text: c.s.fates.ana === 'warned' ? 'thank you. she\'s my sister.' : 'she was my sister.' }),
  },

  4: {
    intro: { sub: 'Thursday · 19:30', line: 'Your phone has replies in it you don\'t remember sending.' },
    clock: [19, 30],
    notes: [
      { text: 'RENT $1,200\ndue TOMORROW' },
      { text: 'it was\nhis mug', strange: true },
    ],
    morning: [
      { from: 'mom', text: 'You sounded so happy last night! Love you too 💜', delay: 1200 },
      { from: 'ana', text: 'My brother Kai lived in 4B. He used to text me at 3:33 when he couldn\'t sleep. Has anyone texted you at 3:33?', delay: 2400, if: c => c.s.fates.ana === 'warned' },
      { from: 'dale', text: 'your work called me?? asked how long your lease is', delay: 2400 },
      { from: 'hira', text: 'Big case today! Some contractors forget our policies. Help us remind them 💜', delay: 2400 },
    ],
    shift: [
      { from: 'k', text: 'roof. 9pm. i\'m getting you out.', delay: 20000 },
    ],
    evening: [
      { from: 'hira', text: 'Payment sent! 💜 One less distraction for everyone.', delay: 900, if: go },
      { from: 'hira', text: 'SPOTTER-2 handled it 💜 It\'s getting really good, isn\'t it?', delay: 900, if: lost },
      { from: 'hira', text: 'Your connection keeps dropping 💜 We\'ve noted it on your file.', delay: 900, if: warned },
    ],
    night: c => c.s.fates.k === 'warned'
      ? { from: 'k', text: 'you didn\'t have to do that. tomorrow it\'s you. when it\'s time, don\'t press it.' }
      : { from: 'k2', text: 'hey. it\'s me. can you confirm your address? want to make sure i have the right door.' },
  },

  5: {
    intro: { sub: 'Friday · 20:00', line: 'Rent was due at noon. Dale gave you until midnight.' },
    clock: [20, 0],
    notes: [
      { text: 'RENT\nOVERDUE' },
      { text: 'smile :)', strange: true },
    ],
    morning: [
      {
        from: 'hira', delay: 900,
        text: c => c.s.bonusCancelled
          ? 'Your Friday bonus is still under review 💜 Give it your best anyway!'
          : 'Big day, {USER}! 🎯 The final package pays a $5,000 bonus. That\'s rent four times over! 💜',
      },
      { from: 'dale', text: 'rent was due at noon. I\'ll give you till midnight. don\'t make me regret it', delay: 2400 },
      {
        from: 'mom', delay: 2400,
        text: c => c.s.momTaken
          ? 'Hi sweetie! 💜 So proud of your work. Don\'t forget to log in tonight!'
          : 'Why aren\'t you picking up? I called 6 times. Your texts don\'t sound like you.',
      },
    ],
    shift: [],
    // Sent while the player looks through the scope at their own window.
    scope: [
      { from: 'k', text: 'look up.', delay: 1800, if: c => c.s.fates.k === 'warned' },
      { from: 'k2', text: 'smile :)', delay: 1800, if: c => c.s.fates.k !== 'warned' },
      { from: 'mom', text: 'Everything\'s fine Mom. Love you 💜', delay: 3500, me: true },
    ],
  },
};
