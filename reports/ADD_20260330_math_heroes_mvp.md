# Architecture Design Document: MathHeroes Phase 1 MVP

**Document ID:** ADD_20260330_math_heroes_mvp
**Date:** 2026-03-30

---

## Tech Stack

| Layer | Technology | Constraint |
|-------|-----------|-----------|
| Markup | HTML5 (single index.html) | No templates, no frameworks |
| Style | CSS3 (4 files) | No preprocessors, no Tailwind |
| Logic | Vanilla JS ES6+ (20 files) | No npm, no bundler, no transpile |
| Speech | Web Speech API | Browser-native, free, offline |
| Sound | Web Audio API | Procedural oscillators, zero audio files |
| Storage | LocalStorage | Key: "mathheroes_save" |
| Install | PWA (manifest.json + sw.js) | Offline after first load |
| Dependencies | **ZERO** | Nothing external |

## Module Architecture

```
index.html (loads all CSS then JS via <script type="module">)
     │
     ▼
  app.js (entry point)
     │
     ├── ScreenManager ─── screens/splash.js
     │                 ├── screens/world-map.js
     │                 ├── screens/level-select.js
     │                 ├── screens/gameplay.js
     │                 └── screens/reward.js
     │
     ├── GameEngine ────── engine/game-engine.js (state machine)
     │   ├── QuestionGen ── engine/question-gen.js
     │   ├── Difficulty ─── engine/difficulty.js
     │   ├── Progress ───── engine/progress.js
     │   └── SaveManager ── engine/save-manager.js
     │
     ├── LevelTypes ────── levels/level-types.js (render + logic per type)
     │   └── WorldData ─── levels/world-data.js (level configs)
     │
     ├── Audio ─────────── audio/speech.js (TTS wrapper)
     │   ├── SFX ────────── audio/sfx.js (Web Audio procedural)
     │   └── Phrases ────── audio/hebrew-phrases.js (constants)
     │
     └── UI ────────────── ui/buttons.js
         ├── Animations ─── ui/animations.js
         ├── HeroAvatar ─── ui/hero-avatar.js
         └── ProgressBar ── ui/progress-bar.js
```

## Data Flow

```
User Tap → app.js event delegation
  → gameplay.js identifies target
    → level-types.js checks answer
      → game-engine.js updates state (CHECKING → ANIMATING → PLAYING/COMPLETE)
        → question-gen.js provides next problem (if PLAYING)
        → difficulty.js adjusts level (if threshold crossed)
        → progress.js calculates XP/stars (if COMPLETE)
          → save-manager.js persists to LocalStorage
        → speech.js speaks feedback
        → sfx.js plays sound
        → animations.js triggers visual
```

## Screen State Machine

```
SPLASH ──tap──> WORLD_MAP ──tap world──> LEVEL_SELECT ──tap level──> GAMEPLAY
                    ▲                         │                          │
                    │                    back tap                   complete
                    │                         │                          │
                    │                         ▼                          ▼
                    └─────────────────── LEVEL_SELECT <──continue── REWARD
                                                       <──replay─── GAMEPLAY
```

## Game Engine States (per level)

```
IDLE → PLAYING → CHECKING → ANIMATING → PLAYING (next problem)
                                      → COMPLETE (all problems done)
```

## Save Data Schema (v1)

```javascript
{
  version: 1,
  hero: { level, xp, costumes[], vehicles[], activeCostume, activeVehicle },
  worlds: { speed_city: { unlocked, levels: [{ stars, completed, bestAccuracy }] }, ... },
  difficulty: { addition: { level, history[] }, ... },
  stats: { totalProblems, totalCorrect, sessionsPlayed, lastPlayed }
}
```

## Key Patterns

1. **Event Delegation:** Single listener on `#app` root, routes by `data-action` attributes
2. **Screen Visibility:** CSS class `.screen.active` = visible, others `display: none`
3. **ES6 Modules:** Each file exports functions/objects, app.js imports and wires them
4. **No Global State:** Game state lives in `save-manager.js`, accessed via getter/setter
5. **CSS Custom Properties:** Theme colors as `--world-primary`, swapped per world
6. **Animation via Classes:** Add CSS class to trigger animation, remove on `animationend`

## File List (21 files to create)

| # | File | Purpose | Lines (est.) |
|---|------|---------|-------------|
| 1 | index.html | SPA shell, all screens, script/style imports | 120 |
| 2 | manifest.json | PWA config | 20 |
| 3 | sw.js | Service worker, cache-first | 40 |
| 4 | css/main.css | Reset, variables, global styles, RTL | 150 |
| 5 | css/screens.css | Per-screen layouts | 200 |
| 6 | css/animations.css | All @keyframes | 120 |
| 7 | css/themes.css | World color palettes | 60 |
| 8 | js/app.js | Entry point, screen router, event delegation | 80 |
| 9 | js/screens/splash.js | Splash screen logic | 30 |
| 10 | js/screens/world-map.js | World map rendering | 50 |
| 11 | js/screens/level-select.js | Level node rendering | 70 |
| 12 | js/screens/gameplay.js | Main game controller | 200 |
| 13 | js/screens/reward.js | Level complete screen | 80 |
| 14 | js/engine/game-engine.js | State machine, flow control | 120 |
| 15 | js/engine/question-gen.js | Procedural math problems | 180 |
| 16 | js/engine/difficulty.js | Adaptive difficulty tracker | 80 |
| 17 | js/engine/progress.js | XP, stars, unlocks | 80 |
| 18 | js/engine/save-manager.js | LocalStorage CRUD | 70 |
| 19 | js/levels/level-types.js | 4 level type renderers + 2 variants | 350 |
| 20 | js/levels/world-data.js | World + level configs | 120 |
| 21 | js/audio/speech.js | Hebrew TTS wrapper | 60 |
| 22 | js/audio/sfx.js | Web Audio procedural SFX | 100 |
| 23 | js/audio/hebrew-phrases.js | All Hebrew constants | 120 |
| 24 | js/ui/buttons.js | Touch button helpers | 40 |
| 25 | js/ui/animations.js | Animation triggers | 50 |
| 26 | js/ui/hero-avatar.js | CSS hero rendering | 80 |
| 27 | js/ui/progress-bar.js | XP bar, stars display | 50 |
| 28 | js/utils/helpers.js | Shared utilities | 30 |
| **Total** | | | **~2600** |
