// gameplay.js — Main game screen controller

import { createGameSession, startSession, checkAnswer, advanceProblem, setAnimating, setPlaying, checkPassThreshold, getAccuracyPercent } from '../engine/game-engine.js';
import { getLevelConfig } from '../levels/world-data.js';
import { setupPowerLaunch, setupPathChooser, setupNumberCatcher, setupShieldMatch, setupBridgeBuilder, setupHeroRescue, setupStarCollector } from '../levels/level-types.js';
import { speak, stopSpeech, isUsingHebrew } from '../audio/speech.js';
import { playCorrect, playWrong, playWhoosh, playPop, playFanfare, playStreak, playRetry } from '../audio/sfx.js';
import { PHRASES, wrongExplanationHebrew, fillTemplate, numberToHebrew } from '../audio/hebrew-phrases.js';
import { shakeElement, glowElement, pulseElement, stopPulse, showCorrectCelebration } from '../ui/animations.js';
import { delay, pickRandom } from '../utils/helpers.js';
import { renderStars } from '../ui/progress-bar.js';
import { getQuestionCountNumber, getState } from '../engine/save-manager.js';

let currentSession = null;
let currentSetup = null;
let currentLevelConfig = null;
let onLevelComplete = null;
let shieldRound = 0;
let heroRescuePhase = 0;

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
  const playerName = getState().player.name || 'Hero';
  if (currentSession.currentProblemIndex === 0) {
    if (isUsingHebrew()) {
      const missionText = PHRASES.missions[config.missionKey];
      if (missionText) await speak(`${playerName}! ${missionText}`);
    } else {
      // English fallback mission narration — personalized with name
      const engMissions = {
        '1-1': `${playerName}! Time to run!`,
        '1-2': `${playerName}, three paths. Only one is correct!`,
        '1-3': `${playerName}, find all the numbers bigger than four!`,
        '1-4': `${playerName}, find two numbers that add up to the target!`,
        '1-5': `${playerName}, what is the missing number? Build the bridge!`,
        '1-6': `${playerName}! Doctor Zero is here! Three missions to free the city!`,
        '2-1': `${playerName}! Climb the Web Tower!`,
        '2-2': `${playerName}, match the numbers to power the web shield!`,
        '2-3': `${playerName}, pick the right path through the webs!`,
        '2-4': `${playerName}, find all the numbers bigger than seven!`,
        '2-5': `${playerName}, build the spider bridge! What number is missing?`,
        '2-6': `${playerName}! The Web King awaits! Three challenges to free the tower!`,
        '3-1': `${playerName}! First experiment in the Iron Lab!`,
        '3-2': `${playerName}, choose the correct path through the lab!`,
        '3-3': `${playerName}, power up the iron shield!`,
        '3-4': `${playerName}, find all numbers bigger than ten!`,
        '3-5': `${playerName}, build the metal bridge! Find the missing number!`,
        '3-6': `${playerName}! The Iron Robot is activated! Three missions to shut it down!`,
        '4-1': `${playerName}! The mushroom journey begins!`,
        '4-2': `${playerName}, match numbers to power the mushroom shield!`,
        '4-3': `${playerName}, find the path through the forest!`,
        '4-4': `${playerName}, build the nature bridge! What's the missing number?`,
        '4-5': `${playerName}, find all numbers bigger than fifteen!`,
        '4-6': `${playerName}! The Mushroom King rises! Three missions to save the forest!`,
        '5-1': `${playerName}! Launch into the Grand Circuit!`,
        '5-2': `${playerName}, pick the right track!`,
        '5-3': `${playerName}, charge the race shield!`,
        '5-4': `${playerName}, find all numbers bigger than twenty!`,
        '5-5': `${playerName}, build the race bridge! Find the missing number!`,
        '5-6': `${playerName}! The final race! Three challenges to become champion!`,
        '6-1': `${playerName}! Enter Doctor Zero's Lair!`,
        '6-2': `${playerName}, break through Zero's shield!`,
        '6-3': `${playerName}, three paths. Choose wisely!`,
        '6-4': `${playerName}, build the final bridge!`,
        '6-5': `${playerName}, find the hidden numbers in the darkness!`,
        '6-6': `${playerName}! Doctor Zero himself! Three final missions to save the world!`,
      };
      const engText = engMissions[config.missionKey];
      if (engText) await speak(engText);
    }
  }
  // Speak the math problem — English only (Hebrew TTS doesn't produce sound)
  if (currentSetup?.question && !isUsingHebrew()) {
    const q = currentSetup.question;
    await delay(300);
    if (q.a !== undefined && q.op) {
      const opWord = q.op === '+' ? 'plus' : q.op === '-' ? 'minus' : q.op === '×' ? 'times' : q.op === '÷' ? 'divided by' : 'plus';
      speak(`How much is ${q.a} ${opWord} ${q.b}?`);
    }
  } else if (isUsingHebrew() && currentSetup?.hebrewText) {
    await delay(300);
    speak(currentSetup.hebrewText);
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
        const pathName = getState().player.name || '';
        if (isUsingHebrew()) {
          speak(`${pickRandom(PHRASES.correct)} ${pathName}!`);
        } else {
          speak(pickRandom([`Correct, ${pathName}!`, `Great job, ${pathName}!`, `Amazing, ${pathName}!`, `Perfect, ${pathName}!`]));
        }
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
        const shieldName = getState().player.name || '';
        if (isUsingHebrew()) {
          speak(`${pickRandom(PHRASES.correct)} ${shieldName}!`);
        } else {
          speak(pickRandom([`Correct, ${shieldName}!`, `Great job, ${shieldName}!`, `Perfect, ${shieldName}!`]));
        }
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
        speak(isUsingHebrew() ? PHRASES.wrong : 'Almost! Try again.');
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
        const pName = getState().player.name || '';

        if (result.done) {
          // All matching numbers found — complete
          const effectiveCorrect = Math.max(0, currentSetup.totalMatching - result.wrongTaps);
          currentSession.correctCount = currentSetup.totalMatching;
          currentSession.firstTryCorrect = effectiveCorrect;
          currentSession.totalProblems = currentSetup.totalMatching;
          currentSession.state = 'COMPLETE';
          showCorrectCelebration();
          speak(`Amazing, ${pName}! You found them all!`);
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
  const playerName = getState().player.name || '';
  if (isUsingHebrew()) {
    await speak(`${pickRandom(PHRASES.correct)} ${playerName}!`);
  } else {
    await speak(pickRandom([
      `Correct, ${playerName}!`,
      `Great job, ${playerName}!`,
      `Amazing, ${playerName}!`,
      `You are a hero, ${playerName}!`,
      `Perfect, ${playerName}!`,
      `Awesome, ${playerName}!`,
    ]));
  }
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
  let explanation;
  if (isUsingHebrew()) {
    if (q && q.a !== undefined && q.op) {
      explanation = wrongExplanationHebrew(q.a, q.op, q.b, currentSetup.correctAnswer);
    } else {
      explanation = fillTemplate(PHRASES.wrongGeneric, { answer: numberToHebrew(currentSetup.correctAnswer) });
    }
  } else {
    const pn = getState().player.name || '';
    if (q && q.a !== undefined && q.op) {
      const opWord = q.op === '+' ? 'plus' : q.op === '-' ? 'minus' : 'times';
      explanation = `Almost, ${pn}! The answer is ${currentSetup.correctAnswer}, because ${q.a} ${opWord} ${q.b} equals ${currentSetup.correctAnswer}.`;
    } else {
      explanation = `Almost, ${pn}! The answer is ${currentSetup.correctAnswer}.`;
    }
  }
  await speak(explanation, 0.85);

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
  if (isUsingHebrew()) {
    const explanation = fillTemplate(PHRASES.wrongGeneric, { answer: numberToHebrew(currentSetup.correctAnswer) });
    await speak(explanation, 0.85);
  } else {
    await speak(`Almost! The correct answer is ${currentSetup.correctAnswer}.`, 0.85);
  }
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
  const pName = getState().player.name || '';
  if (streak === 2) {
    setTimeout(() => { playStreak(); speak(isUsingHebrew() ? `${pName}! ${PHRASES.streak2}` : `Two in a row, ${pName}!`); }, 600);
  } else if (streak === 3) {
    setTimeout(() => { playStreak(); speak(isUsingHebrew() ? `${pName}! ${PHRASES.streak3}` : `Three in a row! Amazing, ${pName}!`); }, 600);
  } else if (streak === 5) {
    setTimeout(() => { playStreak(); speak(isUsingHebrew() ? `${pName}! ${PHRASES.streak5}` : `Five in a row! ${pName}, you are a superhero!`); }, 600);
  } else if (streak === 10) {
    setTimeout(() => { playStreak(); speak(isUsingHebrew() ? `${pName}! ${PHRASES.streak10}` : `Ten in a row! ${pName} is unstoppable!`); }, 600);
  }
}

async function finishLevel(gameArea) {
  playFanfare();
  if (onLevelComplete) {
    onLevelComplete({
      totalProblems: currentSession.totalProblems,
      correctCount: currentSession.correctCount,
      firstTryCorrect: currentSession.firstTryCorrect,
      streak: currentSession.bestStreak,
      passed: checkPassThreshold(currentSession),
      accuracyPercent: getAccuracyPercent(currentSession),
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

// ========== REPORT MISSING ANSWER ==========
function injectReportButton(gameArea, config) {
  const btn = document.createElement('button');
  btn.className = 'report-btn';
  btn.textContent = '⚠';
  btn.title = 'Report bad question';
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    reportAndSkip(gameArea);
  }, { passive: false });
  gameArea.appendChild(btn);
}

function reportAndSkip(gameArea) {
  if (!currentSession || !currentSetup || !currentLevelConfig) return;

  // Collect full question data for debugging
  const report = {
    timestamp: new Date().toISOString(),
    world: currentLevelConfig.worldId,
    level: currentLevelConfig.levelIndex,
    missionKey: currentLevelConfig.missionKey,
    type: currentSetup.type,
    operation: currentLevelConfig.operation,
    difficulty: currentLevelConfig.difficulty,
  };

  const q = currentSetup.question;
  if (q) {
    report.a = q.a;
    report.b = q.b;
    report.op = q.op;
    report.expectedAnswer = q.answer ?? currentSetup.correctAnswer;
    report.options = q.options || [];
    report.displayText = q.displayText || '';
    if (q.sequence) report.sequence = q.sequence;
    if (q.paths) report.paths = q.paths.map(p => ({ display: p.display, value: p.value }));
    if (q.correctIndex !== undefined) report.correctIndex = q.correctIndex;
    if (currentSetup.target !== undefined) report.target = currentSetup.target;
    if (currentSetup.bondData) {
      report.orbs = currentSetup.bondData.orbs;
      report.bondTarget = currentSetup.bondData.target;
    }
    if (currentSetup.threshold !== undefined) report.threshold = currentSetup.threshold;
  }

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
