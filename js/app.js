// app.js — Entry point, screen router, event delegation

import { initSpeech, speak, warmUpSpeech, markInteraction, isUsingHebrew, setTTSMuted } from './audio/speech.js';
import { resumeAudio, playKeyPop, playPop, playWhoosh, startBgMusic, toggleBgMusic, isBgMusicPlaying, isMuted, setMuted } from './audio/sfx.js';
import { loadGame, saveGame, isSetupComplete, setPlayerName, setHeroCharacter, setQuestionCount, setDifficultyPref, completeSetup, getState, getTodayProblems, ensureWorldLevels } from './engine/save-manager.js';
import { renderSplash } from './screens/splash.js';
import { renderWorldMap } from './screens/world-map.js';
import { renderLevelSelect } from './screens/level-select.js';
import { startLevel, cleanupGameplay } from './screens/gameplay.js';
import { renderReward } from './screens/reward.js';
import { PHRASES, fillTemplate } from './audio/hebrew-phrases.js';
import { delay } from './utils/helpers.js';
import { WORLDS } from './levels/world-data.js';
import { checkAndUnlockNextWorld } from './engine/progress.js';

// Screen elements
const screens = {};
let currentScreen = null;
let firstInteractionDone = false;

// Called on first user interaction to unlock audio + TTS
function onFirstInteraction() {
  if (firstInteractionDone) return;
  firstInteractionDone = true;
  resumeAudio();
  markInteraction();
  warmUpSpeech();
  startBgMusic();
}

function init() {
  loadGame();

  // Ensure save state has level entries for all worlds
  for (const [wId, wConfig] of Object.entries(WORLDS)) {
    ensureWorldLevels(wId, wConfig.levels.length);
  }
  saveGame();

  initSpeech();

  // Cache screen elements
  screens.setup = document.getElementById('screen-setup');
  screens.splash = document.getElementById('screen-splash');
  screens.worldMap = document.getElementById('screen-world-map');
  screens.levelSelect = document.getElementById('screen-level-select');
  screens.gameplay = document.getElementById('screen-gameplay');
  screens.reward = document.getElementById('screen-reward');

  // Event delegation
  document.getElementById('app').addEventListener('pointerdown', handleAction, { passive: false });

  // Global first-interaction handler to unlock audio/TTS
  document.getElementById('app').addEventListener('pointerdown', () => {
    onFirstInteraction();
  }, { once: true, passive: true });

  // Persistent mute button
  const muteBtn = document.getElementById('global-mute-btn');
  if (muteBtn) {
    muteBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nowMuted = !isMuted();
      setMuted(nowMuted);
      setTTSMuted(nowMuted);
      muteBtn.textContent = nowMuted ? '🔇' : '🔊';
      if (nowMuted) {
        try { speechSynthesis.cancel(); } catch (err) {}
      }
    });
  }

  // Check if first launch
  if (!isSetupComplete()) {
    showScreen('setup');
    renderSetupScreen();
  } else {
    showScreen('splash');
    renderSplash(screens.splash);
  }

  // Save on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveGame();
  });
}

function showScreen(screenId) {
  Object.values(screens).forEach(s => {
    if (s) s.classList.remove('active');
  });
  const target = screens[screenId];
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
  }
}

function renderSetupScreen() {
  const container = screens.setup;
  container.innerHTML = `
    <div class="setup-content" id="setup-step-name">
      <h2 class="setup-title">${PHRASES.enterName}</h2>
      <div class="setup-input-area">
        <input type="text" class="name-input" id="player-name-input"
               placeholder="${PHRASES.namePrompt}" dir="rtl" autocomplete="off" autofocus>
        <button class="btn-primary setup-confirm" id="btn-confirm-name" disabled>${PHRASES.nameConfirm}</button>
      </div>
    </div>
  `;

  const input = container.querySelector('#player-name-input');

  // Speak prompt
  setTimeout(() => speak(isUsingHebrew() ? PHRASES.enterName : 'What is your name, hero?'), 500);

  input.addEventListener('focus', () => {
    onFirstInteraction();
    setTimeout(() => speak(isUsingHebrew() ? PHRASES.enterName : 'What is your name, hero?'), 200);
  }, { once: true });

  // Auto-focus input
  setTimeout(() => input.focus(), 100);

  // Enable button when name is entered + keyboard pop sound
  input.addEventListener('input', () => {
    const btn = container.querySelector('#btn-confirm-name');
    btn.disabled = !input.value.trim();
    onFirstInteraction();
    playKeyPop();
  });

  // Confirm name
  container.querySelector('#btn-confirm-name').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onFirstInteraction();
    playPop();
    const name = input.value.trim();
    if (!name) return;
    setPlayerName(name);
    renderCharacterSelect(container);
  });

  // Enter key support
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      onFirstInteraction();
      playPop();
      setPlayerName(input.value.trim());
      renderCharacterSelect(container);
    }
  });
}

function renderCharacterSelect(container) {
  const state = getState();
  const currentHero = state.player.heroCharacter;
  const currentCount = state.player.questionCount || 'medium';
  const currentDiff = state.player.difficultyPref || 'easy';

  const heroes = [
    { id: 'flash_hero', name: PHRASES.heroNames.flash_hero, colors: ['#DC143C', '#FFD700'], emoji: '⚡' },
    { id: 'spider_hero', name: PHRASES.heroNames.spider_hero, colors: ['#E23636', '#1E3A8A'], emoji: '🕸️' },
    { id: 'iron_hero', name: PHRASES.heroNames.iron_hero, colors: ['#FFD700', '#B22222'], emoji: '⚙️' },
    { id: 'mario_hero', name: PHRASES.heroNames.mario_hero, colors: ['#E52521', '#43B047'], emoji: '🍄' },
    { id: 'bat_hero', name: PHRASES.heroNames.bat_hero, colors: ['#2C2C2C', '#4169E1'], emoji: '🦇' },
    { id: 'racer_hero', name: PHRASES.heroNames.racer_hero, colors: ['#FF0000', '#FFFFFF'], emoji: '🏎️' },
  ];

  container.innerHTML = `
    <div class="setup-content" id="setup-step-character">
      <h2 class="setup-title">${PHRASES.chooseHero}</h2>
      <div class="character-grid">
        ${heroes.map(h => `
          <button class="character-card ${currentHero === h.id ? 'character-selected' : ''}" data-hero-id="${h.id}"
                  style="--hero-primary: ${h.colors[0]}; --hero-secondary: ${h.colors[1]};">
            <div class="character-preview">
              <div class="hero-avatar hero-medium" style="--world-primary: ${h.colors[0]};">
                <div class="hero-head"><div class="hero-eye hero-eye-l"></div><div class="hero-eye hero-eye-r"></div></div>
                <div class="hero-body"></div>
                <div class="hero-legs"><div class="hero-leg"></div><div class="hero-leg"></div></div>
              </div>
            </div>
            <span class="character-emoji">${h.emoji}</span>
            <span class="character-name">${h.name}</span>
          </button>
        `).join('')}
      </div>
      <div class="settings-row">
        <div class="question-count-area">
          <h3 class="setup-subtitle">${PHRASES.questionCountLabel}</h3>
          <div class="count-buttons">
            <button class="count-btn ${currentCount === 'short' ? 'count-selected' : ''}" data-count="short">${PHRASES.questionShort} (3)</button>
            <button class="count-btn ${currentCount === 'medium' ? 'count-selected' : ''}" data-count="medium">${PHRASES.questionMedium} (6)</button>
            <button class="count-btn ${currentCount === 'long' ? 'count-selected' : ''}" data-count="long">${PHRASES.questionLong} (10)</button>
          </div>
        </div>
        <div class="difficulty-area">
          <h3 class="setup-subtitle">${PHRASES.difficultyLabel}</h3>
          <div class="diff-buttons">
            <button class="diff-btn ${currentDiff === 'easy' ? 'diff-selected' : ''}" data-diff="easy">${PHRASES.difficultyEasy}</button>
            <button class="diff-btn ${currentDiff === 'medium' ? 'diff-selected' : ''}" data-diff="medium">${PHRASES.difficultyMedium}</button>
            <button class="diff-btn ${currentDiff === 'hard' ? 'diff-selected' : ''}" data-diff="hard">${PHRASES.difficultyHard}</button>
          </div>
        </div>
      </div>
      <button class="btn-primary btn-continue-setup" id="btn-continue-setup" ${!currentHero ? 'disabled' : ''}>${PHRASES.continue_setup}</button>
    </div>
  `;

  speak(isUsingHebrew() ? PHRASES.chooseHero : 'Choose your hero!');

  // Question count selection
  container.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      resumeAudio();
      container.querySelectorAll('.count-btn').forEach(b => b.classList.remove('count-selected'));
      btn.classList.add('count-selected');
      setQuestionCount(btn.dataset.count);
      playPop();
    });
  });

  // Difficulty selection
  container.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      resumeAudio();
      container.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('diff-selected'));
      btn.classList.add('diff-selected');
      setDifficultyPref(btn.dataset.diff);
      playPop();
    });
  });

  // Character selection (just highlights, doesn't navigate)
  container.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      resumeAudio();
      playPop();
      const heroId = card.dataset.heroId;
      setHeroCharacter(heroId);

      container.querySelectorAll('.character-card').forEach(c => c.classList.remove('character-selected'));
      card.classList.add('character-selected');

      // Enable continue button
      const contBtn = container.querySelector('#btn-continue-setup');
      if (contBtn) contBtn.disabled = false;
    });
  });

  // Continue button — completes setup and goes to splash
  const continueBtn = container.querySelector('#btn-continue-setup');
  const handleContinue = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Prevent double-firing
    continueBtn.removeEventListener('pointerdown', handleContinue);
    continueBtn.removeEventListener('click', handleContinue);
    continueBtn.disabled = true;

    resumeAudio();
    onFirstInteraction();
    playWhoosh();
    completeSetup();

    // Navigate immediately, speak greeting in background
    showScreen('splash');
    renderSplash(screens.splash);

    const state = getState();
    const greeting = isUsingHebrew()
      ? fillTemplate(PHRASES.greeting, { name: state.player.name })
      : `Hi ${state.player.name}! Let's save the world!`;
    speak(greeting);
  };
  continueBtn.addEventListener('pointerdown', handleContinue, { passive: false });
  continueBtn.addEventListener('click', handleContinue);
}

function handleAction(e) {
  resumeAudio();

  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  e.preventDefault();

  const action = btn.dataset.action;

  switch (action) {
    case 'start-game':
      playWhoosh();
      showScreen('worldMap');
      renderWorldMap(screens.worldMap);
      break;

    case 'select-world':
      if (btn.disabled) return;
      playPop();
      showScreen('levelSelect');
      renderLevelSelect(screens.levelSelect, btn.dataset.world);
      break;

    case 'back-to-map':
      playPop();
      // Show session summary
      showSessionSummary();
      showScreen('worldMap');
      renderWorldMap(screens.worldMap);
      break;

    case 'back-to-level-select': {
      playPop();
      cleanupGameplay();
      const w = btn.dataset.world;
      showScreen('levelSelect');
      renderLevelSelect(screens.levelSelect, w);
      break;
    }

    case 'select-level':
      if (btn.disabled) return;
      playWhoosh();
      showScreen('gameplay');
      cleanupGameplay();
      startLevel(screens.gameplay, btn.dataset.world, parseInt(btn.dataset.level), (resultData) => {
        showScreen('reward');
        renderReward(screens.reward, resultData);
      });
      break;

    case 'continue-after-level': {
      playPop();
      const w = btn.dataset.world;
      const l = parseInt(btn.dataset.level);
      // Check if completing this world unlocked a new world
      const newlyUnlocked = checkAndUnlockNextWorld(w);
      // Also go to world map if this was the last level in the world
      const world = WORLDS[w];
      const isLastLevel = world && l === world.levels.length - 1;
      if (newlyUnlocked || isLastLevel) {
        showScreen('worldMap');
        renderWorldMap(screens.worldMap);
      } else {
        showScreen('levelSelect');
        renderLevelSelect(screens.levelSelect, w);
      }
      break;
    }

    case 'replay-level': {
      playWhoosh();
      const rw = btn.dataset.world;
      const rl = parseInt(btn.dataset.level);
      showScreen('gameplay');
      cleanupGameplay();
      startLevel(screens.gameplay, rw, rl, (resultData) => {
        showScreen('reward');
        renderReward(screens.reward, resultData);
      });
      break;
    }

    case 'back-to-splash':
      playPop();
      showSessionSummary();
      showScreen('splash');
      renderSplash(screens.splash);
      break;

    case 'open-settings':
      playPop();
      showScreen('setup');
      renderCharacterSelect(screens.setup);
      break;

    case 'toggle-music': {
      const playing = toggleBgMusic();
      const icon = btn.querySelector('.music-icon');
      if (icon) icon.textContent = playing ? '🎵' : '🔇';
      break;
    }
  }
}

async function showSessionSummary() {
  const count = getTodayProblems();
  if (count > 0) {
    if (isUsingHebrew()) {
      speak(fillTemplate(PHRASES.sessionSummary, { count: String(count) }));
    } else {
      speak(`Today you solved ${count} problems! Great job!`);
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
