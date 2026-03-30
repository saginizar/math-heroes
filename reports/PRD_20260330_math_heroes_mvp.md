# Product Requirements Document: MathHeroes Phase 1 MVP

**Document ID:** PRD_20260330_math_heroes_mvp
**Date:** 2026-03-30
**Status:** DRAFT
**Source:** GDD.md (Game Design Document)

---

## 1. Product Overview

### What It Is

MathHeroes (Hebrew: "גיבורי המספרים") is a local, offline, browser-based math learning game designed as a Progressive Web App (PWA). The game disguises math practice as superhero adventures, where solving math problems directly powers the hero's actions in the game world. This is not "do math, then watch a reward" -- the math IS the superpower.

### Who It's For

**Primary user:** A 4.5-year-old Hebrew-speaking boy who is advanced in math (comfortable with addition, subtraction, basic multiplication). He learns fast, gets bored with repetitive or easy tasks, and loves superheroes (Flash, Spidey, Iron Man), Sonic, Mario, and Cars.

**Secondary user:** A parent who is nearby during play but expects the child to interact mostly independently. The parent benefits from a game that is private (no data collection), free (no monetization), and safe (no internet required during play).

### Why It Matters

Young children who are advanced in math need challenges that match their ability level, not their age. Most available educational apps are either too easy, require constant internet, include ads/in-app purchases, or are not available in Hebrew. This game fills that gap: it is adaptive (difficulty scales to the child), native Hebrew (RTL, audio-first), fully offline, and themed around characters the child already loves. The superhero narrative provides intrinsic motivation, and the adaptive difficulty engine prevents both boredom (too easy) and frustration (too hard).

---

## 2. User Stories

### US-01: Launch and Start Playing
**As a** child user, **I want to** tap a big colorful button to start playing **so that** I can get into the game quickly without needing to read instructions.

**Acceptance Criteria:**
- AC-01.1: A splash screen appears on load showing the game logo (CSS-drawn, no image files) and a prominently sized "!התחל" button (minimum 60px height).
- AC-01.2: The game title "גיבורי המספרים" is spoken aloud in Hebrew using TTS when the splash screen appears.
- AC-01.3: Tapping the start button transitions to the world map within 300ms with a smooth animation.
- AC-01.4: No text reading is required to start playing; the interface is fully navigable by a non-reader.

### US-02: Navigate the World Map
**As a** child user, **I want to** see a map of game worlds and tap the one I can play **so that** I know where I am in the adventure.

**Acceptance Criteria:**
- AC-02.1: The world map displays 6 world nodes in a visually appealing layout.
- AC-02.2: World 1 (Speed City / עיר המהירות) is unlocked and visually distinguished (bright, colored, tappable).
- AC-02.3: Worlds 2-6 are displayed but locked (grayed out with a lock icon).
- AC-02.4: Tapping a locked world does nothing (or gives gentle audio feedback), never causes an error.
- AC-02.5: Tapping World 1 transitions to the level select screen for Speed City.

### US-03: Select a Level
**As a** child user, **I want to** see my progress within a world and tap the next level to play **so that** I can continue my adventure from where I left off.

**Acceptance Criteria:**
- AC-03.1: Six level nodes are displayed as connected nodes on a path.
- AC-03.2: Completed levels show earned stars (1-3 stars).
- AC-03.3: The next unplayed level pulses/animates to draw attention.
- AC-03.4: Locked levels (beyond the next unplayed) are visually dimmed.
- AC-03.5: Tapping an available level loads the gameplay screen with the correct level configuration.

### US-04: Play Power Launch Levels
**As a** child user, **I want to** solve an addition problem by tapping one of three answer buttons and see my hero dash across the screen based on my answer **so that** math feels like a superpower.

**Acceptance Criteria:**
- AC-04.1: A math problem is displayed prominently on screen (large font, minimum 24px for numbers).
- AC-04.2: The problem is spoken aloud in Hebrew via TTS (e.g., "כמה זה שלוש ועוד ארבע").
- AC-04.3: Three answer buttons are displayed (minimum 60px height, 48px width), with one correct and two distractors.
- AC-04.4: Tapping the correct answer triggers a hero dash animation proportional to the answer value.
- AC-04.5: Tapping a wrong answer triggers a shake animation, plays a gentle "wrong" sound, and the spoken feedback "כמעט! נסה שוב".
- AC-04.6: The level consists of exactly the number of problems defined in the level config (3 for Level 1).

### US-05: Play Path Chooser Levels
**As a** child user, **I want to** pick the correct path among three options to reach a target number **so that** I practice evaluating math expressions.

**Acceptance Criteria:**
- AC-05.1: A target number is displayed prominently.
- AC-05.2: Three branching paths are displayed, each labeled with a math expression.
- AC-05.3: Tapping the correct path causes the hero to run down it with a satisfying animation.
- AC-05.4: Tapping a wrong path results in gentle feedback (shake, "wrong" sound, verbal encouragement).
- AC-05.5: Expressions are appropriate for the current difficulty level.

### US-06: Play Number Catcher Levels
**As a** child user, **I want to** catch numbers matching a rule by tapping them as they float across the screen **so that** I practice number comparison in an action-oriented way.

**Acceptance Criteria:**
- AC-06.1: A rule is displayed and spoken in Hebrew (e.g., "!תפוס רק מספרים גדולים מארבע").
- AC-06.2: Numbers float across the screen on cloud/platform elements moving horizontally.
- AC-06.3: Tapping a matching number produces a positive "catch" animation and sound.
- AC-06.4: Tapping a non-matching number produces gentle negative feedback.
- AC-06.5: Missing a matching number as it exits the screen counts as a miss but does not punish harshly.
- AC-06.6: The level uses 8 numbers total as configured for Level 3.

### US-07: Play Shield Match Levels
**As a** child user, **I want to** find two numbers that add up to a target number by tapping them **so that** I practice number bonds in a visually engaging way.

**Acceptance Criteria:**
- AC-07.1: A shield displays a target number prominently in the center of the screen.
- AC-07.2: Six number orbs are arranged around the shield.
- AC-07.3: Tapping two orbs that sum to the target triggers a merge animation into the shield with a satisfying sound.
- AC-07.4: Tapping two orbs that do not sum to the target resets the selection with gentle feedback.
- AC-07.5: Multiple valid pairs exist per round (as per GDD example: target 9 with orbs [3,7,5,4,2,6]).
- AC-07.6: The level consists of 3 rounds as configured for Level 4.

### US-08: Receive Adaptive Difficulty
**As a** child user, **I want** the game to automatically get harder when I am doing well and easier when I am struggling **so that** I am always challenged but never frustrated.

**Acceptance Criteria:**
- AC-08.1: When accuracy exceeds 90% over 5 consecutive problems, difficulty increases by 1 level.
- AC-08.2: When accuracy exceeds 95% over 3 consecutive problems, difficulty increases by 2 levels.
- AC-08.3: When accuracy drops below 50% over 3 consecutive problems, difficulty decreases by 1 level and a hint is offered.
- AC-08.4: Difficulty changes adjust the number range and distractor quality as defined in the GDD difficulty table.
- AC-08.5: Difficulty is tracked per math operation type (addition, comparison, number bonds).

### US-09: Get Progressive Hints
**As a** child user, **I want to** receive increasing help after multiple wrong answers on the same problem **so that** I can still succeed and learn rather than giving up.

**Acceptance Criteria:**
- AC-09.1: After 2 wrong attempts on the same problem, visual counting dots appear alongside numbers.
- AC-09.2: If still wrong, two incorrect options gray out (50/50 hint).
- AC-09.3: If still wrong, the correct answer gently pulses.
- AC-09.4: Hints are visual-only (no text reading required) and accompany audio encouragement.

### US-10: Hear Everything in Hebrew
**As a** child user who cannot read, **I want** the game to speak all instructions, feedback, and numbers in Hebrew **so that** I can play independently without a parent reading to me.

**Acceptance Criteria:**
- AC-10.1: All problem text is spoken aloud using Web Speech API with a Hebrew voice (if available).
- AC-10.2: Correct feedback is spoken using a randomly chosen phrase from the positive feedback list.
- AC-10.3: Wrong feedback speaks "כמעט! נסה שוב".
- AC-10.4: Mission briefings are spoken at the start of each level.
- AC-10.5: If no Hebrew voice is available in the browser, text is displayed prominently on screen as a fallback. The game never silently fails.
- AC-10.6: TTS speech rate is set to 0.9 (slightly slower for a child).

### US-11: Hear Sound Effects
**As a** child user, **I want to** hear fun sounds for correct answers, wrong answers, power-ups, and level completion **so that** the game feels exciting and responsive.

**Acceptance Criteria:**
- AC-11.1: A "correct" sound (ding/chime) plays on correct answers.
- AC-11.2: A gentle "wrong" sound plays on incorrect answers (not harsh or punishing).
- AC-11.3: A whoosh sound plays during hero dash/movement animations.
- AC-11.4: A fanfare plays on level completion.
- AC-11.5: A power-up sound plays when earning costume pieces.
- AC-11.6: All sounds are generated procedurally via Web Audio API (oscillator nodes with envelopes). No audio files.

### US-12: Complete a Level and See Rewards
**As a** child user, **I want to** see stars, earn costume pieces, and gain XP when I complete a level **so that** I feel accomplished and motivated to continue.

**Acceptance Criteria:**
- AC-12.1: On level completion, a reward screen displays with a star reveal animation.
- AC-12.2: Stars are awarded: 1 star for completion, 2 stars for all first-try answers, 3 stars for all first-try with high confidence.
- AC-12.3: A costume piece is revealed with a satisfying animation (as defined per level in world data).
- AC-12.4: XP is awarded and the XP bar animates to show progress.
- AC-12.5: Two buttons are shown: "המשך" (continue to next level) and "עוד פעם" (replay current level).
- AC-12.6: Hero level is calculated as XP / 200.

### US-13: See My Hero Change
**As a** child user, **I want to** see my hero character gain new costume pieces as I progress **so that** I have a visual representation of my achievement.

**Acceptance Criteria:**
- AC-13.1: A base hero is rendered using CSS shapes (circle head, rectangle body).
- AC-13.2: Each earned costume piece (speed_boots, speed_gloves, speed_belt, speed_mask, speed_cape, speed_crown) visually appears on the hero.
- AC-13.3: Completing all 6 levels of World 1 grants the full Speed City costume plus the vehicle_motorcycle reward.
- AC-13.4: The hero avatar is visible during gameplay and on the world/level selection screens.

### US-14: Save and Resume Progress
**As a** parent/child, **I want** game progress to be saved automatically **so that** the child can close the browser and resume later without losing progress.

**Acceptance Criteria:**
- AC-14.1: Game state is auto-saved to LocalStorage after each level completion.
- AC-14.2: On game launch, saved state is loaded and the player resumes from their last position.
- AC-14.3: Save data includes: completed levels, stars earned, costume pieces, XP, hero level, difficulty settings per operation.
- AC-14.4: LocalStorage key is "mathheroes_save".
- AC-14.5: Save data includes a version field for future migration compatibility.
- AC-14.6: Export/import JSON is available for backup purposes.

### US-15: Install as App on Tablet
**As a** parent, **I want to** install the game on my child's tablet as a standalone app **so that** it works offline and feels like a native app.

**Acceptance Criteria:**
- AC-15.1: A valid manifest.json enables "Add to Home Screen" on Chrome Android and Safari iOS.
- AC-15.2: The service worker caches all HTML, CSS, and JS files on first load.
- AC-15.3: After installation, the game works with no network connection.
- AC-15.4: The app launches in standalone mode (no browser chrome).
- AC-15.5: Preferred orientation is landscape; both landscape and portrait work.

### US-16: Play on Tablet with Touch
**As a** child user, **I want to** play the game by tapping large buttons on a tablet **so that** I can play comfortably with my fingers.

**Acceptance Criteria:**
- AC-16.1: All interactive elements have a minimum tap target of 48px (buttons are 60px height, 48px width minimum).
- AC-16.2: touch-action: manipulation is applied on game areas to prevent unwanted browser gestures.
- AC-16.3: Passive event listeners are used for touch events.
- AC-16.4: No interaction requires hover (no hover-dependent states).
- AC-16.5: Button presses show a ripple animation for tactile feedback.
- AC-16.6: Touch interactions respond in under 100ms.

---

## 3. Functional Requirements

### FR-01: Application Shell and Screen Navigation

- **FR-01.1:** Single-page application (index.html) with all CSS and JS loaded upfront.
- **FR-01.2:** Five distinct screens: Splash, World Map, Level Select, Gameplay, Level Complete. Only one visible at a time.
- **FR-01.3:** Screen transitions are animated (fadeIn/fadeOut or slideUp) for polish.
- **FR-01.4:** A showScreen(screenId) function manages screen visibility.
- **FR-01.5:** Event delegation from a single root handles all button clicks.

### FR-02: Splash Screen

- **FR-02.1:** Displays game logo rendered entirely in CSS (no image files).
- **FR-02.2:** Title "גיבורי המספרים" animates on appearance.
- **FR-02.3:** A single large "!התחל" button is centered below the title.
- **FR-02.4:** TTS speaks the title on screen load.

### FR-03: World Map Screen

- **FR-03.1:** Renders 6 world nodes in a stylized map layout using CSS Grid.
- **FR-03.2:** World 1 (Speed City) node is unlocked -- bright, tappable, with the Speed City color palette (electric blue #00D4FF, neon yellow #FFE100).
- **FR-03.3:** Worlds 2-6 are rendered as locked nodes (grayed out, with a CSS lock icon).
- **FR-03.4:** Title "מפת העולמות" is displayed and spoken.
- **FR-03.5:** Tapping World 1 transitions to Level Select for Speed City.

### FR-04: Level Select Screen

- **FR-04.1:** Renders 6 level nodes connected by path lines (CSS-drawn).
- **FR-04.2:** Completed levels display earned stars (1-3, CSS-drawn star shapes).
- **FR-04.3:** The next unplayed level has a pulsing animation (CSS keyframe buttonPulse).
- **FR-04.4:** Levels beyond the next unplayed are dimmed/locked.
- **FR-04.5:** Each level node shows its Hebrew name (e.g., "הריצה הראשונה").

### FR-05: Gameplay Screen -- General

- **FR-05.1:** Full-screen game area that receives level configuration and delegates to the appropriate level-type renderer.
- **FR-05.2:** Game engine state machine with states: IDLE, PLAYING, CHECKING, ANIMATING, COMPLETE.
- **FR-05.3:** Manages problem flow: loads next problem, accepts answer input, checks correctness, triggers animation, advances or retries.
- **FR-05.4:** Calls TTS to speak the problem and feedback.
- **FR-05.5:** Calls SFX module for all sound events.
- **FR-05.6:** Tracks current problem index, correct count, and attempts per problem.

### FR-06: Level Type -- Power Launch (שיגור כוח)

- **FR-06.1:** Displays a math problem (addition) with the question spoken in Hebrew.
- **FR-06.2:** Shows 3 large answer buttons with one correct answer and two distractors.
- **FR-06.3:** Correct answer triggers hero dash animation proportional to the answer value.
- **FR-06.4:** Distractors are generated based on difficulty level (+-3 at difficulty 1, +-2 at difficulty 2, etc.).
- **FR-06.5:** Hero stands on a visual launch pad; the dash is animated with the heroDash keyframe.

### FR-07: Level Type -- Path Chooser (בוחר שבילים)

- **FR-07.1:** Displays a target number prominently.
- **FR-07.2:** Three branching paths with math expressions floating above them.
- **FR-07.3:** One expression evaluates to the target; two do not.
- **FR-07.4:** Tapping the correct path runs the hero down it with animation.
- **FR-07.5:** Tapping a wrong path gives shake feedback.

### FR-08: Level Type -- Number Catcher (תופס מספרים)

- **FR-08.1:** A rule is displayed and spoken (e.g., "!תפוס רק מספרים גדולים מארבע").
- **FR-08.2:** Numbers float across screen on cloud/platform elements, moving horizontally.
- **FR-08.3:** Tapping a matching number catches it (positive animation + sound).
- **FR-08.4:** Tapping a non-matching number gives gentle negative feedback.
- **FR-08.5:** 8 numbers total float across; the level completes when all have passed.
- **FR-08.6:** Scoring tracks how many correct catches vs. misses.

### FR-09: Level Type -- Shield Match (מגן מתאים)

- **FR-09.1:** A shield displays the target number in the center.
- **FR-09.2:** 6 number orbs are arranged around the shield.
- **FR-09.3:** The player taps two orbs. If they sum to the target, they merge into the shield with animation.
- **FR-09.4:** If they do not sum to the target, selection resets with feedback.
- **FR-09.5:** Multiple valid pairs are present per round.
- **FR-09.6:** 3 rounds per level (for Level 4 config).

### FR-10: Level 5 -- Bridge Builder Variant

- **FR-10.1:** Level 5 ("גשר הברקים") is implemented as a variant of Path Chooser with a sequence UI.
- **FR-10.2:** A number sequence with a gap is displayed (e.g., 2, 4, _, 8, 10).
- **FR-10.3:** The player selects the correct missing number from options.
- **FR-10.4:** 4 sequence problems per level.
- **FR-10.5:** Visual metaphor: each correct answer adds a bridge plank.

### FR-11: Level 6 -- Hero Rescue Multi-Step

- **FR-11.1:** Level 6 ("העימות") is a multi-step challenge with 3 connected phases.
- **FR-11.2:** Each phase presents a different problem; the answer feeds into the narrative.
- **FR-11.3:** Phase 1: Addition problem. Phase 2: Sequence/pattern. Phase 3: Addition using previous results.
- **FR-11.4:** The hero visually progresses through phases on screen.
- **FR-11.5:** Completing all 3 phases triggers a special world-complete celebration.

### FR-12: Question Generation Engine

- **FR-12.1:** Generates math problems procedurally based on operation type and difficulty level.
- **FR-12.2:** Returns an object: { question, correctAnswer, options, visualAid, hebrewText }.
- **FR-12.3:** Anti-repetition: tracks the last 20 generated problems and avoids repeats.
- **FR-12.4:** Distractor generation produces three types: close (correct +-1), common-error (e.g., off-by-one from carry), and random (within range).
- **FR-12.5:** At difficulty 1-2, visual aids (counting dots) are available.

### FR-13: Adaptive Difficulty Engine

- **FR-13.1:** Tracks per-operation accuracy over the last 10 problems.
- **FR-13.2:** Escalation rule: >90% accuracy over 5 problems triggers +1 difficulty level.
- **FR-13.3:** Fast-track rule: >95% accuracy over 3 problems triggers +2 difficulty levels.
- **FR-13.4:** De-escalation rule: <50% accuracy over 3 problems triggers -1 difficulty level and offers a hint.
- **FR-13.5:** Difficulty ranges from 1 to 6 (clamped at bounds).
- **FR-13.6:** Difficulty parameters per level:
  - Level 1: numbers 1-5, visual aids ON, distractors +-3 away
  - Level 2: numbers 1-10, visual aids ON, distractors +-2 away
  - Level 3: numbers 1-10, visual aids OFF, distractors +-1 away
  - Level 4: numbers 1-20, visual aids OFF, close distractors
  - Level 5: numbers 1-50, visual aids OFF, tricky near-misses
  - Level 6: numbers 1-100, visual aids OFF, word problems

### FR-14: Progressive Hint System

- **FR-14.1:** After 2 wrong attempts on the same problem: visual counting dots appear alongside numbers.
- **FR-14.2:** After 3 wrong attempts: two wrong options gray out (50/50).
- **FR-14.3:** After 4 wrong attempts: correct answer gently pulses.
- **FR-14.4:** Hints are purely visual; TTS speaks encouraging phrases alongside.

### FR-15: Hebrew TTS System

- **FR-15.1:** Wraps Web Speech API with a speak(hebrewText, rate=0.9) function.
- **FR-15.2:** Queues utterances to avoid overlap.
- **FR-15.3:** Selects a Hebrew voice if available in the browser.
- **FR-15.4:** Graceful degradation: if no Hebrew voice is available, shows text prominently on screen instead of speaking.
- **FR-15.5:** All Hebrew number words (1-100) are defined as constants.
- **FR-15.6:** Operation words defined: "ועוד" (plus), "פחות" (minus), "כפול" (times), "שווה" (equals).

### FR-16: Procedural Sound Effects

- **FR-16.1:** Web Audio API generates all sounds. No audio files.
- **FR-16.2:** Functions: playCorrect(), playWrong(), playWhoosh(), playPop(), playFanfare(), playPowerUp().
- **FR-16.3:** Each function creates oscillator nodes with frequency envelopes.
- **FR-16.4:** Sounds are short (under 1 second for feedback, up to 2 seconds for fanfare).

### FR-17: Save System

- **FR-17.1:** LocalStorage key: "mathheroes_save".
- **FR-17.2:** Auto-saves after every level completion.
- **FR-17.3:** Save data schema includes: version, completedLevels (with stars), costumePieces, xp, heroLevel, difficultyPerOperation, timestamp.
- **FR-17.4:** On load, checks for saved data and restores game state.
- **FR-17.5:** Version field enables future migration.
- **FR-17.6:** Export/import as JSON string for manual backup.

### FR-18: Progress and Reward System

- **FR-18.1:** XP is awarded per level completion (base amount + bonus for stars).
- **FR-18.2:** Hero level = floor(XP / 200).
- **FR-18.3:** Star calculation: 1 star = complete, 2 stars = all answers correct on first try, 3 stars = all first-try + achieved quickly/confidently.
- **FR-18.4:** Costume pieces unlock per level (6 pieces for World 1: speed_boots, speed_gloves, speed_belt, speed_mask, speed_cape, speed_crown).
- **FR-18.5:** Completing all 6 levels awards vehicle_motorcycle as a bonus reward.

### FR-19: Hero Avatar System

- **FR-19.1:** Hero rendered as CSS shapes: circle head, rectangle body.
- **FR-19.2:** Costume layers overlay on the base hero per earned costume pieces.
- **FR-19.3:** updateCostume(costumeList) function redraws the hero with equipped pieces.
- **FR-19.4:** Hero is displayed on gameplay, world map, and level select screens.

### FR-20: PWA Configuration

- **FR-20.1:** manifest.json with: name "גיבורי המספרים", short_name "MathHeroes", display "standalone", orientation "landscape", theme_color "#1A1A2E", background_color "#1A1A2E".
- **FR-20.2:** Service worker (sw.js) caches all HTML, CSS, and JS files on install event.
- **FR-20.3:** Fetch strategy: cache-first, fallback to network.
- **FR-20.4:** Enables full offline play after first page load.

### FR-21: World Data Configuration

- **FR-21.1:** World 1 (Speed City) is fully configured with all 6 levels, each specifying: id, nameHe, type, difficulty, operation, problemCount, reward.
- **FR-21.2:** Worlds 2-5 exist as stubs: name, theme, locked: true.
- **FR-21.3:** World 6 (Secret World) exists as a stub, locked until all others complete.

---

## 4. Non-Functional Requirements

### NFR-01: Performance

- **NFR-01.1:** All touch interactions respond in under 100ms.
- **NFR-01.2:** CSS animations run at 60fps using only transform and opacity properties for GPU acceleration.
- **NFR-01.3:** No JavaScript animation that blocks the main thread for more than 16ms per frame.
- **NFR-01.4:** Total application size must be under 500KB (no images, no audio files, no external libraries).

### NFR-02: Offline Capability

- **NFR-02.1:** After first load, the game works with zero network connectivity.
- **NFR-02.2:** No external API calls, CDN requests, font downloads, or analytics.
- **NFR-02.3:** Service worker caches all assets on install.
- **NFR-02.4:** The game makes zero HTTP requests during gameplay.

### NFR-03: RTL and Hebrew Support

- **NFR-03.1:** All text is rendered right-to-left (CSS direction: rtl on document).
- **NFR-03.2:** UI layout flows RTL (navigation, lists, progress indicators).
- **NFR-03.3:** All user-facing text is in Hebrew (no English visible to the player).
- **NFR-03.4:** Hebrew text uses system sans-serif font at minimum 18px for UI text and 24px for numbers.

### NFR-04: Touch and Tablet Optimization

- **NFR-04.1:** All tappable elements have minimum 48px x 48px touch targets (buttons are 60px height, 48px width).
- **NFR-04.2:** touch-action: manipulation applied to game areas.
- **NFR-04.3:** All touch event listeners are passive where possible.
- **NFR-04.4:** No hover-dependent interactions anywhere in the game.
- **NFR-04.5:** Works in both landscape (preferred) and portrait orientations.

### NFR-05: Accessibility for a Pre-Reader

- **NFR-05.1:** Audio-first UX: every instruction, problem, and feedback is spoken, not just shown as text.
- **NFR-05.2:** Visual cues (colors, sizes, animations) communicate meaning alongside text.
- **NFR-05.3:** Buttons are large, with distinct colors for different actions.
- **NFR-05.4:** Wrong answers use gentle sounds (not harsh or punishing).
- **NFR-05.5:** Progressive hints ensure the child can always eventually succeed.

### NFR-06: Browser Compatibility

- **NFR-06.1:** No console errors in Chrome (latest) or Safari (latest).
- **NFR-06.2:** PWA installs on Chrome Android and Safari iOS.
- **NFR-06.3:** Web Speech API and Web Audio API are used with fallback paths when unavailable.

### NFR-07: Code Quality

- **NFR-07.1:** Vanilla JavaScript ES6+ only. No frameworks, no npm, no build process.
- **NFR-07.2:** Modular file structure as defined in the GDD (separate files for engine, screens, levels, audio, UI, utils).
- **NFR-07.3:** No external dependencies of any kind.

---

## 5. Scope

### IN Scope (Phase 1 MVP)

| Item | Detail |
|------|--------|
| Application shell | index.html, manifest.json, sw.js |
| Screens | Splash, World Map, Level Select, Gameplay, Level Complete |
| World 1: Speed City | 6 fully playable levels with Flash/Sonic speed theme |
| Level types | Power Launch, Path Chooser, Number Catcher, Shield Match |
| Level 5 variant | Bridge Builder implemented as Path Chooser variant with sequence UI |
| Level 6 variant | Hero Rescue multi-step challenge (3 phases) |
| Math operations | Addition (primary), number comparison, number bonds, sequences/patterns |
| Question engine | Procedural generation with anti-repetition and distractor logic |
| Adaptive difficulty | 6-level difficulty scale with per-operation tracking |
| Progressive hints | 3-tier hint escalation after wrong attempts |
| Hebrew TTS | Web Speech API wrapper with graceful fallback |
| Procedural SFX | Web Audio API sound effects (6 sound types) |
| Save system | LocalStorage with auto-save and version migration support |
| Progress system | XP, hero levels, stars (1-3), costume pieces |
| Hero avatar | CSS-drawn hero with 6 costume layers for World 1 |
| RTL Hebrew UI | All text in Hebrew, full RTL layout |
| Tablet touch | Large buttons, passive listeners, no hover dependencies |
| PWA | Offline install via service worker and manifest |
| CSS animations | heroRun, heroDash, starReveal, buttonPulse, fadeIn, fadeOut, slideUp, shakeWrong, glowCorrect, numberFloat, confettiBurst |
| Visual themes | Speed City palette (electric blue, neon yellow, dark purple) |
| World data stubs | Worlds 2-6 defined as locked placeholders |

### OUT of Scope (Future Phases)

| Item | Phase |
|------|-------|
| Worlds 2-5 playable content | Phase 2-5 |
| Secret World 6 (Dr. Zero's Lair) | Phase 6 |
| Level types: Bridge Builder (standalone), Zip Line, Code Lock, Split Power, Tower Stack, Gadget Grid, Group Stamp, Hero Rescue (standalone) | Phase 2+ |
| Subtraction-focused levels | Phase 2 (World 2) |
| Multiplication-focused levels | Phase 3 (World 3) |
| Multi-player or collaborative play | Not planned |
| Backend, server, database | Not planned |
| User accounts, login | Not planned |
| Monetization, ads, in-app purchases | Not planned |
| Analytics or data collection | Not planned |
| External API integrations | Not planned |
| Image assets or downloaded audio files | Not planned |
| Parent dashboard or reporting | Future consideration |
| Settings screen (volume, difficulty override) | Future consideration |
| Multiple save slots / profiles | Future consideration |

---

## 6. Success Criteria

### SC-01: Child Engagement
The target user (4.5-year-old boy) voluntarily plays the game for 5+ minutes per session without being prompted, and asks to play again the next day.

### SC-02: Independent Play
The child can navigate from splash screen through world map, level select, and into gameplay without parent assistance (audio-first UX is sufficient).

### SC-03: Learning Effectiveness
The adaptive difficulty engine measurably adjusts: if the child answers >90% correctly, difficulty increases. If accuracy drops below 50%, difficulty decreases. This should be observable in saved game state.

### SC-04: Completion Path
All 6 levels of World 1 are completable in sequence. The child can earn 1-3 stars on each level and collect all 6 costume pieces plus the vehicle reward.

### SC-05: Technical Reliability
- Zero console errors during normal play in Chrome and Safari.
- Game installs as PWA and works fully offline on a tablet.
- Save/load works correctly across browser restarts.
- Touch interactions feel responsive (under 100ms).

### SC-06: Hebrew Language Quality
All spoken Hebrew is natural and comprehensible. All UI text reads correctly in RTL. A Hebrew-speaking child hears and understands every instruction.

---

## 7. Constraints

### Technical Constraints
- **C-01:** HTML5 + CSS3 + Vanilla JavaScript ES6+ only. No frameworks, no npm, no build tools, no transpilation.
- **C-02:** Zero external dependencies. No CDNs, no Google Fonts, no analytics scripts, no libraries.
- **C-03:** No image files. All visuals must be CSS shapes, gradients, box-shadows, and unicode/emoji characters.
- **C-04:** No audio files. All sound effects must be generated procedurally via Web Audio API.
- **C-05:** Web Speech API is the only TTS mechanism. It is browser-dependent and may not have a Hebrew voice on all devices.
- **C-06:** LocalStorage is the only persistence mechanism. Data is per-browser and can be cleared by the user.
- **C-07:** PWA capability depends on browser support for service workers and manifest.json.

### Design Constraints
- **C-08:** Target user cannot read. Every interaction must be navigable through audio, visual cues, and large touch targets alone.
- **C-09:** Session length is approximately 5 minutes (3-5 short levels). Levels must be fast-paced.
- **C-10:** Feedback for wrong answers must be encouraging, never punishing. The tone is always supportive.
- **C-11:** No copyrighted character likenesses may be used. The superhero theme is inspired by but not depicting specific characters (Flash, Spidey, etc. are thematic inspiration only -- the in-game hero is an original "Number Hero").
- **C-12:** All UI text and spoken content must be in Hebrew. No English visible to the player.

---

## 8. Risks

### R-01: Web Speech API Hebrew Voice Availability
**Risk:** The Web Speech API may not have a Hebrew voice available on the child's specific tablet/browser combination.
**Impact:** High -- the game is designed as audio-first for a non-reader.
**Mitigation:** Implement graceful fallback that displays text prominently on screen. Test on target device early. Consider making text display extra large and visually engaging in fallback mode.

### R-02: Touch Responsiveness on Older Tablets
**Risk:** CSS animations and touch handling may lag on older or lower-powered tablets.
**Impact:** Medium -- slow response breaks the superhero "speed" fantasy and frustrates the child.
**Mitigation:** Use only transform/opacity for animations (GPU-accelerated). Keep DOM simple. Test on the actual target device. Avoid layout-triggering properties in animations.

### R-03: LocalStorage Cleared Accidentally
**Risk:** Browser cache clearing, private browsing, or storage quota issues could wipe saved progress.
**Impact:** Medium -- losing progress is frustrating for a child.
**Mitigation:** Provide export/import JSON backup. Advise parent to export periodically. Save data is small (under 5KB) so quota is unlikely to be an issue.

### R-04: Difficulty Curve Mismatch
**Risk:** The adaptive difficulty engine may escalate too quickly or too slowly for this specific child.
**Impact:** Medium -- too hard causes frustration; too easy causes boredom.
**Mitigation:** The 6-level difficulty scale with per-operation tracking provides granularity. Progressive hints act as a safety net. Parent observation during early sessions can inform manual tuning if needed.

### R-05: Child Outgrows World 1 Content Quickly
**Risk:** A math-advanced 4.5-year-old may complete all 6 levels of World 1 in one or two sessions and want more content.
**Impact:** Low-Medium -- the MVP successfully validates the concept even if content is consumed quickly.
**Mitigation:** Replay value through star collection (aim for 3 stars on all levels). Adaptive difficulty means replaying levels at higher difficulty is a different experience. Plan Phase 2 development to follow quickly.

### R-06: Service Worker Caching Issues
**Risk:** Service worker may not cache correctly on first install, or cached files may become stale during development.
**Impact:** Low -- affects offline capability.
**Mitigation:** Use a versioned cache name. Provide cache-busting mechanism. Test PWA install flow explicitly.

### R-07: Copyright Concerns with Character Themes
**Risk:** Using names/likenesses of copyrighted characters (Flash, Spider-Man, Iron Man, etc.) could create legal issues.
**Impact:** Low for personal use, but relevant if ever shared publicly.
**Mitigation:** The game uses an original "Number Hero" character. World themes are inspired by genres (speed, climbing, tech, platformer, racing) without using copyrighted names or likenesses. All in-game text refers to the child's hero, not branded characters.

---

## 9. Open Questions

### OQ-01: Target Tablet Device
What specific tablet model and browser will the child primarily use? This affects Web Speech API voice availability and performance testing priorities.

### OQ-02: Portrait vs Landscape Priority
The GDD specifies landscape preferred but both should work. Should the UI be designed landscape-first with portrait as a secondary layout, or should equal design effort go to both orientations?

### OQ-03: Star Criteria for 3 Stars
The GDD mentions "3 stars = all first-try + confident." What exactly defines "confident"? Is it speed-based (answered within N seconds), or accuracy-based (no hesitation/changed answers)? This needs a concrete, measurable definition.

### OQ-04: XP Awards Per Level
The GDD mentions XP and hero levels (XP / 200) but does not specify exact XP amounts awarded per level or per star. What are the XP values? A suggested default: 50 XP base + 25 XP per star (so 50-125 XP per level).

### OQ-05: Number Catcher Pacing
For the Number Catcher level type, how fast should numbers float across the screen? This directly affects difficulty for a 4.5-year-old's reaction time. Suggested: 3-4 seconds to cross the screen at difficulty 1, faster at higher difficulties.

### OQ-06: Audio Mute Toggle
Should there be a simple mute button accessible to a parent (not the child) for situations where sound is inappropriate? The GDD does not mention audio controls.

---

## Appendix A: World 1 Level Configuration Reference

| Level | Hebrew Name | Type | Difficulty | Problems | Math Focus | Reward |
|-------|-------------|------|-----------|----------|------------|--------|
| 1 | הריצה הראשונה | PowerLaunch | 1 | 3 | Addition | speed_boots |
| 2 | מלכודת מהירות | PathChooser | 1 | 3 | Addition (expressions) | speed_gloves |
| 3 | מרוץ המספרים | NumberCatcher | 1-2 | 8 numbers (catch > 4) | Comparison | speed_belt |
| 4 | ריצה כפולה | ShieldMatch | 2 | 3 rounds | Number bonds | speed_mask |
| 5 | גשר הברקים | BridgeBuilder variant | 1-2 | 4 sequences | Patterns | speed_cape |
| 6 | העימות | HeroRescue (3 phases) | 2 | 3 connected phases | Addition + patterns | speed_crown + vehicle_motorcycle |

## Appendix B: File Structure Reference

```
math-heroes/
  index.html
  manifest.json
  sw.js
  css/
    main.css
    screens.css
    animations.css
    themes.css
  js/
    app.js
    screens/
      splash.js
      world-map.js
      level-select.js
      gameplay.js
      reward.js
    engine/
      game-engine.js
      question-gen.js
      difficulty.js
      progress.js
      save-manager.js
    levels/
      level-types.js
      world-data.js
    audio/
      speech.js
      sfx.js
      hebrew-phrases.js
    ui/
      buttons.js
      animations.js
      hero-avatar.js
      progress-bar.js
    utils/
      helpers.js
```

## Appendix C: Difficulty Parameters Quick Reference

| Difficulty | Number Range | Visual Aids | Distractor Distance |
|-----------|-------------|-------------|-------------------|
| 1 | 1-5 | ON | +-3 |
| 2 | 1-10 | ON | +-2 |
| 3 | 1-10 | OFF | +-1 |
| 4 | 1-20 | OFF | Close |
| 5 | 1-50 | OFF | Tricky near-misses |
| 6 | 1-100 | OFF | Word problems |
