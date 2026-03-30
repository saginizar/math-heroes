// gameplay.js — Main game screen controller

import { createGameSession, startSession, checkAnswer, advanceProblem, setAnimating, setPlaying, checkPassThreshold, getAccuracyPercent } from '../engine/game-engine.js';
import { getLevelConfig } from '../levels/world-data.js';
import { setupPowerLaunch, setupPathChooser, setupNumberCatcher, setupShieldMatch, setupBridgeBuilder, setupHeroRescue, setupStarCollector } from '../levels/level-types.js';
import { stopSpeech, isUsingHebrew } from '../audio/speech.js';
import { speakMath, speakCorrect, speakWrong, speakExplanation, speakWrongAnswer, speakMissionIntro, speakStreak, speakFoundAll } from '../audio/tts-hybrid.js';
import { playCorrect, playWrong, playWhoosh, playPop, playFanfare, playStreak, playRetry } from '../audio/sfx.js';
import { PHRASES, wrongExplanationHebrew, fillTemplate, numberToHebrew } from '../audio/hebrew-phrases.js';
import { shakeElement, glowElement, pulseElement, stopPulse, showCorrectCelebration } from '../ui/animations.js';
import { delay, pickRandom } from '../utils/helpers.js';
import { renderStars } from '../ui/progress-bar.js';
import { getQuestionCountNumber, getState, trackLevelComplete } from '../engine/save-manager.js';

let currentSession = null;
let currentSetup = null;
let currentLevelConfig = null;
let onLevelComplete = null;
let shieldRound = 0;
let heroRescuePhase = 0;
let levelStartTime = null;

// Level types that should NOT use the user's question count setting
const FIXED_COUNT_TYPES = ['HeroRescue', 'NumberCatcher', 'StarCollector'];

export function startLevel(container, worldId, levelIndex, completionCallback) {
  const config = getLevelConfig(worldId, levelIndex);
  if (!config) return;

  // Override problem count from user settings — but only for level types that support it
  if (!FIXED_COUNT_TYPES.includes(config.type)) {
    config.problemCount = getQuestionCountNumber();
  }

  currentLevelConfig = config;
  onLevelComplete = completionCallback;
  shieldRound = 0;
  heroRescuePhase = 0;
  levelStartTime = Date.now();

  currentSession = createGameSession(config);
  startSession(currentSession);

  renderCurrentProblem(container);
}

function renderCurrentProblem(container) {
  const config = currentLevelConfig;
  const gameArea = container.querySelector('#game-area') || container;

  // Set world theme colors
  if (config.worldColors) {
    gameArea.style.setProperty('--world-primary', config.worldColors.primary);
    gameArea.style.setProperty('--world-secondary', config.worldColors.secondary);
  }

  // Header with back button, progress, and first-try correct counter
  const headerHtml = `
    <div class="gameplay-header" dir="rtl">
      <button class="btn-back gp-back" data-action="back-to-level-select" data-world="${config.worldId}">חזרה</button>
      <span class="gp-level-name">${config.nameHe}</span>
      <span class="gp-progress">[${currentSession.currentProblemIndex + 1}/${currentSession.totalProblems}]</span>
      <span class="gp-score">${currentSession.firstTryCorrect}✓</span>
    </div>
    ${currentSession.streak >= 2 ? `<div class="streak-display">🔥 ${currentSession.streak} ברצף!</div>` : ''}
  `;

  // Setup level type
  const levelContainer = document.createElement('div');
  levelContainer.className = 'level-container';

  gameArea.innerHTML = headerHtml;
  gameArea.appendChild(levelContainer);

  switch (config.type) {
    case 'PowerLaunch':
      currentSetup = setupPowerLaunch(levelContainer, config);
      speakMission(config);
      bindAnswerButtons(levelContainer, gameArea);
      break;

    case 'PathChooser':
      currentSetup = setupPathChooser(levelContainer, config);
      speakMission(config);
      bindPathButtons(levelContainer, gameArea);
      break;

    case 'NumberCatcher':
      currentSetup = setupNumberCatcher(levelContainer, config);
      speakMission(config);
      currentSetup.start((caught, missed) => {
        const total = currentSetup.numbers.filter(n => n.matches).length;
        currentSession.correctCount = caught;
        currentSession.firstTryCorrect = caught; // NumberCatcher: all catches are "first try"
        currentSession.totalProblems = total;
        currentSession.state = 'COMPLETE';
        finishLevel(gameArea);
      });
      break;

    case 'StarCollector':
      currentSetup = setupStarCollector(levelContainer, config);
      speakMission(config);
      bindStarCollector(levelContainer, gameArea);
      break;

    case 'ShieldMatch':
      currentSetup = setupShieldMatch(levelContainer, config, shieldRound);
      speakMission(config);
      bindShieldOrbs(levelContainer, gameArea);
      break;

    case 'BridgeBuilder':
      currentSetup = setupBridgeBuilder(levelContainer, config);
      speakMission(config);
      bindAnswerButtons(levelContainer, gameArea);
      break;

    case 'HeroRescue':
      currentSetup = setupHeroRescue(levelContainer, config, heroRescuePhase);
      speakMission(config);
      bindAnswerButtons(levelContainer, gameArea);
      break;

    default:
      currentSetup = setupPowerLaunch(levelContainer, config);
      bindAnswerButtons(levelContainer, gameArea);
  }

  // Inject hidden report button (small, bottom-left, parent uses)
  injectReportButton(gameArea, config);
}

async function speakMission(config) {
  const playerName = getState().player.name || '';
  // Mission intro: player name via live TTS, mission phrase pre-recorded
  if (currentSession.currentProblemIndex === 0) {
    await speakMissionIntro(config.missionKey, playerName);
  }
  // Math question: composed from pre-recorded number + operator files
  const q = currentSetup?.question;
  if (q?.a !== undefined && q.op) {
    await delay(300);
    speakMath(q.a, q.op, q.b);
  }
}

function bindAnswerButtons(levelContainer, gameArea) {
  levelContainer.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('pointerdown', async (e) => {
      e.preventDefault();
      if (currentSession.state === 'CHECKING' || currentSession.state === 'ANIMATING') return;

      const answer = parseInt(btn.dataset.answer);
      const correct = checkAnswer(currentSession, answer, currentSetup.correctAnswer, currentLevelConfig.operation);

      if (correct) {
        await handleCorrectAnswer(btn, levelContainer, gameArea);
      } else {
        await handleWrongAnswer(btn, levelContainer, gameArea);
      }
    }, { passive: false });
  });
}

function bindPathButtons(levelContainer, gameArea) {
  levelContainer.querySelectorAll('.path-btn').forEach(btn => {
    btn.addEventListener('pointerdown', async (e) => {
      e.preventDefault();
      if (currentSession.state === 'CHECKING' || currentSession.state === 'ANIMATING') return;

      const index = parseInt(btn.dataset.pathIndex);
      const isCorrectAnswer = currentSetup.checkAnswer(index);

      checkAnswer(currentSession, isCorrectAnswer ? currentSetup.correctAnswer : -1, currentSetup.correctAnswer, currentLevelConfig.operation);

      if (isCorrectAnswer) {
        currentSetup.onCorrect(btn);
        showCorrectCelebration();
        playCorrect();
        playWhoosh();
        speakCorrect();
        setAnimating(currentSession);
        checkStreak();

        await delay(1200);

        const hasMore = advanceProblem(currentSession);
        if (hasMore) {
          renderCurrentProblem(gameArea);
        } else {
          finishLevel(gameArea);
        }
      } else {
        currentSetup.onWrong(btn);
        await handleWrongAnswerPath(btn, levelContainer, gameArea);
      }
    }, { passive: false });
  });
}

function bindShieldOrbs(levelContainer, gameArea) {
  levelContainer.querySelectorAll('.orb-btn').forEach(btn => {
    btn.addEventListener('pointerdown', async (e) => {
      e.preventDefault();
      if (currentSession.state === 'ANIMATING') return;

      playPop();
      const result = currentSetup.handleOrbTap(btn);

      if (result === null) return;

      if (result.correct) {
        showCorrectCelebration();
        playCorrect();
        speakCorrect();
        checkAnswer(currentSession, currentSetup.target, currentSetup.target, currentLevelConfig.operation);
        setAnimating(currentSession);
        checkStreak();

        // Highlight other valid combinations — show for 3 seconds
        highlightOtherCombos(levelContainer, currentSetup.target, result.orbs);

        await delay(3500);

        shieldRound++;
        const hasMore = advanceProblem(currentSession);
        if (hasMore) {
          // Re-render full screen (header + level) so progress counter updates
          renderCurrentProblem(gameArea);
        } else {
          finishLevel(gameArea);
        }
      } else {
        playWrong();
        speakWrong();
        checkAnswer(currentSession, -1, currentSetup.target, currentLevelConfig.operation);
      }
    }, { passive: false });
  });
}

function bindStarCollector(levelContainer, gameArea) {
  levelContainer.querySelectorAll('.collector-num').forEach(btn => {
    btn.addEventListener('pointerdown', async (e) => {
      e.preventDefault();
      if (currentSession.state === 'ANIMATING' || currentSession.state === 'COMPLETE') return;

      playPop();
      const result = currentSetup.handleTap(btn);
      if (result === null) return;

      if (result.correct) {
        playCorrect();
        glowElement(btn);

        if (result.done) {
          // All matching numbers found — complete
          const effectiveCorrect = Math.max(0, currentSetup.totalMatching - result.wrongTaps);
          currentSession.correctCount = currentSetup.totalMatching;
          currentSession.firstTryCorrect = effectiveCorrect;
          currentSession.totalProblems = currentSetup.totalMatching;
          currentSession.state = 'COMPLETE';
          showCorrectCelebration();
          speakFoundAll();
          await delay(1200);
          finishLevel(gameArea);
        }
      } else {
        playWrong();
        shakeElement(btn);
      }
    }, { passive: false });
  });
}

async function handleCorrectAnswer(btn, levelContainer, gameArea) {
  glowElement(btn);
  showCorrectCelebration();
  playCorrect();
  await speakCorrect();
  setAnimating(currentSession);

  if (currentSetup.onCorrect) currentSetup.onCorrect();

  // Check and announce streak
  checkStreak();

  await delay(800);

  // Handle multi-step types
  if (currentSetup.type === 'HeroRescue') {
    heroRescuePhase++;
    if (heroRescuePhase < currentSetup.totalPhases) {
      currentSession.currentProblemIndex++;
      setPlaying(currentSession); // Must reset from ANIMATING so new buttons respond
      renderCurrentProblem(gameArea);
      return;
    }
  }

  const hasMore = advanceProblem(currentSession);
  if (hasMore) {
    renderCurrentProblem(gameArea);
  } else {
    finishLevel(gameArea);
  }
}

async function handleWrongAnswer(btn, levelContainer, gameArea) {
  // Lock out all interaction during explanation
  setAnimating(currentSession);

  // 1. Indicate wrong — shake + sound
  shakeElement(btn);
  playWrong();

  // 2. Disable all buttons and highlight correct answer
  const allBtns = levelContainer.querySelectorAll('.answer-btn');
  allBtns.forEach(b => {
    b.style.pointerEvents = 'none';
    if (parseInt(b.dataset.answer) === currentSetup.correctAnswer) {
      b.classList.add('glow-correct');
      b.style.border = '4px solid var(--color-correct)';
      b.style.background = 'var(--color-correct)';
    }
  });

  // 3. Narrate explanation
  await delay(600);
  const q = currentSetup.question;
  if (q && q.a !== undefined && q.op) {
    await speakExplanation(q.a, q.op, q.b, currentSetup.correctAnswer);
  } else {
    await speakWrongAnswer(currentSetup.correctAnswer);
  }

  // 4. Show visual "why" (dot counting) for addition with small numbers
  if (q && q.op === '+' && q.a <= 10 && q.b <= 10) {
    showVisualWhy(levelContainer, q.a, q.b, currentSetup.correctAnswer);
    await delay(2000);
  } else {
    await delay(1500);
  }

  // 5. Reset and show replacement question
  setPlaying(currentSession);
  renderCurrentProblem(gameArea);
}

async function handleWrongAnswerPath(btn, levelContainer, gameArea) {
  setAnimating(currentSession);
  shakeElement(btn);
  playWrong();

  // Highlight correct path
  const allBtns = levelContainer.querySelectorAll('.path-btn');
  allBtns.forEach((b, i) => {
    b.style.pointerEvents = 'none';
    if (i === currentSetup.correctIndex) {
      b.classList.add('path-correct');
    }
  });

  await delay(600);
  await speakWrongAnswer(currentSetup.correctAnswer);
  await delay(1500);

  setPlaying(currentSession);
  renderCurrentProblem(gameArea);
}

function showVisualWhy(container, a, b, answer) {
  const existing = container.querySelector('.visual-why');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = 'visual-why';
  const dotsA = '● '.repeat(a).trim();
  const dotsB = '● '.repeat(b).trim();
  div.innerHTML = `
    <div class="why-dots">
      <span class="dots-group-a">${dotsA}</span>
      <span class="why-op"> + </span>
      <span class="dots-group-b">${dotsB}</span>
      <span class="why-eq"> = </span>
      <span class="why-answer">${answer}</span>
    </div>
  `;
  container.querySelector('.level-scene')?.appendChild(div);
}

function highlightOtherCombos(container, target, matchedOrbs) {
  const allOrbs = container.querySelectorAll('.orb-btn:not(.orb-matched)');
  const orbArr = [...allOrbs];
  const comboColors = ['#FFD700', '#4D96FF', '#00CED1', '#6BCB77', '#E0A0FF', '#FFB347'];

  // Find all valid pairs among remaining orbs
  const combos = [];
  for (let i = 0; i < orbArr.length; i++) {
    for (let j = i + 1; j < orbArr.length; j++) {
      const v1 = parseInt(orbArr[i].dataset.value);
      const v2 = parseInt(orbArr[j].dataset.value);
      if (v1 + v2 === target) {
        combos.push([orbArr[i], orbArr[j]]);
      }
    }
  }

  if (combos.length === 0) return;

  // Assign each combo a unique color and apply flashing highlight
  combos.forEach((pair, idx) => {
    const color = comboColors[idx % comboColors.length];
    pair.forEach(orb => {
      orb.style.borderColor = color;
      orb.style.boxShadow = `0 0 18px ${color}`;
      orb.style.background = `${color}22`;
      orb.classList.add('orb-combo-flash');
    });
  });

  // Remove highlights after 3 seconds
  setTimeout(() => {
    combos.forEach(pair => {
      pair.forEach(orb => {
        orb.style.borderColor = '';
        orb.style.boxShadow = '';
        orb.style.background = '';
        orb.classList.remove('orb-combo-flash');
      });
    });
  }, 3000);
}

function checkStreak() {
  const streak = currentSession.streak;
  if (streak === 2) {
    setTimeout(() => { playStreak(); speakStreak(2); }, 600);
  } else if (streak === 3) {
    setTimeout(() => { playStreak(); speakStreak(3); }, 600);
  } else if (streak === 5) {
    setTimeout(() => { playStreak(); speakStreak(5); }, 600);
  } else if (streak === 10) {
    setTimeout(() => { playStreak(); speakStreak(10); }, 600);
  }
}

async function finishLevel(gameArea) {
  playFanfare();
  const duration = levelStartTime ? Date.now() - levelStartTime : 0;
  const accuracy = getAccuracyPercent(currentSession);
  const passed = checkPassThreshold(currentSession);
  // Track for parent report
  if (currentLevelConfig) {
    trackLevelComplete(
      currentLevelConfig.worldId,
      currentLevelConfig.levelIndex,
      currentLevelConfig.type,
      currentLevelConfig.operation,
      accuracy,
      currentSession.firstTryCorrect >= currentSession.totalProblems ? 3 : accuracy >= 80 ? 2 : 1,
      passed,
      duration
    );
  }
  if (onLevelComplete) {
    onLevelComplete({
      totalProblems: currentSession.totalProblems,
      correctCount: currentSession.correctCount,
      firstTryCorrect: currentSession.firstTryCorrect,
      streak: currentSession.bestStreak,
      passed,
      accuracyPercent: accuracy,
      config: currentLevelConfig,
    });
  }
}

export function cleanupGameplay() {
  stopSpeech();
  currentSession = null;
  currentSetup = null;
  currentLevelConfig = null;
}

// ========== REPORT BUTTON (parent tool) ==========
function injectReportButton(gameArea, config) {
  const btn = document.createElement('button');
  btn.className = 'report-btn';
  btn.textContent = '\u26A0';
  btn.title = 'Report issue';
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showReportMenu(gameArea);
  }, { passive: false });
  gameArea.appendChild(btn);
}

function showReportMenu(gameArea) {
  // Remove any existing menu
  const existing = document.querySelector('.report-menu-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'report-menu-overlay';
  overlay.innerHTML = `
    <div class="report-menu">
      <div class="report-menu-title">Report Issue</div>
      <button class="report-menu-btn report-menu-noanswer" data-type="no-answer">No correct answer</button>
      <button class="report-menu-btn report-menu-general" data-type="general">General note</button>
      <div class="report-general-input" style="display:none;">
        <textarea class="report-textarea" placeholder="Describe the issue..." rows="3"></textarea>
        <button class="report-menu-btn report-menu-submit">Submit</button>
      </div>
      <button class="report-menu-cancel">Cancel</button>
    </div>
  `;

  // Close on overlay tap (outside menu)
  overlay.addEventListener('pointerdown', (e) => {
    if (e.target === overlay) { e.preventDefault(); overlay.remove(); }
  }, { passive: false });

  // Cancel button
  overlay.querySelector('.report-menu-cancel').addEventListener('pointerdown', (e) => {
    e.preventDefault(); overlay.remove();
  }, { passive: false });

  // "No correct answer" — same as original reportAndSkip
  overlay.querySelector('[data-type="no-answer"]').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    overlay.remove();
    submitReport(gameArea, 'no-correct-answer', null);
  }, { passive: false });

  // "General note" — show text input
  overlay.querySelector('[data-type="general"]').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    overlay.querySelector('.report-general-input').style.display = 'flex';
    overlay.querySelector('.report-textarea').focus();
  }, { passive: false });

  // Submit general note
  overlay.querySelector('.report-menu-submit').addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const text = overlay.querySelector('.report-textarea').value.trim();
    if (!text) return; // don't submit empty
    overlay.remove();
    submitReport(gameArea, 'general', text);
  }, { passive: false });

  document.body.appendChild(overlay);
}

function collectQuestionContext() {
  if (!currentSession || !currentSetup || !currentLevelConfig) return {};

  const ctx = {
    world: currentLevelConfig.worldId,
    level: currentLevelConfig.levelIndex,
    missionKey: currentLevelConfig.missionKey,
    type: currentSetup.type,
    operation: currentLevelConfig.operation,
    difficulty: currentLevelConfig.difficulty,
    problemIndex: currentSession.currentProblemIndex,
    totalProblems: currentSession.totalProblems,
  };

  const q = currentSetup.question;
  if (q) {
    ctx.a = q.a;
    ctx.b = q.b;
    ctx.op = q.op;
    ctx.expectedAnswer = q.answer ?? currentSetup.correctAnswer;
    ctx.options = q.options || [];
    ctx.displayText = q.displayText || '';
    if (q.sequence) ctx.sequence = q.sequence;
    if (q.paths) ctx.paths = q.paths.map(p => ({ display: p.display, value: p.value }));
    if (q.correctIndex !== undefined) ctx.correctIndex = q.correctIndex;
    if (currentSetup.target !== undefined) ctx.target = currentSetup.target;
    if (currentSetup.bondData) {
      ctx.orbs = currentSetup.bondData.orbs;
      ctx.bondTarget = currentSetup.bondData.target;
    }
    if (currentSetup.threshold !== undefined) ctx.threshold = currentSetup.threshold;
  }

  return ctx;
}

function submitReport(gameArea, reportType, noteText) {
  const report = {
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    reportType,
    ...collectQuestionContext(),
  };

  if (noteText) report.note = noteText;

  // Save to localStorage
  const KEY = 'mathheroes_reports';
  const reports = JSON.parse(localStorage.getItem(KEY) || '[]');
  reports.push(report);
  localStorage.setItem(KEY, JSON.stringify(reports));

  // Count as correct so the kid can continue
  currentSession.correctCount++;
  currentSession.firstTryCorrect++;

  // Advance to next problem
  if (currentSetup.type === 'HeroRescue') {
    heroRescuePhase++;
    if (heroRescuePhase < (currentSetup.totalPhases || 3)) {
      currentSession.currentProblemIndex++;
      setPlaying(currentSession);
      renderCurrentProblem(gameArea);
      return;
    }
  }

  const hasMore = advanceProblem(currentSession);
  if (hasMore) {
    renderCurrentProblem(gameArea);
  } else {
    finishLevel(gameArea);
  }
}

export function getReports() {
  return JSON.parse(localStorage.getItem('mathheroes_reports') || '[]');
}

export function clearReports() {
  localStorage.removeItem('mathheroes_reports');
}
