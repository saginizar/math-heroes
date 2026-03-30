# MathHeroes / גיבורי המספרים — Game Design Document

## Overview

A local browser-based math learning game for a 4.5-year-old boy who is advanced in math (comfortable with addition, subtraction, basic multiplication). Superhero-themed, Hebrew-native, fully offline PWA. Single-user, no backend, no APIs, no monetization.

**Core principle: Math IS the superpower.** Solving a math problem directly triggers the hero's action in the game world. The answer has a visible, physical consequence — it's not "do math, then watch reward."

## Target User Profile

- Age: 4.5 years old
- Math level: Addition, subtraction, basic multiplication
- Learns fast, gets bored with repetitive/easy tasks
- Loves: Superheroes (Flash, Spidey, Iron Man, Superman, Batman), Cars, Sonic, Mario
- Language: Hebrew (native)
- Reading: Minimal — audio-first UX required
- Device: Tablet (touch-first), also works on PC
- Sessions: ~5 minutes, 3-5 short levels per session
- Supervision: Parent nearby but mostly independent play

## Tech Stack (STRICT REQUIREMENTS)

- **HTML5** single page application
- **CSS3** with custom properties, Grid, Flexbox, keyframe animations
- **Vanilla JavaScript ES6+** — NO frameworks, NO npm, NO build process
- **Web Speech API** for Hebrew text-to-speech (browser native, free, offline)
- **Web Audio API** for procedural sound effects (no audio files needed)
- **LocalStorage** for save/load game state
- **PWA** with manifest.json and service worker for offline tablet install
- **ZERO external dependencies** — everything runs from local files

## Story

Dr. Zero (ד"ר אפס) has stolen the world's numbers. Without numbers, heroes can't use their powers, vehicles can't move, everything is frozen. The child becomes Number Hero (גיבור המספרים) who restores numbers to each world.

## Worlds

### World 1: Speed City / עיר המהירות (PHASE 1 — BUILD THIS FIRST)
- Theme: Flash + Sonic speed world
- Visual: Neon-lit futuristic city, glowing roads, speed trails
- Color palette: Electric blue (#00D4FF), neon yellow (#FFE100), dark purple (#1A0A2E) background
- Hero power: Speed dash — answer determines how far/fast hero runs
- Math focus: Addition (primary), number bonds, sequences
- Levels: 6

### World 2: Web Tower / מגדל הקורים
- Theme: Spider-hero vertical climbing
- Visual: Tall dark tower, webs connecting buildings, night cityscape
- Color palette: Red (#E23636), dark blue (#1B2838), silver web (#C0C0C0)
- Hero power: Web swing — answer = web length to reach platform
- Math focus: Subtraction
- Levels: 6

### World 3: Iron Lab / מעבדת הברזל
- Theme: Iron Man tech workshop
- Visual: High-tech lab, holograms, robot assembly lines, glowing circuits
- Color palette: Gold (#FFD700), red (#B22222), steel gray (#708090)
- Hero power: Gadget building — answer = components assembled
- Math focus: Multiplication (arrays, grouping, skip counting)
- Levels: 6

### World 4: Mushroom Quest / משימת הפטריות
- Theme: Mario-style platformer
- Visual: Colorful platforms, green pipes, bouncing coins, brick blocks
- Color palette: Red (#E52521), green (#43B047), bright blue sky (#6DB6FF)
- Hero power: Platform creation — correct answer makes platforms appear
- Math focus: Patterns, sequences, logic, number bonds
- Levels: 6

### World 5: Grand Circuit / המסלול הגדול
- Theme: Racing / Cars
- Visual: Race track, boost pads, pit stops, cheering pixel crowd
- Color palette: Racing red (#FF0000), checkered black/white, grass green (#228B22)
- Hero power: Speed boost — answer = boost power
- Math focus: Mixed operations, comparisons, place value
- Levels: 6

### Secret World 6: Dr. Zero's Lair / המאורה של ד"ר אפס
- Unlocks after completing all 5 worlds
- Theme: Dark fortress with number puzzles
- Color palette: Dark purple (#2D1B69), toxic green (#39FF14), black
- Math focus: All topics combined at highest difficulty
- Levels: 5 boss battles

## Level Types (12 varieties)

### 1. Power Launch / שיגור כוח
- Player sees a math problem. Answer determines the power/distance of hero's action.
- Visual: Hero stands on launch pad. Answer = force applied. Hero shoots across screen.
- Interaction: Tap one of 3 answer buttons (large, touch-friendly).
- Math: Addition or Subtraction.
- Example: "3 + 4 = ?" → options [7, 6, 8] → correct: 7 → hero dashes 7 units.

### 2. Bridge Builder / בונה גשרים
- A number sequence with gaps. Fill missing numbers to complete bridge segments.
- Visual: Bridge with missing pieces over a gap. Each correct number adds a plank.
- Interaction: Tap the correct number from options to fill each gap.
- Math: Sequences, patterns.
- Example: 2, 4, _, 8, 10 → answer: 6.

### 3. Shield Match / מגן מתאים
- A target number shown on shield. Grid of 6 number orbs. Tap TWO that sum to target.
- Visual: Shield in center with target. Glowing orbs around it with numbers.
- Interaction: Tap two orbs. If they sum to target, they merge into shield (satisfying animation).
- Math: Number bonds, addition.
- Example: Target = 9. Grid: [3, 7, 5, 4, 2, 6]. Valid: 3+6, 7+2, 5+4.

### 4. Gadget Grid / רשת הגאדג'טים
- Items arranged in a grid (rows × columns). Count the total.
- Visual: Lab table with items in neat rows and columns. Robot waits to assemble.
- Interaction: Tap the correct total from 3 options.
- Math: Multiplication as arrays.
- Example: 3 rows × 4 bolts = ? → 12.

### 5. Zip Line / רכבל
- Two paths, each showing a math expression. Pick the one with bigger/smaller result.
- Visual: Two zip lines. Hero must ride the correct one.
- Interaction: Tap left or right zip line.
- Math: Comparison of expressions.
- Example: "8 - 3" vs "7 - 5" → 5 vs 2 → left is bigger.

### 6. Code Lock / מנעול קוד
- A pattern/sequence with one missing number. Pick the correct number to unlock a door.
- Visual: Locked door with number sequence above it. Keypad below.
- Interaction: Tap correct number on keypad.
- Math: Pattern recognition.
- Example: 1, 1, 2, 1, 1, 2, 1, 1, ? → 2.

### 7. Split Power / פיצול כוח
- A number shown on a crystal. Drag a divider to split it into two parts.
- Visual: Glowing crystal with number. Draggable slider splits it.
- Interaction: Drag slider to create two valid parts (free-form) or find specific split.
- Math: Number decomposition/bonds.
- Example: Crystal shows 8. Find: ? + 5 = 8 → drag to show 3 | 5.

### 8. Tower Stack / מגדל קומות
- Build a number by stacking blocks of 10s and 1s to reach a target.
- Visual: Target number at top. Blocks of "10" and "1" to drag onto tower.
- Interaction: Tap to add 10-blocks and 1-blocks. Confirm when reached target.
- Math: Place value.
- Example: Target = 34 → add 3 ten-blocks + 4 one-blocks.

### 9. Path Chooser / בוחר שבילים
- Three paths, each labeled with a math expression. One equals the target number.
- Visual: Three branching paths with expressions floating above them.
- Interaction: Tap the correct path. Hero runs down it.
- Math: Mixed operations evaluation.
- Example: Target = 10. Paths: [5+5, 3×4, 12-3] → 5+5 is correct.

### 10. Group Stamp / חותמת קבוצות
- Stamp groups of items. "Make N groups of M items." Then count the total.
- Visual: Blank canvas. Each tap creates a group of M items. After N taps, count.
- Interaction: Tap to stamp groups, then tap correct total.
- Math: Multiplication as repeated groups.
- Example: "Make 3 groups of 4 stars" → stamp stamp stamp → "How many?" → 12.

### 11. Number Catcher / תופס מספרים
- Numbers move across screen. Catch only numbers matching a rule.
- Visual: Numbers on floating clouds/platforms moving horizontally. Hero at bottom.
- Interaction: Tap matching numbers as they pass. Ignore non-matching.
- Math: Classification, comparison, multiples.
- Example: "Catch numbers bigger than 5!" → numbers float: 2, 7, 3, 9, 1, 6 → tap 7, 9, 6.

### 12. Hero Rescue / חילוץ גיבורים
- Multi-step challenge: 2-3 connected problems. Each answer feeds the next.
- Visual: Multi-phase scene. Hero progresses through phases.
- Interaction: Solve each phase sequentially.
- Math: Multi-step reasoning, mixed operations.
- Example: Phase 1: 5+3=8. Phase 2: sequence 2,4,6,?=8. Phase 3: 8+2=10. Hero freed!

## PHASE 1 MVP — Exact Scope (BUILD THIS)

### What to build:
1. **index.html** — single page entry point loading all CSS and JS modules
2. **manifest.json** — PWA manifest for tablet "Add to Home Screen"
3. **sw.js** — service worker caching all files for offline use
4. **Splash screen** — game logo (CSS-drawn, no image files), big "!התחל" button
5. **World map screen** — 6 world nodes on a stylized map. Only World 1 (Speed City) is unlocked and playable. Others shown but locked (grayed + lock icon).
6. **Level select screen** — 6 levels shown as connected nodes on a path. Stars displayed. Next unplayed level pulses.
7. **Gameplay screen** — full-screen game area for playing levels. Renders different level types.
8. **Level complete screen** — star reveal animation, costume piece, "המשך" / "עוד פעם" buttons
9. **4 level types implemented**: Power Launch, Path Chooser, Number Catcher, Shield Match
10. **World 1 levels** — 6 fully configured levels for Speed City
11. **Question generation engine** — procedural math problems with difficulty scaling
12. **Adaptive difficulty engine** — tracks accuracy, adjusts number range and distractor quality
13. **Hebrew TTS system** — Web Speech API wrapper that speaks all game text in Hebrew
14. **Procedural SFX** — Web Audio API sound effects (whoosh, ding, pop, fanfare, etc.)
15. **Save system** — LocalStorage save/load with auto-save after each level
16. **Progress system** — XP, hero levels, stars, costume pieces tracking
17. **Hero avatar** — simple CSS-drawn hero that visually changes with costume pieces
18. **Responsive tablet layout** — touch-first, large buttons (min 48px tap target), works on tablet and PC
19. **RTL support** — all Hebrew text properly right-to-left

### World 1: Speed City — 6 Levels Configuration

**Level 1: "הריצה הראשונה" (First Run)**
- Type: PowerLaunch
- Difficulty: 1 (numbers 1-5)
- Problems: 3
- Math: Addition
- Reward: speed_boots

**Level 2: "מלכודת מהירות" (Speed Trap)**
- Type: PathChooser
- Difficulty: 1 (numbers 1-5)
- Problems: 3
- Math: Addition (evaluate expressions)
- Reward: speed_gloves

**Level 3: "מרוץ המספרים" (Number Race)**
- Type: NumberCatcher
- Difficulty: 1-2 (compare to threshold)
- Problems: 8 numbers, catch those > 4
- Math: Comparison
- Reward: speed_belt

**Level 4: "ריצה כפולה" (Double Dash)**
- Type: ShieldMatch
- Difficulty: 2 (targets 6-10)
- Problems: 3 rounds
- Math: Number bonds
- Reward: speed_mask

**Level 5: "גשר הברקים" (Lightning Bridge)**
- Type: BridgeBuilder (bonus level type — implement as variant of PathChooser with sequence UI)
- Difficulty: 1-2 (sequences)
- Problems: 4 sequences
- Math: Patterns
- Reward: speed_cape

**Level 6: "העימות" (The Showdown)**
- Type: HeroRescue (multi-step)
- Difficulty: 2 (mixed)
- Problems: 3 connected phases
- Math: Addition + patterns combined
- Reward: speed_crown → FULL COSTUME + vehicle_motorcycle

### Adaptive Difficulty Parameters

```
Difficulty 1: numbers 1-5,   visual aids ON,  distractors ±3 away
Difficulty 2: numbers 1-10,  visual aids ON,  distractors ±2 away
Difficulty 3: numbers 1-10,  visual aids OFF, distractors ±1 away
Difficulty 4: numbers 1-20,  visual aids OFF, close distractors
Difficulty 5: numbers 1-50,  visual aids OFF, tricky near-misses
Difficulty 6: numbers 1-100, visual aids OFF, word problems

Escalation: >90% accuracy for 5 problems → +1 level
            >95% accuracy for 3 problems → +2 levels (skip ahead)
            <50% accuracy for 3 problems → -1 level + hint offered
```

### Progressive Hints (after 2 wrong attempts on same problem)
1. Visual counting dots appear alongside numbers
2. Two wrong options gray out (50/50)
3. Correct answer gently pulses

### Hebrew Phrases (all narration text)

```javascript
// Splash
splashTitle: "גיבורי המספרים",
splashStart: "התחל!",

// World Map
worldMapTitle: "מפת העולמות",
worldLocked: "נעול",

// Missions
mission_1_1: "גיבור! הגיע הזמן לרוץ!",
mission_1_2: "שלושה שבילים. רק אחד נכון!",
mission_1_3: "תפוס רק מספרים גדולים מארבע!",
mission_1_4: "מצא שני מספרים שביחד עושים את המספר!",
mission_1_5: "מה המספר החסר? בנה את הגשר!",
mission_1_6: "ד"ר אפס כאן! שלוש משימות לשחרר את העיר!",

// Feedback
correct: ["!מדהים", "!כל הכבוד", "!אתה גיבור אמיתי", "!נהדר", "!מושלם"],
wrong: "כמעט! נסה שוב",
hint: "נסה לספור ביחד",
levelComplete: "!המשימה הושלמה",
worldComplete: "!עולם שוחרר",

// UI
continue: "המשך",
playAgain: "עוד פעם",
stars: "כוכבים",
heroLevel: "רמה",

// Numbers (for TTS)
numbers: { 1: "אחת", 2: "שתיים", 3: "שלוש", 4: "ארבע", 5: "חמש",
           6: "שש", 7: "שבע", 8: "שמונה", 9: "תשע", 10: "עשר",
           11: "אחת עשרה", 12: "שתים עשרה", /* ... up to 100 */ },

// Operations (for TTS)
plus: "ועוד",
minus: "פחות",
times: "כפול",
equals: "שווה",
howMuch: "כמה זה",
biggerThan: "גדול מ",
smallerThan: "קטן מ",
```

### Visual Style Guide
- **Direction**: RTL for all text and UI flow
- **Font**: System sans-serif, large (24px minimum for numbers, 18px for UI text)
- **Buttons**: Minimum 60px height, 48px width, rounded corners (12px), bold colors
- **Colors**: Each world has its own palette (defined above). UI chrome uses dark background (#1A1A2E) with white text.
- **Animations**: CSS keyframes for hero movement, button presses, star reveals, level transitions. Use transform/opacity for GPU acceleration.
- **No images**: All visuals are CSS shapes, gradients, box-shadows, and unicode/emoji characters. Hero is built from CSS (circle head, rectangle body, colored accessories).
- **Touch**: touch-action: manipulation on game areas. Passive event listeners. No hover-dependent interactions.

### File-by-File Build Specification

**index.html**: Single HTML file. Loads all CSS files, then all JS modules. Contains semantic structure with div screens (splash, world-map, level-select, gameplay, level-complete). Only one screen visible at a time.

**css/main.css**: CSS reset, custom properties (--color-primary, --color-bg, etc.), global typography, RTL direction, touch-action rules, body/html full-height.

**css/screens.css**: Layout for each screen. Flexbox centering. Grid for world map nodes and level select nodes.

**css/animations.css**: @keyframes for: heroRun, heroDash, starReveal, buttonPulse, fadeIn, fadeOut, slideUp, shakeWrong, glowCorrect, numberFloat, confettiBurst.

**css/themes.css**: World-specific color overrides. .world-speed-city { --world-primary: #00D4FF; ... }

**js/app.js**: Entry point. Initializes all modules. Screen router (showScreen function). Event delegation for all button clicks. Loads saved game.

**js/screens/splash.js**: Renders splash screen. Animates title. Single "start" button handler.

**js/screens/world-map.js**: Renders 6 world nodes on map layout. Locked/unlocked state. Click handler for unlocked worlds.

**js/screens/level-select.js**: Renders 6 level nodes connected by path lines. Star display. Pulsing next level. Click handler.

**js/screens/gameplay.js**: Main game controller. Receives level config. Delegates to level type renderers. Manages problem flow (next problem, check answer, trigger animations). Calls speech and SFX.

**js/screens/reward.js**: Level complete screen. Star reveal animation. Costume piece reveal. XP bar animation. Continue/replay buttons.

**js/engine/game-engine.js**: State machine (IDLE, PLAYING, CHECKING, ANIMATING, COMPLETE). Manages level flow. Tracks current problem index, correct count, attempts per problem.

**js/engine/question-gen.js**: Generates math problems based on operation type + difficulty level. Returns { question, correctAnswer, options, visualAid, hebrewText }. Anti-repetition (tracks last 20). Distractor generation (close, common-error, random).

**js/engine/difficulty.js**: Tracks per-operation accuracy (last 10 problems). Applies escalation/de-escalation rules. Returns current difficulty level per operation.

**js/engine/progress.js**: Calculates XP awards. Tracks hero level (XP / 200). Manages star calculation (1=complete, 2=all first-try, 3=all first-try + confident). Manages costume/vehicle unlocks.

**js/engine/save-manager.js**: Read/write to LocalStorage key "mathheroes_save". Auto-save after level complete. Version migration. Export/import JSON for backup.

**js/levels/level-types.js**: Defines render + interaction logic for each of the 4 MVP level types (PowerLaunch, PathChooser, NumberCatcher, ShieldMatch). Each type: setup(container, problemData), checkAnswer(input), getResult(), cleanup().

**js/levels/world-data.js**: Static configuration for all worlds and levels. World 1 fully defined. Worlds 2-5 as stubs (name, locked: true). Each level: { id, nameHe, type, difficulty, operation, problemCount, reward }.

**js/audio/speech.js**: Wrapper around Web Speech API. speak(hebrewText, rate=0.9). Queues utterances. Handles API unavailability gracefully (falls back to showing text prominently). Uses Hebrew voice if available.

**js/audio/sfx.js**: Web Audio API procedural sounds. Functions: playCorrect(), playWrong(), playWhoosh(), playPop(), playFanfare(), playPowerUp(). Each creates oscillator nodes with envelopes — no audio files.

**js/audio/hebrew-phrases.js**: All Hebrew text constants exported as object. Numbers 1-100 in Hebrew words. Operation words. UI labels. Feedback phrases. Mission briefings.

**js/ui/buttons.js**: Creates large touch-friendly button elements. Handles both click and touchend. Ripple animation on press. Disabled state styling.

**js/ui/animations.js**: Helper functions for triggering CSS animations. confettiBurst(element), shakeElement(element), glowElement(element), flyNumber(from, to, number).

**js/ui/hero-avatar.js**: Renders hero as CSS shapes. Base hero + costume layers. updateCostume(costumeList) redraws with equipped pieces. Simple but recognizable superhero silhouette.

**js/ui/progress-bar.js**: Renders XP bar (horizontal fill). Star display (3 star outlines, fill on earn). Hero level badge. All animated on change.

**js/utils/helpers.js**: shuffleArray, randomInt, clamp, delay (Promise-based), formatNumber.

**manifest.json**: PWA manifest. name: "גיבורי המספרים", short_name: "MathHeroes", display: standalone, orientation: landscape preferred, theme_color: #1A1A2E, background_color: #1A1A2E.

**sw.js**: Service worker. On install: cache all HTML/CSS/JS files. On fetch: serve from cache first, fall back to network. Enables full offline play after first load.

## Quality Requirements

1. NO console errors in Chrome or Safari
2. All touch interactions respond in < 100ms
3. Animations run at 60fps (use transform/opacity only)
4. Hebrew text renders correctly RTL in all screens
5. Web Speech API gracefully degrades if no Hebrew voice (shows text instead)
6. Game state persists across browser closes (LocalStorage)
7. PWA installs successfully on Chrome Android and Safari iOS
8. All buttons minimum 48px touch target
9. Landscape AND portrait orientations work (landscape preferred)
10. No external network requests — works fully offline
