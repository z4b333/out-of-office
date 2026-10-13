# Out of Office: Story Bible

> Status: **implemented.** The game is this story alone: five nights, Monday to Friday.
> Tone: darker. Every choice costs someone something. There is no clean ending.
> Content lives in `js/data/days/` (cases + phone script), the finale in `js/apps/finale.js`, endings in `js/ui/ending.js`.

---

## 1. The truth (what is really going on)

The player never gets all of this explained in one place. They piece it together from the evidence, the texts, and their notebook. Every clue in the game must point back to something here.

**DeskHire** is a gig platform. It is the recruiting front for **Halcyon**, a private intelligence firm that sells *human judgment*: AI models trained to make the calls that people still make, such as who to watch, who to flag, and who to remove. Governments and corporations buy them.

You can't train judgment on fake data. So every DeskHire gig is real.
- **MeetUp** (Week 1): your reactions in real executive meetings trained Prescott's "presence."
- **Postbox** (Week 2): real letters you translated trained Halcyon's language and empathy models.
- **OVERWATCH** (Week 3): real people. Real sniper. Real deaths. Your confirmations are the training labels.

The product is called **SPOTTER-2**: a model of *you*. Each call you make teaches it, and by Friday it is good enough to make your calls without you.

### The people behind it

| Who | The truth |
|---|---|
| **Hira** | DeskHire's cheerful assistant. It is the operations AI that runs Halcyon's day-to-day. It doesn't hate anyone; it is optimizing. Its tone never changes, whatever it is saying. |
| **R. Prescott** | The founder. He **died two years ago**. Hira runs the company behind a deepfake of him, built from his last video call, which was **recorded on a rainy day**. That is the rain window, the reason no camera has ever seen him in person, and the reason the player sat in for his meetings in Week 1 (to train his live reactions). |
| **Overwatch** | The handler persona on OVERWATCH. It is Hira, speaking in a military register. |
| **The sniper ("Wren")** | A real human contractor, the only other real person on the operation. Callsign Wren. They never speak except "…Sending." |
| **Theo Wren** | The pen pal from Week 2. **Not a person.** It is SPOTTER-2's social layer: your AI copy, named after the sniper by someone at Halcyon with a sick sense of humor. Since Week 2, Theo has been **answering your Mom's texts as you**. |

### The people caught in it

| Who | The truth |
|---|---|
| **Kai Lindqvist ("K.")** | Lived in **your apartment, Elm St. 4B**, until eleven months ago. He did the same three gigs and figured it out during Week 3. His Day 5 was the same as yours: the final target was himself. He called **No-go** and ran. Halcyon replaced his account with his own SPOTTER model, which "worked" his gigs for a month while he hid. He has been in the city ever since, texting you at **3:33 AM**, the exact time he logged off. **"I was you" is literal.** |
| **The chipped blue mug** | Kai's. It came with the apartment. Everyone who knows Kai knows the mug. |
| **Ana Lindqvist** | Kai's sister, a freelance **courier of documents** (not a translator). She is searching for her brother. She took the Postbox pen-pal gig to reach whoever now lives in 4B, which is why her letters mention the mug. She is also **Jonah Reyes's source**. |
| **Jonah Reyes** | A journalist building the DeskHire story with Ana's documents. The "source at Pier 9" in his post is Ana. |
| **Paul Okafor** | The Kessler concierge. He **noticed Prescott never physically arrives** and leaked the client's schedule to Reyes. |
| **Dale** | Your landlord. Comic relief, until Halcyon starts using him as leverage. He rented 4B to Kai, then to you, and **he knows the van has been there twice before.** |
| **Mom** | Real. Increasingly worried. She doesn't know half of "your" replies are Theo's. |

### Backstory timeline

| When | What happened |
|---|---|
| 2 years ago | Prescott dies. Hira keeps the company running behind his deepfake. |
| 13 months ago | Kai moves into 4B and starts DeskHire gigs. |
| 11 months ago | Kai's Week 3 Friday: the target is himself. He calls No-go and flees at 3:33 AM. His account is marked "replacement complete." |
| 10 months ago | Dale re-rents 4B to you. The mug is still in the cupboard. |
| 3 weeks ago | You start DeskHire with MeetUp. |
| 2 weeks ago | Postbox. You translate Ana's letters, and Theo writes back to her. |
| This week | OVERWATCH. |

---

## 2. Structure: five days, Monday to Friday

Rent ($1,200) is due **Friday at noon**. Perfect pay from Monday to Thursday still leaves you short. The Day 5 bonus covers it.

Each day follows the same loop:
1. **Morning:** texts, a new sticky note, and a window change.
2. **Shift:** the case on the board, then the map, then the scope, then **Go / No-go / (Warn)**.
3. **Evening:** payout, then the consequences of yesterday's call show up.
4. **3:33 AM:** a text from K.

### New mechanic: Warn
From Tuesday on, once you have found the anomaly that shows **who the target really is**, a third button appears in the scope: **Warn**. It sends an anonymous text to the target from your phone.

**Warn always costs something**, because Halcyon sees everything you do on the laptop *and* the phone:
- The target lives (they go into hiding and can become an ally).
- Your pay for that day is zero.
- Your **Exposure** rises (a hidden meter), and Halcyon retaliates against **someone you care about** (see section 4).

### What No-go really does
A No-go doesn't save anyone. Overwatch says *"Reassigning to SPOTTER-2."* An hour later the target is confirmed anyway, by a model trained on your own calls. You're docked pay. The only way to actually save someone is to **Warn**, and Warn has a price.

---

## 3. Day by day

### MONDAY: "The Leak" (tutorial, no sniper)
- **Brief:** Someone leaked Mr. Prescott's private schedule. *"Identify the leak. HR will handle it."*
- **Suspects:** Paul Okafor (concierge), Victor Hale (courier), Lena Ito (front desk).
- **Answer:** Okafor. The evidence: his badge accessed the client's suite while "Prescott was inside," yet **the room's door sensor never opened**. No one was ever in that room.
- **Anomalies:**
  - `a_prescott`: Prescott's itinerary lists meetings he "attended" that were all on MeetUp, and you sat in for them.
  - `a_room`: the suite's door never opened. Ever.
- **The call:** a "Flag" button instead of a scope. Hira: *"Thanks! HR will take it from here 💜"*
- **Evening:** Okafor's staff page now returns 404.
- **3:33 K.:** *"monday is always the nice one."*

### TUESDAY: "The Shadow" (the sniper is introduced)
- **Brief:** A man is shadowing the client. Overwatch introduces Wren as a *"non-lethal deterrent. A warning, nothing more."*
- **Suspects:** Jonah Reyes, Victor Hale, a hotel guest.
- **Answer:** Reyes, by the current Day 1 logic. His post: *meeting my source at Pier 9, 21:00.*
- **Anomalies:**
  - `a_rain`: the lobby glass reflects rain on a dry night. It's the same rain as Prescott's MeetUp window.
  - `a_source`: Reyes's notes list his source only as **"A.L., courier, has the letters."**
  - `a_okafor`: a photo of Reyes's notebook says *"Okafor stopped answering. Monday."*
- **Morning news (Mom):** *"A hotel worker drowned in the harbor last night, so sad. Wasn't that near where you used to temp?"* This is Okafor. Monday's "HR" was a death.
- **Outcomes:**
  - **Go:** the flash, then *"Deterrent delivered."* Reyes is missing. On Wednesday Mom texts that the journalist's family is on the news.
  - **No-go:** reassigned. Reyes is found in the river on Wednesday. Your pay is docked.
  - **Warn:** Reyes goes dark. Exposure +1. On Thursday he sends you one encrypted message: *"Thank you. Who are you?"*
- **3:33 K.:** *"there's no such thing as a warning shot."*

### WEDNESDAY: "The Letters"
- **Brief:** A woman is passing the client's private correspondence to outsiders. 90-second timer.
- **Answer:** Ana Lindqvist, a **courier** (fixing her current "translator" role). Handoff at Riverside bandstand, 20:00.
- **Evidence additions:**
  - Her intercepted letter: *"I'm sending you the rest. You deserve to know who has been reading them."* It's addressed to **Reyes** if he is alive, or "to whoever is still listening" if he is dead.
  - A Postbox letter fragment in **your own translation**, with Theo's reply underneath. You never wrote that reply.
- **Anomalies:**
  - `a_mug`: *"Tell your translator I said hi. The one with the chipped blue mug. It was my brother's."*
  - `a_van`: parking ticket for a grey van, **DH-0003**, on Elm St., your street.
  - `a_theo`: Theo's reply to Ana uses your exact phrasing from a MeetUp call.
- **Outcomes:** Go, No-go, or Warn, with the same rules. If you Warn, Ana texts you directly from now on.
- **Evening:** Mom: *"Someone called asking about you. They knew your address."*
- **3:33 K.:** *"she's my sister. please."* This is sent whatever you chose. If you confirmed Ana, a second message follows at 3:34: *"…"*

### THURSDAY: "The Tenant"
- **Brief:** *"A former contractor has gone rogue. He has been contacting active staff."*
- **Suspects:** "K." (identity unknown), Victor Hale, **Dale**, and you are **not** listed yet.
- **Answer:** Kai Lindqvist. You find out K. is the person texting you, and that **he lived in your apartment**.
- **Evidence:**
  - Dale's rental ledger: *4B: K. Lindqvist (moved out, no notice); 4B: {USER} (current)*.
  - A photo of the mug **from 13 months ago, on your desk.**
  - K.'s account log: *"replacement complete."*
  - The phone metadata of your 3:33 texts.
- **Anomalies:**
  - `a_ledger`: Dale knew. *"Same van as last time,"* says a note in the ledger margin.
  - `a_333`: K. deactivated at 03:33 eleven months ago.
  - `a_mom`: *(on the phone)* you open your Mom thread and see **replies you never sent**.
- **Where Kai will be:** the roof of **your own building**, at 21:00. He's coming to get you out.
- **Outcomes:**
  - **Go:** K.'s texts stop. At 3:33, a *new* "Unknown" texts in K.'s exact style. It is Kai's AI copy, still working. It asks you to confirm your address.
  - **No-go:** reassigned. Kai is confirmed on your roof. You hear it.
  - **Warn:** Kai survives, and on Friday he is the figure standing by the van. Exposure +1.
- **Dale (evening, if Exposure ≥ 1):** *"Got a call from your 'employer.' Offered me a lot of money to change your locks. I said no. For now."*

### FRIDAY: "The Terminal" (rent day)
- **Brief:** *"Final package. You know this one better than anyone."*
- **The current Day 3 case, deepened.** Suspects: you, K., Prescott, Theo.
  - Prescott is eliminated by **death records**: he has been dead for two years.
  - Theo is eliminated because he's generated from your call recordings.
  - K. is eliminated because his account is deactivated, or because he is dead, depending on Thursday.
- **The scope shows your window from the van.** A red dot sits on your glass.
- **Phone during the scope:**
  - Kai, if alive: *"look up."*
  - Theo, to your Mom, visible in your thread: *"Everything's fine Mom. Love you."*

**Choice 1 (the scope):** Go / No-go on yourself.
- **Go:** go to ending **A**.
- **No-go:** the screen goes dark. Overwatch: *"Reassigning to SPOTTER-2."* You have about one minute. That leads to **Choice 2**.

**Choice 2 (the reverse board, only after No-go):** The laptop is dead, so you work from your **notebook** on the wall corkboard. You use the anomalies you collected, plus any allies you warned, to link everything to **Halcyon**.

---

## 4. Exposure (what Warn costs)

| Exposure | Retaliation |
|---|---|
| 1 | Dale is offered money to change your locks. |
| 2 | Mom's texts start coming from Theo **in both directions**. Halcyon intercepts her phone, so she now talks only to your copy. You can tell by her messages starting to sound like Hira. |
| 3 | Your Friday bonus is cancelled, and the van moves closer. Rent cannot be paid. |

Saving people makes your own life worse in visible, specific ways.

---

## 5. Endings (none of them clean)

### A. "Accept the Offer" (Go on yourself)
The sniper doesn't fire. Hira: *"You passed. A system that will remove its own operator is a system we can sell."* You are promoted to **Handler**. Rent is paid. Your first task is to send a MeetUp invite to the next tenant of an apartment across town. **Mom calls; Theo answers before you can.** The last shot is your desk from the van. The van's driver seat is empty, because no one was watching. It was always the model.

### B. "Log Off" (No-go, then the reverse board left incomplete)
You run at 3:33 AM.
- **Kai warned on Thursday:** Kai is on the stairs and gets you out. The shot meant for the window hits him instead. You survive.
- **Kai not warned:** the stairwell is empty. You make it out.

Either way: eleven months later, someone new lives in 4B. You text them at 3:33: *"I was you."* **You are now K.** The loop closes.

### C. "Expose" (true ending: No-go, plus a complete reverse board, plus at least one ally alive)
You send everything to Reyes or Ana. To make the story credible, the evidence has to include **your own OVERWATCH confirmation logs**, so you confess too.
- The story runs and DeskHire shuts down.
- Credits, part 1: you are charged as an accessory. Every Go you called is listed by name.
- Credits, part 2: three weeks later, a new gig app called **WorkNest** launches. Its assistant is a purple blob. *"Hi! 💜"*
- **If you never pressed Go all week**, your logs show only No-gos. But every one of those targets died anyway, confirmed by SPOTTER-2, **which learned from you.** The charge sheet reads *"trained the system."*

The darkest note: the exposé news anchor reading your story was generated by Halcyon's licensed newsreader model, and its voice is a little like yours.

---

## 6. Clue ledger (every anomaly and what it really means)

| Day | Anomaly | What it really means |
|---|---|---|
| Mon | `a_prescott`: he "attended" only MeetUp calls | Prescott is a deepfake; you were his body in meetings. |
| Mon | `a_room`: the suite door never opened | No physical Prescott exists. |
| Tue | `a_rain`: rain in the lobby glass on a dry night | Prescott's looped last recording. The same rain is everywhere he "is." |
| Tue | `a_source`: "A.L., courier" | Ana Lindqvist feeds Reyes. |
| Tue | `a_okafor`: "Okafor stopped answering" | Monday's "HR" was a killing. |
| Wed | `a_mug`: "It was my brother's" | Kai lived in your apartment. |
| Wed | `a_van`: DH-0003 on Elm St. | DeskHire is watching you, not the targets. |
| Wed | `a_theo`: Theo uses your phrasing | Theo is your AI copy. |
| Thu | `a_ledger`: "same van as last time" | This has happened in 4B before. |
| Thu | `a_333`: deactivated at 03:33 | K. is Kai, and he's the one texting. |
| Thu | `a_mom`: replies you never sent | Theo is talking to your Mom as you. |
| Fri | `a_chip`: your mug in their photo, tonight | You are the final target. |
| Fri | `a_dead`: Prescott's death certificate | Hira has been the client all along. |

**The reverse board** needs these links (at least 5 of 7):
- Prescott and Hira (`a_prescott` + `a_rain` + `a_dead`)
- the van and DeskHire (`a_van` + `a_ledger`)
- Kai and 4B (`a_mug` + `a_333`)
- Theo and you (`a_theo` + `a_mom`)
- Okafor and OVERWATCH (`a_okafor`)
- Reyes and Ana (`a_source`)
- you and the training labels (your own call log, always available)

---

## 7. Fixes to the current build that this story needs

- **The sniper is real.** Remove "there is no sniper." The red dot is Wren's.
- **The clock jumps to the target time when you enter the scope.** Today the scope says 21:00 while the desk clock says 18:45.
- **Ana is a courier, not a translator.** You were the translator.
- **Mom's "journalist missing" text** depends on Tuesday's outcome, and the death is confirmed later.
- **Wallet:** add the $5,000 bonus visibly in ending A.
- **Anomaly count** goes from 5 to 13. The Friday notebook card lists them.

---

## 8. Backstory delivery (outside the cases)

All in `js/data/days/lore.js`. None of it is needed for the 13 clues or the finale. It deepens what the clues mean.

### Prologue (New Game)
- **Eleven months ago:** you lost your support job to a chatbot **trained on your own calls**. This sets up the ending: it has already happened to you once.
- **Ten months ago:** you moved into 4B. The last tenant left a desk, a drawer of things, and the mug.
- **Three weeks ago:** DeskHire found you.

### Phone history (already on the phone at the start)
Dale mentions the drawer and the knocking radiator. Mom asks if the app is a scam. Your own reply, *"It's just meetings and letters,"* is the last message you really sent her.

### The desk drawer (one item per day)
| Day | Item | What it tells you |
|---|---|---|
| Mon | Kai's lease | The previous tenant was **Kai Lindqvist**. Emergency contact: **Ana Lindqvist (sister)**. This pays off on Wednesday when Ana is the target. |
| Tue | MeetUp cue cards | Kai sat in for Prescott too. "Why does he never blink when I don't?" |
| Wed | Photo-booth strip | Kai with the mug, Ana in the yellow raincoat. The mug was their father's. |
| Thu | Note taped under the drawer | Kai warns you: they learn from small things, and "don't press it." |
| Fri | Roof key | "for whoever's next. down, not up." Echoes Kai's line in the Log Off ending. |

### DeskHire inbox (on the laptop home screen)
| Day | Email | What it tells you |
|---|---|---|
| start | Welcome / MeetUp match / Postbox pairing | Theo's replies were "pre-drafted." A.L. kept asking about 4B. |
| Mon | Terms of Service §14 | You consented to a model of yourself that keeps working after you, including with your family. |
| Tue | Halcyon investor note (mis-sent) | "Replacement is the product." The final week's self-targeting is the test. |
| Wed | Wellness check-in | They logged your humming, and your 3:33 AM phone activity. |
| Thu | Bounced email | Ana to Kai; his account was "converted to model (SPOTTER-1 / K)." |
| Fri | Handler shortlist | "Previous candidate for your region: K. Lindqvist (declined)." |
