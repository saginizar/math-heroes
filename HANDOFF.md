# MathHeroes — HANDOFF Document

**Last updated:** 2026-03-30 (after major v2 update, pre-user-testing)
**Purpose:** Full context for continuing this project after context compaction.

---

## 1. What Is This Project

MathHeroes (גיבורי המספרים) is a local, offline, browser-based math learning game for a 4.5-year-old boy. PWA, tablet-first (touch), Hebrew narration, zero external dependencies.

**Core concept:** Math IS the superpower — solving problems powers hero actions.
**Theme:** Superhero adventure. Dr. Zero (ד"ר אפס) stole the world's numbers.

**Target child:** 4.5yo, Hebrew-speaking, advanced math, loves Flash/Spidey/Iron Man/Mario/Sonic/Batman. Can't read — needs audio-first UX. Gets bored with easy/repetitive tasks.

**Constraints:** Hebrew RTL, vanilla JS only, Web Speech API TTS, Web Audio API SFX, LocalStorage save, PWA offline, no timers/pressure, 60px+ buttons.

---

## 2. Current State: v2 Update Complete, Testing In Progress

The game is running at http://localhost:8080 via `py -m http.server 8080`. User is actively testing.

### What was built in v1 (Stage 4):
- All 29 source files (JS/CSS/HTML)
- 6 level types, game engine, save system, TTS, SFX
- World 1 (Speed City) with 6 levels

### What was fixed/added in v2 (this session):
1. **TTS fixed** — Chrome cancel() bug workaround (50ms delay), higher pitch for kid voice
2. **Critical bug fixed** — Game engine stuck in CHECKING state after wrong answer (now resets to PLAYING)
3. **New wrong answer flow** — Shake wrong → highlight correct (green glow) → Hebrew narration explaining "כמעט! התשובה הנכונה היא X, כי A ועוד B שווה X" → visual dot counting → replacement question (not same, not next)
4. **Name input screen** — First launch prompts for kid's name in Hebrew, TTS narrates prompt, cursor auto-focused, keyboard pop sounds per keypress
5. **Character selection** — 6 CSS heroes (Flash-like ⚡, Spider-like 🕸️, Iron-like ⚙️, Mario-like 🍄, Bat-like 🦇, Racer-like 🏎️) with color schemes
6. **Question count config** — Short (3), Medium (6, default), Long (10) — selectable on first screen
7. **Greeting** — "!היי [name]" spoken on splash screen with happy voice
8. **Splash redesign** — 6 animated hero emoji icons, subtitle, personalized greeting
9. **75% pass threshold** — Below 75% correct → retry screen with "!בוא ננסה שוב" + encouraging narration. Near 75% (60-74%) → "almost there" message
10. **Correct/total counter** — Shows X✓ during gameplay and "X מתוך Y (Z%)" on reward screen
11. **Back buttons** — Gameplay → level select, level select → world map
12. **Speed slider** — On Number Catcher level, range from slow to fast, controls cloud animation duration
13. **Streak counter** — Shows 🔥 N ברצף at 2+, announces at 2, 3, 5, 10 with escalating excitement
14. **Sound variety** — 4 correct sound variations (ascending ding, happy chord, rising sparkle, victory ping), 3 wrong variations, keyboard pops, streak cascade sound, retry sound
15. **Visual "why"** — On wrong addition answers (≤10), shows dot counting: ●●● + ●●●● = 7
16. **Session summary** — When returning to world map, narrates "!היום פתרת X תרגילים"
17. **Better randomization** — Session-seeded variety offset, 40-question anti-repeat pool, 20 retry attempts

---

## 3. All Files (29 source files)

```
math-heroes/
├── index.html              ✅ SPA shell — 6 screen divs (setup, splash, worldMap, levelSelect, gameplay, reward)
├── manifest.json           ✅ PWA manifest
├── sw.js                   ✅ Service worker (cache-first)
├── css/
│   ├── main.css            ✅ Reset, variables, buttons, hero avatar CSS (6 costume layers, 3 sizes)
│   ├── animations.css      ✅ 14 @keyframes + 4 utility classes
│   ├── themes.css          ✅ 6 world color palettes
│   └── screens.css         ✅ All screen layouts + setup screen, character grid, speed slider, visual-why, retry, streak, splash heroes
├── js/
│   ├── app.js              ✅ Entry point — setup flow (name→character→splash), screen router, event delegation, session summary
│   ├── screens/
│   │   ├── splash.js       ✅ 6 hero emoji icons, greeting by name, TTS
│   │   ├── world-map.js    ✅ 6-world grid, unlock states
│   │   ├── level-select.js ✅ Vertical path, stars, back button
│   │   ├── gameplay.js     ✅ MAJOR — new wrong answer flow, streak, back button, score counter, visual why, replacement questions
│   │   └── reward.js       ✅ Pass/fail split — celebration vs retry screen, correct/total display, almost-there
│   ├── engine/
│   │   ├── game-engine.js  ✅ FIXED — state resets to PLAYING after wrong, streak tracking, 75% threshold check, accuracy calc
│   │   ├── question-gen.js ✅ Session-seeded variety, larger anti-repeat pool (40), 20 retry attempts
│   │   ├── difficulty.js   ✅ 6-level adaptive, escalation/de-escalation
│   │   ├── progress.js     ✅ Stars, XP, level completion, unlocks
│   │   └── save-manager.js ✅ v2 schema — player (name, heroCharacter, questionCount, setupComplete), daily stats, migration from v1
│   ├── levels/
│   │   ├── world-data.js   ✅ 6 worlds, World 1 populated (6 levels)
│   │   └── level-types.js  ✅ 6 level types + Number Catcher speed slider
│   ├── audio/
│   │   ├── speech.js       ✅ FIXED — Chrome cancel bug, speakQueued(), higher pitch
│   │   ├── sfx.js          ✅ 4 correct variations, 3 wrong variations, keyPop, streak, retry sounds
│   │   └── hebrew-phrases.js ✅ All Hebrew text + wrongExplanationHebrew(), fillTemplate(), hero names, streak msgs, retry msgs
│   ├── ui/
│   │   ├── buttons.js      ✅ (exists but unused — tap debounce handled by game state)
│   │   ├── animations.js   ✅ Shake, glow, pulse, confetti
│   │   ├── hero-avatar.js  ✅ CSS-drawn hero, 6 costume layers
│   │   └── progress-bar.js ✅ XP bar, stars, animated variants
│   └── utils/
│       └── helpers.js      ✅ shuffle, randomInt, clamp, delay, pickRandom
└── reports/
    ├── PRD_20260330_math_heroes_mvp.md  ✅ Stage 1 PM output
    ├── UX_20260330_math_heroes_mvp.md   ✅ Stage 2 UX (921 lines, from background agent)
    └── ADD_20260330_math_heroes_mvp.md  ✅ Stage 3 Architecture output
```

---

## 4. Git Status

- **Repo:** git@github.com:saginizar/math-heroes.git (personal GitHub, NOT PANW)
- **Branch:** main
- **Last commit:** `141cde8` — "init: project setup with game design document"
- **Uncommitted:** ALL code files + reports — NEEDS COMMIT after testing complete

---

## 5. Save Data Schema (v2)

```json
{
  "version": 2,
  "player": { "name": "ניל", "heroCharacter": "flash_hero", "questionCount": "medium", "setupComplete": true },
  "hero": { "level": 1, "xp": 0, "costumes": [], "vehicles": ["scooter"] },
  "worlds": { "speed_city": { "unlocked": true, "levels": [{ "stars": 0, "completed": false, "bestAccuracy": 0 }, ...] } },
  "difficulty": { "addition": { "level": 1, "history": [] }, ... },
  "stats": { "totalProblems": 0, "totalCorrect": 0, "todayProblems": 0, "todayDate": "2026-03-30" }
}
```

---

## 6. Key Game Flows

### First Launch
Setup (name input → character select + question count) → Splash (greeting) → World Map → Level Select → Gameplay → Reward/Retry

### Wrong Answer Flow
1. Shake wrong button + wrong sound variation
2. Disable all buttons
3. Highlight correct answer (green glow)
4. Hebrew narration: "כמעט! זו לא התשובה הנכונה. התשובה הנכונה היא X, כי A ועוד B שווה X"
5. If addition ≤10: show visual dot counting (●●● + ●●●● = 7)
6. Wait 1.5-2s
7. Reset to PLAYING state
8. Render a NEW replacement question (same problem index, different numbers)

### Level Pass/Fail
- ≥75% correct → Reward screen with stars, costume, XP animation, confetti
- 60-74% correct → Retry screen with "almost there" encouragement
- <60% correct → Retry screen with general encouragement
- Retry restarts the same level

### Streak
- Tracked in game session, resets on wrong answer
- Displayed as "🔥 N ברצף!" at 2+
- Narrated with escalating excitement at 2, 3, 5, 10

---

## 7. User Feedback History (from first test round)

User tested v1 and reported 15 issues. All have been addressed in v2:
1. ✅ No Hebrew narration → Fixed Chrome TTS bug
2. ✅ Correct sound too simple → 4 varied sounds + Hebrew narration
3. ✅ No wrong answer sound/narration → Full explanation flow
4. ✅ No back button → Added on gameplay + level select
5. ✅ Stuck after wrong answer → Fixed game engine state reset
6. ✅ Babyish character → 6 superhero CSS characters with color schemes
7. ✅ Number Catcher too fast → Speed slider added
8. ✅ Only 3 questions → Configurable short/medium/long
9. ✅ No failure threshold → 75% pass rate required
10. ✅ Same questions on restart → Session-seeded randomization
11. ✅ No name input → Name screen on first launch
12. ✅ No personalized greeting → "!היי [name]" with TTS
13. ✅ Splash screen boring → 6 animated hero icons
14. ✅ Inconsistent sound → Varied sounds throughout
15. ✅ Need thorough testing → User is testing now

**User is currently testing v2 and will provide new feedback.**

---

## 8. Agreed Suggestions (approved by user, implemented)

1. ✅ Streak counter with escalating excitement
2. ✅ Keyboard pop sounds during name entry
3. ✅ Sound effect variety (3-4 per type)
4. ✅ Visual "why" dot counting on wrong answers
5. ✅ Session summary when leaving ("today you solved X problems")
6. ✅ Favorite character selection at first launch
7. ✅ "Almost there" encouragement near 75% threshold
8. ✅ Parent stats view — planned for future phase (not built yet)

---

## 9. Cost & Budget

- Budget: $25
- Estimated total spend: ~$8-12 (long session with major v2 rewrite)
- Status: Well within budget

---

## 10. User Preferences & Learnings

- User wants proactive suggestions — "feel free to suggest things I didn't ask for"
- User wants critical thinking — "i expect you to be critical with me and suggest improvements"
- Default selections should be proposed (learned from question count feedback)
- Never guess — ask if unclear
- Background agents DO work but take 20-30 min — don't declare broken prematurely
- Use SendMessage to check agent health, not output file size
- GitHub: personal (saginizar), NOT PANW
- Kid's name: ניל (Neil)

---

## 11. What To Do Next

1. **Process user's v2 feedback** — they're testing now
2. **Fix any new issues** found during testing
3. **Commit + push** once testing is satisfactory
4. **Future:** Phase 2 (Worlds 2-5), Phase 3 (Secret world + polish), Parent stats screen
