# UX Design Document: MathHeroes Phase 1 MVP

**Document ID:** UX_20260330_math_heroes_mvp
**Date:** 2026-03-30
**Status:** READY FOR ARCHITECT
**Source:** PRD_20260330_math_heroes_mvp.md, GDD.md

---

## 1. Overview

MathHeroes is an audio-first, touch-optimized Hebrew math game for a 4.5-year-old pre-reader on a tablet. The core UX principle is that **math problems are superhero powers** — the child's answer directly triggers visible hero actions with no intermediate reward screens.

The experience is designed for:
- **Independent play** — no reading required, all instructions spoken
- **Fast 5-minute sessions** — 3-5 levels completed per play session
- **Immediate feedback** — every tap triggers visible response in under 100ms
- **No pressure** — no timers, encouraging tone, progressive hints prevent frustration
- **Offline-first** — works with airplane mode on after first install

---

## 2. User Flows

### Flow A: First Launch (New User)
```
[App Opens] → [Splash Screen]
    ↓ tap "!התחל"
[World Map] (only Speed City unlocked)
    ↓ tap Speed City
[Level Select] (Level 1 pulsing, rest locked)
    ↓ tap Level 1
[Gameplay: הריצה הראשונה]
    ↓ complete 3 problems
[Level Complete] (1-3 stars + speed_boots)
    ↓ tap "המשך"
[Level Select] (Level 1 has stars, Level 2 pulsing)
    ↓ tap Level 2 or close app
```

### Flow B: Returning User
```
[App Opens] → [Splash Screen]
    ↓ tap "!התחל"
[World Map] (progress restored from LocalStorage)
    ↓ tap Speed City
[Level Select] (shows stars on completed levels, next level pulsing)
    ↓ tap any available level
[Gameplay] → [Level Complete] → [Level Select]
```

### Flow C: Wrong Answer Path
```
[Problem Displayed + TTS speaks]
    ↓ tap wrong answer
[Shake animation + gentle buzz SFX + "כמעט! נסה שוב" TTS]
    ↓ same problem stays (attempt counter +1)
    ↓ if 2 wrong: Hint 1 (visual dots appear)
    ↓ if 3 wrong: Hint 2 (two options gray out)
    ↓ if 4 wrong: Hint 3 (correct pulses)
    ↓ tap correct answer (always reachable)
[Correct animation + ding SFX + positive TTS]
    ↓ next problem
```

### Flow D: Level Replay
```
[Level Complete screen]
    ↓ tap "עוד פעם"
[Same level restarts from problem 1]
    ↓ (score resets, can earn better stars)
```

### Flow E: Session End
```
[Any screen] → child closes app/tab
[Auto-save triggers on visibility change]
    ↓ next launch
[Splash] → [World Map] (all progress preserved)
```

---

## 3. Screen Wireframes

### Screen 1: Splash Screen
```
┌──────────────────────────────────────────┐
│                                          │
│                                          │
│         ╔══════════════════════╗          │
│         ║  גיבורי המספרים     ║          │
│         ║  ─────────────────   ║          │
│         ║  [Hero Silhouette]   ║          │
│         ║  CSS-drawn hero      ║          │
│         ╚══════════════════════╝          │
│                                          │
│           ┌──────────────┐               │
│           │   !התחל      │  ← 80px tall  │
│           │  (pulsing)   │    200px wide  │
│           └──────────────┘               │
│                                          │
│  Background: radial gradient             │
│  #1A0A2E → #0D0D2B                      │
└──────────────────────────────────────────┘

TTS on load: "גיבורי המספרים"
Animation: Title fades in (0.8s), hero scales up (0.6s), button pulses infinitely
```

### Screen 2: World Map
```
┌──────────────────────────────────────────┐
│  מפת העולמות                    [Hero]   │  ← RTL: title right, hero avatar left
│  ─────────────────────────────────────   │
│                                          │
│     ┌─────────┐          ┌─────────┐     │
│     │ 🔒      │          │ ⚡      │     │
│     │ מעבדת   │          │ עיר     │     │
│     │ הברזל   │  ─────── │ המהירות │     │  ← World 1: BRIGHT, colored, tappable
│     │ (gray)  │          │ (BLUE)  │     │     Others: grayed + lock icon
│     └─────────┘          └─────────┘     │
│          │                    │           │
│     ┌─────────┐          ┌─────────┐     │
│     │ 🔒      │          │ 🔒      │     │
│     │ משימת   │  ─────── │ מגדל    │     │
│     │ הפטריות │          │ הקורים  │     │
│     │ (gray)  │          │ (gray)  │     │
│     └─────────┘          └─────────┘     │
│          │                    │           │
│     ┌─────────┐          ┌─────────┐     │
│     │ 🔒      │          │ 🔒      │     │
│     │ המסלול  │          │ המאורה  │     │
│     │ הגדול   │          │ של ד"ר  │     │
│     │ (gray)  │          │ אפס     │     │
│     └─────────┘          └─────────┘     │
│                                          │
└──────────────────────────────────────────┘

Layout: CSS Grid 3×2
World nodes: 120px × 120px rounded squares
Speed City node: electric blue (#00D4FF) border glow, neon yellow (#FFE100) text
Locked nodes: #444 background, #666 text, lock icon overlay
TTS on enter: "מפת העולמות"
Tap locked world: gentle buzz SFX, lock shakes
```

### Screen 3: Level Select (Speed City)
```
┌──────────────────────────────────────────┐
│  עיר המהירות                    [Hero]   │
│  ─────────────────────────────────────   │
│                                          │
│  XP: [████████░░░░░░░░] רמה 1           │  ← XP bar, RTL
│                                          │
│          ┌───┐                           │
│       6  │🔒 │  העימות                   │
│          └─┬─┘                           │
│            │                             │
│          ┌───┐                           │
│       5  │🔒 │  גשר הברקים              │
│          └─┬─┘                           │
│            │                             │
│          ┌───┐                           │
│       4  │🔒 │  ריצה כפולה              │
│          └─┬─┘                           │
│            │                             │
│          ┌───┐                           │
│       3  │🔒 │  מרוץ המספרים            │
│          └─┬─┘                           │
│            │                             │
│          ┌───┐                           │
│       2  │🔒 │  מלכודת מהירות           │
│          └─┬─┘                           │
│            │                             │
│          ┌───┐                           │
│    >>>1  │✨ │  הריצה הראשונה    <<<     │  ← Pulsing, glowing
│          └───┘                           │
│                                          │
│  ┌──────┐                                │
│  │ חזרה │  ← Back to world map           │
│  └──────┘                                │
└──────────────────────────────────────────┘

Level nodes: 60px circles, connected by vertical line
Completed: filled circle + star icons below (★★☆ etc.)
Next available: pulsing glow animation (buttonPulse)
Locked: gray circle + lock icon
Path flows BOTTOM to TOP (level 1 at bottom, 6 at top) — feels like climbing
Level names shown to the right of each node (RTL)
Back button: bottom-left (60px, clear icon)
```

### Screen 4: Gameplay — Power Launch Type
```
┌──────────────────────────────────────────┐
│  הריצה הראשונה              ★☆☆  [1/3]  │  ← Level name RTL, stars, problem counter
│  ─────────────────────────────────────   │
│                                          │
│                                          │
│            ?כמה זה 3 ועוד 4              │  ← Problem text, large (32px), RTL
│                                          │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │                                     │ │
│  │   [Hero on launch pad]              │ │  ← Game area: hero + visual scene
│  │   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ │     CSS cityscape background
│  │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │     Hero dashes on correct answer
│  │                                     │ │
│  └─────────────────────────────────────┘ │
│                                          │
│    ┌────────┐  ┌────────┐  ┌────────┐   │
│    │   8    │  │   7    │  │   6    │   │  ← Answer buttons: 80px × 60px
│    │        │  │        │  │        │   │     Bold number (36px font)
│    └────────┘  └────────┘  └────────┘   │     Rounded corners (12px)
│                                          │     Bright colors on dark bg
│                                          │
│    [● ● ● ● ●  ● ● ●]                  │  ← Visual aid dots (difficulty 1-2)
│    3 dots    +  4 dots                   │     Shows concrete counting aid
│                                          │
└──────────────────────────────────────────┘

Answer buttons: 3 options, evenly spaced, 20px gap between
Correct button: glowCorrect animation (green glow) → hero dashes
Wrong button: shakeWrong animation (red flash, shake) → stays on problem
TTS speaks problem on display, speaks feedback on answer
Visual aid dots: only at difficulty 1-2, hidden at 3+
```

### Screen 4b: Gameplay — Path Chooser Type
```
┌──────────────────────────────────────────┐
│  מלכודת מהירות              ★☆☆  [1/3]  │
│  ─────────────────────────────────────   │
│                                          │
│              מספר מטרה: 5                │  ← Target number, large (40px)
│              ═══════════                 │
│                                          │
│    ┌────────────────────────────────┐    │
│    │         [Hero at top]          │    │
│    │        ╱      │      ╲         │    │
│    │      ╱        │        ╲       │    │  ← Three branching paths
│    │    ╱          │          ╲     │    │
│    │  ┌────┐   ┌────┐    ┌────┐   │    │
│    │  │2+3 │   │2+4 │    │1+3 │   │    │  ← Expression on each path
│    │  │    │   │    │    │    │   │    │     80px × 60px buttons
│    │  └────┘   └────┘    └────┘   │    │
│    │                                │    │
│    └────────────────────────────────┘    │
│                                          │
│  TTS: "!שלושה שבילים. רק אחד נכון"      │
│                                          │
└──────────────────────────────────────────┘

Correct path: hero runs down it (heroDash animation)
Wrong path: path flashes red, hero stays at top, gentle buzz
```

### Screen 4c: Gameplay — Number Catcher Type
```
┌──────────────────────────────────────────┐
│  מרוץ המספרים               ★☆☆  [4/8]  │
│  ─────────────────────────────────────   │
│                                          │
│      !תפוס רק מספרים גדולים מארבע       │  ← Rule text (24px)
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │  ┌──┐                        ┌──┐  │ │
│  │  │ 7│→→→                ←←←← │ 3│  │ │  ← Numbers float on clouds
│  │  └──┘                        └──┘  │ │     Move horizontally
│  │          ┌──┐                      │ │     4 seconds to cross
│  │     ←←←← │ 9│→→→                  │ │
│  │          └──┘                      │ │
│  │  ┌──┐                   ┌──┐      │ │
│  │  │ 2│→→→           ←←←← │ 6│      │ │
│  │  └──┘                   └──┘      │ │
│  └─────────────────────────────────────┘ │
│                                          │
│   נתפסו: ✓✓✓  פספוסים: ✗               │  ← Caught/missed counter
│                                          │
└──────────────────────────────────────────┘

Number clouds: 60px × 50px, rounded, semi-transparent
Tap correct: cloud pops with sparkle, number flies up, ding SFX
Tap wrong: cloud shakes, gentle buzz
Numbers float at staggered intervals (not all at once)
Speed: 4 seconds to cross at difficulty 1
```

### Screen 4d: Gameplay — Shield Match Type
```
┌──────────────────────────────────────────┐
│  ריצה כפולה                 ★☆☆  [1/3]  │
│  ─────────────────────────────────────   │
│                                          │
│   !מצא שני מספרים שביחד עושים           │
│                                          │
│              ┌──┐                        │
│         ┌──┐ │  │ ┌──┐                   │
│         │ 3│ │  │ │ 7│                   │  ← 6 number orbs around shield
│         └──┘ │  │ └──┘                   │
│    ┌──┐      │ 9│      ┌──┐              │  ← Shield in center with target
│    │ 5│      │  │      │ 4│              │
│    └──┘      │  │      └──┘              │
│         ┌──┐ │  │ ┌──┐                   │
│         │ 2│ │  │ │ 6│                   │
│         └──┘ └──┘ └──┘                   │
│                                          │
│  TTS: "!מצא שני מספרים שביחד עושים תשע" │
│                                          │
└──────────────────────────────────────────┘

Shield: 100px circle, bold border, target number centered (40px font)
Orbs: 60px circles, arranged in ring around shield
First tap: orb highlights (border glow)
Second tap: if pair sums to target → both fly into shield, merge animation, ding
           if not → both shake, reset highlight, gentle buzz
Valid pairs for target 9: (3,6), (7,2), (5,4)
```

### Screen 5: Level Complete
```
┌──────────────────────────────────────────┐
│                                          │
│            !המשימה הושלמה                │  ← "Mission Complete!" (28px)
│                                          │
│              ★ ★ ☆                       │  ← Stars reveal one by one
│           (star animation)               │     0.5s delay between each
│                                          │
│           ┌──────────┐                   │
│           │  [Hero]  │                   │  ← Hero with new costume piece
│           │  + new   │                   │
│           │  boots!  │                   │
│           └──────────┘                   │
│                                          │
│       פריט חדש: נעלי מהירות!             │  ← "New item: Speed Boots!"
│                                          │
│    XP: [████████████░░░░] +60            │  ← XP bar animates fill
│    רמה: 1                                │
│                                          │
│    ┌──────────┐     ┌──────────┐         │
│    │  המשך   │     │ עוד פעם  │         │  ← 80px × 60px buttons
│    └──────────┘     └──────────┘         │
│                                          │
│  Background: confettiBurst animation     │
└──────────────────────────────────────────┘

Star reveal: each star spins in from above (0.5s each, staggered)
Costume reveal: slides up from bottom with powerUp SFX
XP bar: smooth fill animation (1s ease-out)
Confetti: CSS particles (small colored squares) explode from center
TTS: "!המשימה הושלמה" then "!כל הכבוד, אתה גיבור אמיתי"
Fanfare SFX plays over animation
```

---

## 4. Component Breakdown

### 3.1 ActionButton
```
┌────────────────┐
│   Label Text   │  Height: 60px min, Width: auto (min 80px)
│                │  Border-radius: 12px
└────────────────┘  Font: 24px bold, system sans-serif
                    Touch target: 60px × 80px (exceeds 48px minimum)
                    States: default, hover (non-touch only), pressed (scale 0.95), disabled (gray)
                    Ripple: radial gradient expands from tap point (0.3s)
                    Colors: per-context (primary blue, correct green, wrong red)
```

### 3.2 NumberButton (Answer Option)
```
┌────────┐
│   7    │  Height: 60px, Width: 80px
│        │  Border-radius: 12px
└────────┘  Font: 36px bold
            Background: #2A2A4A (dark)
            Border: 3px solid #00D4FF (world color)
            Correct state: bg → #22AA44, glowCorrect animation
            Wrong state: bg → #AA2244, shakeWrong animation
            Disabled state: opacity 0.3
```

### 3.3 StarDisplay
```
★ ★ ☆     Filled star: #FFE100 (gold)
           Empty star: #444 (dark gray outline)
           Size: 30px per star
           Animation: starReveal — spin + scale from 0 → 1 (0.5s each)
           Always shows 3 positions
```

### 3.4 XPBar
```
[████████░░░░░░░░] רמה 1
Bar: 200px wide, 16px tall, rounded ends
Fill: linear-gradient #00D4FF → #00FF88
Background: #333
Label: "רמה X" right-aligned (RTL)
Animation: width transition 1s ease-out on XP change
```

### 3.5 HeroAvatar
```
    ┌─┐
   ╱   ╲      Head: 30px circle (#FFD4B0 skin)
  │ ○ ○ │     Eyes: 4px circles
   ╲ ─ ╱      Body: 25px × 40px rectangle
    │█│        Base color: #555 (gray suit)
   ╱│█│╲
  ╱ │█│ ╲     Costume overlays:
 ╱  └─┘  ╲    - speed_boots: colored feet blocks
│  │   │  │    - speed_gloves: colored hand blocks
   │   │       - speed_belt: horizontal stripe at waist
   │   │       - speed_mask: colored head band
   ▓   ▓      - speed_cape: triangle behind body
               - speed_crown: triangle on head

Sizes: Small (40px tall, in-game), Medium (80px, level select), Large (120px, reward screen)
```

### 3.6 VisualAidDots
```
● ● ●  ○  ● ● ● ●
 (3)   +    (4)

Dots: 12px circles, filled
Grouped by operand with "+" or operation symbol between
Colors: first group #00D4FF, second group #FFE100
Only shown at difficulty 1-2
Fade in when displayed (0.3s)
```

### 3.7 FloatingNumber (for Number Catcher)
```
┌──────┐
│  7   │  Cloud: 60px × 50px, border-radius: 25px
│ ☁️   │  Background: rgba(255,255,255,0.15)
└──────┘  Font: 32px bold, white
          Movement: CSS translateX animation, 4s linear
          Caught: scale(0) + translateY(-50px), 0.3s
          Missed: opacity → 0 at edge
```

### 3.8 Shield (for Shield Match)
```
    ╔═══╗
   ╱     ╲    Circle: 100px, border 4px solid #FFE100
  │       │   Background: radial-gradient(#1A0A2E, #0D0D2B)
  │   9   │   Target number: 40px bold, centered
  │       │   Glow: box-shadow 0 0 20px rgba(255,225,0,0.5)
   ╲     ╱    Pulse animation when awaiting input
    ╚═══╝
```

### 3.9 ProgressCounter
```
[1/3]  or  נתפסו: ✓✓✓  פספוסים: ✗

Position: top-right of gameplay screen
Font: 18px, #888 (subtle, not distracting)
Updates immediately on problem completion
```

---

## 5. Interaction Patterns

### 4.1 Power Launch (שיגור כוח)
```
1. Screen renders: problem text + hero on launch pad + 3 answer buttons + visual dots
2. TTS speaks: "כמה זה שלוש ועוד ארבע?" (How much is 3 plus 4?)
3. Child taps answer button:
   a. CORRECT:
      - Button glows green (glowCorrect, 0.3s)
      - TTS: random positive phrase ("!מדהים")
      - SFX: playCorrect() (ding)
      - Hero dash animation: translateX proportional to answer value (1s)
      - SFX: playWhoosh() during dash
      - After dash: advance to next problem (0.5s pause)
   b. WRONG:
      - Button shakes red (shakeWrong, 0.3s)
      - SFX: playWrong() (gentle buzz)
      - TTS: "כמעט! נסה שוב"
      - Attempt counter increases
      - Hints activate if attempts >= 2
      - Same problem stays
4. After all problems: transition to Level Complete (0.5s fadeOut → fadeIn)
```

### 4.2 Path Chooser (בוחר שבילים)
```
1. Screen renders: target number at top + 3 path buttons with expressions
2. TTS speaks: "שלושה שבילים. רק אחד שווה ל..." + target number
3. Child taps a path:
   a. CORRECT:
      - Path lights up green
      - Hero runs down path (heroDash, 1.2s)
      - SFX: playWhoosh() + playCorrect()
      - TTS: positive feedback
   b. WRONG:
      - Path flashes red, shakes
      - SFX: playWrong()
      - TTS: "כמעט! נסה שוב"
      - Hero stays at top, same problem
4. Repeat for each problem
```

### 4.3 Number Catcher (תופס מספרים)
```
1. Screen renders: rule text at top + empty game area
2. TTS speaks: the rule (e.g., "!תפוס רק מספרים גדולים מארבע")
3. Numbers begin floating across screen at staggered intervals:
   - First number after 1s delay
   - New number every 2s
   - Each takes 4s to cross (difficulty 1)
   - Mix of matching and non-matching
4. Child taps floating number:
   a. MATCHES RULE:
      - Number pops with sparkle animation
      - SFX: playCorrect()
      - Caught counter increments
   b. DOESN'T MATCH:
      - Number shakes briefly
      - SFX: playWrong()
5. Number exits screen without tap:
   a. SHOULD HAVE CAUGHT: miss counter increments (no harsh feedback)
   b. CORRECTLY IGNORED: no feedback (correct non-action)
6. After all 8 numbers have passed: tally score, transition to complete
```

### 4.4 Shield Match (מגן מתאים)
```
1. Screen renders: shield with target + 6 number orbs
2. TTS speaks: "מצא שני מספרים שביחד עושים" + target number
3. Child taps first orb:
   - Orb highlights (border glow, scale 1.1)
   - SFX: playPop()
4. Child taps second orb:
   a. PAIR SUMS TO TARGET:
      - Both orbs fly into shield (0.5s animation)
      - Shield pulses with energy
      - SFX: playCorrect() + playPowerUp()
      - TTS: positive feedback
      - Round complete → next round (new target + new orbs)
   b. PAIR DOESN'T SUM:
      - Both orbs shake
      - SFX: playWrong()
      - TTS: "כמעט! נסה שוב"
      - Both orbs deselect, child tries again
5. Child taps same orb again: deselects it (toggle behavior)
6. After 3 rounds: transition to complete
```

### 4.5 Bridge Builder Variant (Level 5)
```
1. Screen renders: bridge with gap + sequence with missing number + number options below
2. TTS speaks: "מה המספר החסר? בנה את הגשר!"
3. Sequence displayed: e.g., 2, 4, _, 8, 10
4. Child taps correct number from options:
   - Number fills the gap
   - Bridge plank appears with slide animation
   - SFX: playCorrect() + building sound
   - TTS: positive feedback
5. Wrong: shake + "כמעט! נסה שוב"
6. 4 sequences total, each adds a bridge segment
7. After all 4: hero runs across completed bridge
```

### 4.6 Hero Rescue Multi-Step (Level 6)
```
1. Screen renders: 3-phase indicator at top + first problem
2. TTS speaks: "ד"ר אפס כאן! שלוש משימות לשחרר את העיר!"
3. Phase 1: Standard addition problem (PowerLaunch style)
   - On correct: hero charges forward, Phase 1 indicator fills
4. Phase 2: Pattern/sequence problem (BridgeBuilder style)
   - On correct: lock opens, Phase 2 indicator fills
5. Phase 3: Addition problem using context
   - On correct: hero blasts robot, Phase 3 fills
6. All 3 phases complete:
   - Special celebration: larger confetti, hero victory pose
   - TTS: "!עולם שוחרר" (World freed!)
   - SFX: extended fanfare
   - Full costume reveal (speed_crown = 6/6)
   - Vehicle unlock: motorcycle
```

---

## 6. Error States

### 5.1 Wrong Answer
- **Visual:** Button/element shakes (shakeWrong: translateX ±5px, 3 cycles, 0.3s)
- **Color:** Brief red flash on the tapped element
- **Audio:** playWrong() — gentle low-frequency buzz (not harsh)
- **TTS:** "כמעט! נסה שוב" (Almost! Try again.)
- **Behavior:** Same problem stays. No penalty. No counter shown to child.
- **Hints activate** after threshold (see Section 5.2)

### 5.2 Progressive Hints
| Attempts | Hint | Visual | Audio |
|----------|------|--------|-------|
| 2 wrong | Hint 1: Visual aid | Counting dots appear below the problem | TTS: "נסה לספור ביחד" (Let's count together) |
| 3 wrong | Hint 2: 50/50 | Two wrong options fade to opacity 0.2, labels dim | TTS: "הנה רמז!" (Here's a hint!) |
| 4 wrong | Hint 3: Answer glow | Correct answer pulses with green glow (1s cycle) | TTS: "זה התשובה!" (That's the answer!) |

### 5.3 No Hebrew TTS Voice
- **Detection:** On app load, check `speechSynthesis.getVoices()` for Hebrew voice
- **Fallback UI:**
  - All text that would be spoken is displayed in LARGE font (32px+) at the center-top of screen
  - Text appears with a fadeIn animation to draw attention
  - A brief pulse animation on text (scale 1.0 → 1.05 → 1.0) mimics "speaking"
  - Game remains fully playable — all other audio (SFX) still works
- **No error message shown to child** — just silently uses visual mode

### 5.4 LocalStorage Unavailable or Full
- **Detection:** Try/catch on first save attempt
- **Behavior:** Game works fully without saving — just no persistence
- **No error shown to child** — parent settings could show a small icon

### 5.5 Web Audio API Unavailable
- **Detection:** Check for `window.AudioContext || window.webkitAudioContext`
- **Behavior:** Game works silently — no SFX
- **TTS still works** independently

### 5.6 First Launch (No Save Data)
- **Behavior:** Initialize fresh game state with all defaults
- **World 1 unlocked, Level 1 available, 0 XP, 0 costumes**
- **No tutorial needed** — audio instructions per level are sufficient

---

## 7. Animation Specifications

| Animation | Trigger | Duration | Easing | CSS Properties | Description |
|-----------|---------|----------|--------|---------------|-------------|
| `fadeIn` | Screen transition in | 0.4s | ease-out | opacity 0→1 | Screen appears smoothly |
| `fadeOut` | Screen transition out | 0.3s | ease-in | opacity 1→0 | Screen disappears smoothly |
| `slideUp` | Level complete screen | 0.5s | cubic-bezier(0.34,1.56,0.64,1) | translateY(100%)→0 | Bouncy entrance from bottom |
| `buttonPulse` | Next available level | 1.5s infinite | ease-in-out | scale 1→1.08→1, box-shadow glow | Draws attention to next level |
| `heroDash` | Correct answer (Power Launch) | 0.8-1.5s | ease-out | translateX(0→N*30px) | Hero runs proportional to answer |
| `heroRun` | Correct answer (Path Chooser) | 1.2s | ease-in-out | translateX + translateY along path | Hero follows chosen path |
| `shakeWrong` | Wrong answer | 0.3s | ease-out | translateX: 0→5→-5→3→-3→0 | 3-cycle shake |
| `glowCorrect` | Correct answer | 0.4s | ease-out | box-shadow: 0 0 0→20px rgba(34,170,68,0.6) | Green glow expands |
| `starReveal` | Level complete | 0.5s per star | cubic-bezier(0.34,1.56,0.64,1) | scale 0→1.2→1 + rotateZ 0→360deg | Star spins in |
| `confettiBurst` | Level complete | 2s | ease-out | Multiple squares translateX/Y + rotate + opacity | CSS particle explosion |
| `numberFloat` | Number Catcher | 4s (diff 1) | linear | translateX(-100%→120%) | Number crosses screen |
| `orbMerge` | Shield Match correct | 0.5s | ease-in | translate toward shield center + scale→0 | Orbs fly into shield |
| `popCatch` | Number caught | 0.3s | ease-out | scale 1→1.3→0 + translateY(-30px) | Pop and fly up |
| `bridgePlank` | Bridge segment added | 0.4s | ease-out | scaleX 0→1 (from center) | Plank materializes |

**Performance rules:**
- Only animate `transform` and `opacity` (GPU-accelerated)
- Never animate `width`, `height`, `top`, `left`, `margin` (layout-triggering)
- Use `will-change: transform` on elements that will animate
- `requestAnimationFrame` for any JS-driven animations

---

## 8. RTL Layout Rules

### Global
- `html { direction: rtl; }` on document root
- All text naturally flows right-to-left
- Flexbox: `flex-direction: row` naturally reverses in RTL context
- Grid: flows RTL automatically with `direction: rtl`

### Specific Rules
| Element | RTL Behavior |
|---------|-------------|
| Navigation | Back button: bottom-LEFT (RTL convention) |
| XP bar | Fills from RIGHT to LEFT |
| Progress counter [1/3] | Numbers remain LTR (math is universal), label RTL |
| Star display | Renders RIGHT to LEFT |
| Level path | Numbers/names on RIGHT side of path nodes |
| World map title | RIGHT-aligned |
| Hero avatar | Faces LEFT (running direction in RTL) |
| Number Catcher | Numbers can float either direction |
| Problem text | RTL: "?כמה זה 3 ועוד 4" — numbers stay LTR within RTL text |
| Answer buttons | Order: RIGHT to LEFT |

### Mixed Content (Numbers in Hebrew Text)
- Use `dir="auto"` or `unicode-bidi: embed` for inline numbers
- Math expressions: "3 + 4 = ?" renders correctly with bidi algorithm
- Keep number font (36px bold) regardless of text direction

---

## 9. Touch Optimization

### Tap Targets
| Element | Minimum Size | Actual Size | Spacing |
|---------|-------------|-------------|---------|
| Action buttons | 48px | 60px × 80px+ | 16px gap |
| Answer number buttons | 48px | 60px × 80px | 20px gap |
| Level nodes | 48px | 60px circle | 40px vertical gap |
| World nodes | 48px | 120px × 120px | 20px gap |
| Floating numbers | 48px | 60px × 50px | n/a (moving) |
| Shield orbs | 48px | 60px circle | 20px+ gap |
| Back button | 48px | 60px × 60px | 16px from edge |

### CSS Touch Rules
```css
/* On all interactive areas */
.game-area {
  touch-action: manipulation;  /* Prevents double-tap zoom, allows tap + pan */
}

/* On the whole app */
* {
  -webkit-tap-highlight-color: transparent;  /* Remove blue flash on tap */
  user-select: none;  /* Prevent text selection */
}

/* Buttons */
button {
  touch-action: manipulation;
  -webkit-user-select: none;
}
```

### Event Handling
- Use `pointerdown` / `pointerup` for unified mouse+touch
- All event listeners: `{ passive: true }` where possible
- Debounce rapid taps: ignore taps within 200ms of last tap on same element
- No drag interactions in Phase 1 MVP (tap only — simpler, more reliable)
- `preventDefault()` only where needed (form elements, not game area)

### Gesture Prevention
- `touch-action: manipulation` prevents pinch-zoom and double-tap-zoom
- No swipe gestures used (could interfere with browser back)
- Single-finger tap only — no multi-touch

---

## 10. Pre-Reader Accessibility

### Every Screen Audit

| Screen | How it Works Without Reading |
|--------|------------------------------|
| Splash | One huge glowing button. TTS says title. Child learns: "tap the big thing." |
| World Map | Bright colored world = tappable. Gray worlds = locked (lock icon). TTS says "מפת העולמות". |
| Level Select | Pulsing glowing node = "tap me". Stars = visual progress. Path = visual journey upward. |
| Gameplay | TTS reads every problem aloud. Buttons show only numbers (not text). Visual aids show dots. |
| Level Complete | Stars animate in. Costume piece appears. Two big buttons (continue / replay). TTS celebrates. |

### Design Principles for Non-Readers
1. **Audio-first:** Every instruction, problem, and feedback is spoken — never text-only
2. **One big thing to tap:** At any moment, only 1-4 tappable options. Never a complex menu.
3. **Color = meaning:** Green = good/go. Red = wrong/stop. Blue = interactive. Gray = locked.
4. **Size = importance:** The most important element is always the largest on screen.
5. **Animation = attention:** The thing the child should tap is always animated (pulse, glow).
6. **Icons over text:** Lock icon = locked. Star icon = achievement. Arrow = direction.
7. **No hidden navigation:** Everything visible on one screen. No hamburger menus, no scrolling.
8. **Consistent layout:** Answer buttons always at bottom. Problem always at top/center. Hero always in middle.
9. **Audio mnemonic:** Same SFX for same meaning across all screens (ding = correct, buzz = wrong, whoosh = movement, fanfare = celebration).

---

## 11. Color and Visual Style

### Global Palette
| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background (dark) | Deep navy | #1A1A2E | App background, screen backgrounds |
| Background (lighter) | Dark purple | #16213E | Cards, panels |
| Text (primary) | White | #FFFFFF | All main text |
| Text (secondary) | Light gray | #A0A0C0 | Subtitles, counters |
| Correct | Green | #22AA44 | Correct answer glow, positive feedback |
| Wrong | Red | #CC3344 | Wrong answer flash (brief, not dominant) |
| Locked | Gray | #444444 | Locked levels, disabled buttons |
| Gold | Star gold | #FFE100 | Stars, achievements, XP |

### Speed City (World 1) Theme
| Role | Color | Hex |
|------|-------|-----|
| Primary | Electric blue | #00D4FF |
| Secondary | Neon yellow | #FFE100 |
| Background | Dark purple | #1A0A2E |
| Accent | Speed orange | #FF6B2B |
| Scene | Neon roads/trails | linear-gradient(#00D4FF, #0088AA) |

### Visual Hierarchy
1. **Numbers in problems:** Largest element (36-40px), bold, white
2. **Answer buttons:** Second largest (60px tall), bright borders
3. **Hero avatar:** Prominent in game area, animated
4. **Stars/XP:** Medium size, gold accent
5. **Labels/titles:** Smallest text (18-24px), subtle
6. **Counters [1/3]:** Smallest (16px), corner placement

### CSS-Only Visual Techniques
- **Hero:** CSS shapes (border-radius, background, clip-path)
- **Stars:** CSS triangles rotated and overlapped (or unicode ★)
- **Clouds:** border-radius: 50% with multiple box-shadows
- **Cityscape:** CSS gradients + box-shadows for buildings
- **Speed lines:** Linear gradients at angles
- **Neon glow:** box-shadow with spread + blur in theme color
- **Confetti:** Multiple small `<div>` elements with random colors, animated

---

## 12. Audio UX

### TTS Timing Relative to Visual Events

| Event | Visual First | TTS Delay | SFX Timing |
|-------|-------------|-----------|------------|
| Screen enters | fadeIn starts | +0.5s (after fade completes) | — |
| Problem displayed | Text renders | +0.3s (after text visible) | — |
| Correct answer | glowCorrect starts | +0.2s (during glow) | playCorrect() at 0s |
| Wrong answer | shakeWrong starts | +0.3s (after shake) | playWrong() at 0s |
| Hero dash | heroDash starts | — (no TTS during dash) | playWhoosh() at 0s |
| Level complete | fadeIn + stars | +1.0s (after stars reveal) | playFanfare() at 0s |
| Costume reveal | slideUp | +0.5s (during slide) | playPowerUp() at 0s |
| Number caught | popCatch starts | — (no TTS per catch) | playCorrect() at 0s |
| Shield merge | orbMerge starts | +0.3s (during merge) | playPowerUp() at 0s |

### TTS Queue Rules
1. Never overlap two TTS utterances — queue them
2. SFX can overlap with TTS (different audio channel)
3. After TTS finishes speaking the problem, enable answer buttons (not before)
4. Positive feedback TTS: choose randomly from list to avoid repetition
5. Speech rate: 0.9 (slightly slow for child comprehension)

### SFX Details
| Sound | Method | Frequency | Duration | Character |
|-------|--------|-----------|----------|-----------|
| Correct (ding) | Sine oscillator, pitch up | 800Hz→1200Hz | 0.2s | Bright, happy |
| Wrong (buzz) | Triangle oscillator, pitch down | 300Hz→200Hz | 0.3s | Gentle, not harsh |
| Whoosh | White noise, bandpass filter sweep | 200Hz→2000Hz | 0.5s | Wind/speed |
| Pop | Sine oscillator, quick | 600Hz→400Hz | 0.1s | Button feedback |
| Fanfare | Sine chord: C-E-G-C, sequential | 523/659/784/1047Hz | 1.5s | Celebratory |
| PowerUp | Sine oscillator, rising sweep | 400Hz→1600Hz | 0.8s | Ascending, magical |

---

## 13. Design Decisions and Assumptions

### 13.1 Key Design Decisions

**Decision 1: No timers or countdown in levels**
- Rationale: Child is 4.5 years old. Time pressure creates anxiety and conflicts with the "no pressure" requirement. The speed theme is expressed through hero animations, not by forcing the child to rush.

**Decision 2: Progressive hints instead of skipping problems**
- Rationale: Educational value is in solving, not bypassing. Hints ensure the child always succeeds (builds confidence) while still engaging with math.

**Decision 3: Stars awarded on completion, not speed/perfection only**
- Rationale: Every level completion earns minimum 1 star (ensures progress, prevents dead-ends). Higher stars (2-3) reward mastery but are not required to unlock the next level.

**Decision 4: Costume pieces unlock per level, not per star count**
- Rationale: Clear 1:1 mapping (Level 1 = boots, Level 2 = gloves, etc.) is easier for a child to understand. Removes the grind of replaying levels for stars just to unlock the next piece.

**Decision 5: All sounds procedurally generated (Web Audio API)**
- Rationale: Zero external files maintains offline capability and keeps app size tiny. Procedural sounds are sufficient for feedback (not cinematic music, just functional cues).

**Decision 6: CSS-only visuals (no images)**
- Rationale: Keeps total app under 500KB. Loads instantly. No asset management complexity. CSS shapes and gradients are expressive enough for this abstract superhero theme.

**Decision 7: Single-page app (no multi-page navigation)**
- Rationale: Faster transitions (no full page reloads). Easier state management. Better for PWA offline behavior. All screens are just show/hide divs.

**Decision 8: Wrong answers never consume a life or penalize progress**
- Rationale: Child is learning. Mistakes are part of learning. Punishing wrong answers creates fear of trying. Progressive hints guide to success without penalty.

**Decision 9: Hero avatar is abstract CSS character, not licensed character**
- Rationale: Avoids copyright issues. "Number Hero" is an original character inspired by the superhero genre. Child projects their own imagination onto the abstract hero (like a "player character" in games).

**Decision 10: Audio-first with visual fallback**
- Rationale: Pre-reader design requires spoken instructions. Web Speech API Hebrew support is good on modern devices. Graceful text fallback ensures the game works even without TTS.

### 13.2 Assumptions

1. Child is preliterate — Cannot read Hebrew text fluently. Recognizes some numbers. Relies on audio and visual shapes.

2. Tablet is primary device — Designed landscape-first for tablet. Also works on PC (mouse + keyboard), but touch is optimized.

3. Parent is nearby but not actively helping — Child can play independently for 5-minute sessions. Parent intervenes only for edge cases (technical errors, first-time setup).

4. Hebrew TTS is available in most modern browsers — Chrome Android and Safari iOS support Hebrew voices. Fallback plan exists but is a secondary path.

5. Child has superhero context knowledge — Familiar with speed powers (Flash, Sonic), will understand hero dashing as a power.

6. No internet after install — Service worker caches all assets. Once installed as PWA, the game never makes network requests.

7. One child, one save slot — No multi-user profiles needed. Single save file in LocalStorage.

8. Child does not read error messages — Any error state must resolve automatically or have parent-facing text + child-facing visual indicator.

---

## 14. Open Questions for Architect

1. **XP values per level**: PRD mentions "XP / 200 = hero level" but does not specify exact XP awards. Suggested: 50 XP base + 25 XP per star (50-125 per level). Confirm or adjust?

2. **Star 3 criteria definition**: "All first-try + confident" is vague. Suggest: "All first-try + <2 seconds average response time" OR "All first-try + no hints triggered". Which is measurable and appropriate?

3. **Number Catcher pacing**: Suggested 3-4 seconds per number crossing at difficulty 1. Should difficulty 2+ speed this up (2-3 seconds) or increase count (10 numbers instead of 8)?

4. **LocalStorage quota**: Assuming <5KB save data. Should we implement an export reminder after N level completions, or only offer export as a manual button on the World Map?

5. **Portrait orientation layout**: Should Level Select and Gameplay screens have alternate layouts for portrait, or simply scale/scroll the landscape layout? (Landscape is preferred but both should work per PRD.)

6. **TTS utterance queuing**: Should we queue utterances (child hears everything in order) or cancel previous (child only hears most recent, avoids backlog)? Recommend cancel for responsiveness.

7. **Difficulty escalation edge case**: If the child answers all correctly but slowly, should difficulty still increase? Or require both accuracy >90% AND average time <threshold?

8. **World Map unlock logic**: Does World 2 unlock after completing all 6 levels of World 1, or after earning minimum 1 star on all 6 levels? (Affects MVP scope — World 2 is out of Phase 1 but logic must be defined.)

---

## Appendix: Screen State Summary

| Screen | Entry Condition | Exit Options | Persistent State |
|--------|----------------|-------------|-----------------|
| Splash | App load | → World Map (tap start) | None |
| World Map | From Splash or Level Select back | → Level Select (tap world) | Reads world unlock state |
| Level Select | From World Map (specific world) | → Gameplay (tap level), → World Map (back) | Reads level stars, completion |
| Gameplay | From Level Select (specific level) | → Level Complete (all problems done) | Updates difficulty tracker |
| Level Complete | From Gameplay (level finished) | → Level Select (continue), → Gameplay (replay) | Saves stars, XP, costumes |
