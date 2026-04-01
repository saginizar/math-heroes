// level-types.js — Render + interaction logic for each level type

import { generateQuestion, generateComparisonSet, generateNumberBonds, generateSequence, generatePathChooserProblem, generateColumnAdd } from '../engine/question-gen.js';
import { getDifficultyParams } from '../engine/difficulty.js';
import { shuffleArray, randomInt, delay } from '../utils/helpers.js';
import { PHRASES, numberToHebrew } from '../audio/hebrew-phrases.js';

// ========== POWER LAUNCH ==========
export function setupPowerLaunch(container, levelConfig) {
  const params = getDifficultyParams(levelConfig.operation);
  const question = generateQuestion(levelConfig.operation, params);

  container.innerHTML = `
    <div class="level-scene power-launch-scene">
      <div class="problem-text" dir="rtl">${question.verticalHtml || question.displayText}</div>
      <div class="game-area">
        <div class="hero-runner" id="hero-runner">
          <div class="hero-mini"></div>
        </div>
        <div class="track-line"></div>
      </div>
      ${question.showVisualAid ? renderVisualAid(question.a, question.b, question.op) : ''}
      <div class="answer-buttons">
        ${question.options.map(opt => `
          <button class="answer-btn num-btn" data-answer="${opt}">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;

  return {
    question,
    correctAnswer: question.answer,
    hebrewText: question.hebrewText,
    type: 'PowerLaunch',
    onCorrect: () => {
      const hero = container.querySelector('#hero-runner');
      if (hero) {
        const dist = Math.min(question.answer * 30, 280);
        hero.style.setProperty('--dash-dist', `${dist}px`);
        hero.classList.add('dashing');
      }
    },
  };
}

// ========== PATH CHOOSER ==========
export function setupPathChooser(container, levelConfig) {
  const op = levelConfig.operation || 'addition';
  const params = getDifficultyParams(op);
  // For division, target is the quotient (small number); for multiplication let generator decide; for add/sub use range
  let target;
  if (op === 'division') {
    target = randomInt(1, 8);
  } else if (op === 'multiplication') {
    target = randomInt(4, 20); // will be overridden inside generator for clean products
  } else {
    const maxTarget = Math.min(params.max * 5, 50);
    target = randomInt(Math.max(params.min + 2, 8), maxTarget);
  }
  const problem = generatePathChooserProblem(target, params, op);

  container.innerHTML = `
    <div class="level-scene path-chooser-scene">
      <div class="target-display" dir="rtl">
        <span class="target-label">${PHRASES.targetNumber}:</span>
        <span class="target-number">${problem.target}</span>
      </div>
      <div class="game-area paths-area">
        <div class="hero-at-top">
          <div class="hero-mini"></div>
        </div>
        <div class="paths-container">
          ${problem.paths.map((p, i) => `
            <button class="path-btn" data-path-index="${i}" data-value="${p.value}">
              <span class="path-expr">${p.display}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  return {
    question: problem,
    correctAnswer: problem.target,
    correctIndex: problem.correctIndex,
    hebrewText: `${PHRASES.threePaths} ${PHRASES.targetNumber}: ${numberToHebrew(problem.target)}`,
    type: 'PathChooser',
    checkAnswer: (index) => parseInt(index) === problem.correctIndex,
    onCorrect: (btnEl) => {
      if (btnEl) btnEl.classList.add('path-correct');
    },
    onWrong: (btnEl) => {
      if (btnEl) btnEl.classList.add('path-wrong');
    },
  };
}

// ========== NUMBER CATCHER ==========
export function setupNumberCatcher(container, levelConfig) {
  const params = getDifficultyParams(levelConfig.operation);
  const threshold = levelConfig.threshold || 4;
  const numbers = generateComparisonSet(threshold, levelConfig.problemCount, params);

  container.innerHTML = `
    <div class="level-scene number-catcher-scene">
      <div class="rule-text" dir="rtl">${PHRASES.catchRule} <span class="rule-number">${threshold}</span>!</div>
      <div class="speed-slider-area">
        <span class="speed-label-end">${PHRASES.fast}</span>
        <input type="range" class="speed-slider" id="catcher-speed" min="3" max="8" value="5" step="0.5" dir="ltr" style="direction:ltr">
        <span class="speed-label-end">${PHRASES.slow}</span>
      </div>
      <div class="game-area catcher-area" id="catcher-area"></div>
      <div class="catcher-score" dir="rtl">
        <span class="caught-count">${PHRASES.caught}: <span id="caught-num">0</span></span>
        <span class="missed-count">${PHRASES.missed}: <span id="missed-num">0</span></span>
      </div>
    </div>
  `;

  let caught = 0;
  let missed = 0;
  let launched = 0;
  let finished = 0;

  return {
    numbers,
    threshold,
    hebrewText: `catch numbers bigger than ${threshold}`,
    type: 'NumberCatcher',
    caught: () => caught,
    missed: () => missed,
    start: (onComplete) => {
      const area = container.querySelector('#catcher-area');
      if (!area) return;

      const launchNext = () => {
        if (launched >= numbers.length) return;
        const numData = numbers[launched];
        launched++;

        // Read speed from slider (higher value = faster = shorter duration)
        const slider = container.querySelector('#catcher-speed');
        const speedVal = slider ? parseFloat(slider.value) : 5;
        const duration = (10 - speedVal) + 2; // Range: 4s (fast) to 10s (slow)

        const cloud = document.createElement('button');
        cloud.className = 'floating-number';
        cloud.textContent = numData.value;
        cloud.dataset.matches = numData.matches;
        cloud.dataset.value = numData.value;

        const top = randomInt(10, 70);
        cloud.style.top = `${top}%`;

        const fromRight = launched % 2 === 0;
        cloud.style.animationName = fromRight ? 'floatRight' : 'floatLeft';
        cloud.style.animationDuration = `${duration}s`;
        cloud.style.animationTimingFunction = 'linear';
        cloud.style.animationFillMode = 'forwards';

        cloud.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (cloud.classList.contains('caught-num-cloud') || cloud.classList.contains('missed-cloud')) return;

          if (numData.matches) {
            caught++;
            cloud.classList.add('caught-num-cloud');
            container.querySelector('#caught-num').textContent = caught;
          } else {
            cloud.classList.add('wrong-catch');
          }
        }, { passive: false });

        cloud.addEventListener('animationend', () => {
          if (!cloud.classList.contains('caught-num-cloud') && numData.matches) {
            missed++;
            container.querySelector('#missed-num').textContent = missed;
          }
          cloud.remove();
          finished++;
          if (finished >= numbers.length) {
            onComplete(caught, missed);
          }
        });

        area.appendChild(cloud);

        if (launched < numbers.length) {
          setTimeout(launchNext, 1500);
        }
      };

      setTimeout(launchNext, 800);
    },
  };
}

// ========== SHIELD MATCH ==========
export function setupShieldMatch(container, levelConfig, roundIndex = 0) {
  const params = getDifficultyParams(levelConfig.operation);
  const targetBase = randomInt(6, Math.min(params.max, 12));
  const target = targetBase + roundIndex;
  const bondData = generateNumberBonds(target, 6);

  container.innerHTML = `
    <div class="level-scene shield-match-scene">
      <div class="match-instruction" dir="rtl">${PHRASES.findTwo} ${numberToHebrew(target)}!</div>
      <div class="game-area shield-area">
        <div class="shield-center">
          <div class="shield-target">${target}</div>
        </div>
        <div class="orbs-ring">
          ${bondData.orbs.map((n, i) => `
            <button class="orb-btn" data-value="${n}" data-index="${i}">${n}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  let selectedOrb = null;

  return {
    target,
    bondData,
    hebrewText: `${PHRASES.findTwo} ${numberToHebrew(target)}!`,
    type: 'ShieldMatch',
    handleOrbTap: (orbBtn) => {
      const value = parseInt(orbBtn.dataset.value);

      if (orbBtn.classList.contains('orb-matched')) return null;

      if (selectedOrb === null) {
        // First selection
        selectedOrb = { el: orbBtn, value };
        orbBtn.classList.add('orb-selected');
        return null; // No result yet
      }

      if (orbBtn === selectedOrb.el) {
        // Deselect
        orbBtn.classList.remove('orb-selected');
        selectedOrb = null;
        return null;
      }

      // Second selection — check pair
      const sum = selectedOrb.value + value;
      const firstEl = selectedOrb.el;

      if (sum === target) {
        firstEl.classList.remove('orb-selected');
        firstEl.classList.add('orb-matched');
        orbBtn.classList.add('orb-matched');
        selectedOrb = null;
        return { correct: true, orbs: [firstEl, orbBtn] };
      } else {
        firstEl.classList.remove('orb-selected');
        firstEl.classList.add('orb-wrong');
        orbBtn.classList.add('orb-wrong');
        setTimeout(() => {
          firstEl.classList.remove('orb-wrong');
          orbBtn.classList.remove('orb-wrong');
        }, 400);
        selectedOrb = null;
        return { correct: false };
      }
    },
    resetSelection: () => {
      selectedOrb = null;
    },
  };
}

// ========== BRIDGE BUILDER ==========
export function setupBridgeBuilder(container, levelConfig) {
  const seqData = generateSequence(levelConfig.difficulty);

  container.innerHTML = `
    <div class="level-scene bridge-builder-scene">
      <div class="problem-text" dir="rtl">${PHRASES.missingNumber}</div>
      <div class="game-area bridge-area">
        <div class="bridge-planks">
          ${seqData.sequence.map((n, i) => `
            <div class="bridge-plank ${n === null ? 'plank-gap' : 'plank-filled'}">
              ${n !== null ? n : '?'}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="answer-buttons">
        ${seqData.options.map(opt => `
          <button class="answer-btn num-btn" data-answer="${opt}">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;

  return {
    question: seqData,
    correctAnswer: seqData.answer,
    hebrewText: PHRASES.missingNumber,
    type: 'BridgeBuilder',
    onCorrect: () => {
      const gap = container.querySelector('.plank-gap');
      if (gap) {
        gap.textContent = seqData.answer;
        gap.classList.remove('plank-gap');
        gap.classList.add('plank-filled', 'plank-just-filled');
      }
    },
  };
}

// ========== HERO RESCUE (Multi-step) ==========
export function setupHeroRescue(container, levelConfig, phaseIndex = 0) {
  const params = getDifficultyParams(levelConfig.operation);
  const op = levelConfig.operation || 'addition';
  // For mixed world boss, rotate through all 4 operations across phases
  const opsForPhases = op === 'mixed'
    ? ['addition', 'subtraction', 'multiplication']
    : [op, op, op];

  const phases = [
    () => {
      const q = generateQuestion(opsForPhases[0], params);
      return { ...q, phaseName: `${PHRASES.phase} 1`, phaseDesc: '' };
    },
    () => {
      const s = generateSequence(levelConfig.difficulty);
      return {
        displayText: s.sequence.map(n => n === null ? '?' : n).join(', '),
        answer: s.answer,
        options: s.options,
        hebrewText: PHRASES.missingNumber,
        phaseName: `${PHRASES.phase} 2`,
        phaseDesc: '',
        isSequence: true,
        sequence: s.sequence,
        showVisualAid: false,
        verticalHtml: null,
      };
    },
    () => {
      const q = generateQuestion(opsForPhases[2], { ...params, min: params.min + 1, max: Math.min(params.max + 5, 50) });
      return { ...q, phaseName: `${PHRASES.phase} 3`, phaseDesc: '' };
    },
  ];

  const phase = phases[phaseIndex]();

  container.innerHTML = `
    <div class="level-scene hero-rescue-scene">
      <div class="phase-indicator">
        ${[0, 1, 2].map(i => `
          <div class="phase-dot ${i < phaseIndex ? 'phase-done' : i === phaseIndex ? 'phase-current' : 'phase-pending'}">
            ${i + 1}
          </div>
        `).join('<div class="phase-line"></div>')}
      </div>
      <div class="problem-text" dir="rtl">${phase.verticalHtml || phase.displayText}</div>
      ${phase.showVisualAid ? renderVisualAid(phase.a, phase.b, phase.op) : ''}
      <div class="answer-buttons">
        ${phase.options.map(opt => `
          <button class="answer-btn num-btn" data-answer="${opt}">${opt}</button>
        `).join('')}
      </div>
    </div>
  `;

  return {
    question: phase,
    correctAnswer: phase.answer,
    hebrewText: phase.hebrewText,
    type: 'HeroRescue',
    phaseIndex,
    totalPhases: 3,
  };
}

// ========== STAR COLLECTOR (Static grid — replaces NumberCatcher) ==========
export function setupStarCollector(container, levelConfig) {
  const params = getDifficultyParams(levelConfig.operation);
  const threshold = levelConfig.threshold || 4;
  const count = levelConfig.problemCount || 8;
  const numbers = generateComparisonSet(threshold, count, params);
  const totalMatching = numbers.filter(n => n.matches).length;

  container.innerHTML = `
    <div class="level-scene star-collector-scene">
      <div class="rule-text" dir="rtl">${PHRASES.catchRule} <span class="rule-number">${threshold}</span>!</div>
      <div class="collector-progress" dir="rtl">
        <span id="collector-found">0</span> / ${totalMatching} ⭐
      </div>
      <div class="game-area collector-grid" id="collector-grid">
        ${numbers.map((n, i) => `
          <button class="collector-num" data-value="${n.value}" data-matches="${n.matches}" data-index="${i}">
            ${n.value}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  let found = 0;
  let wrongTaps = 0;

  return {
    numbers,
    threshold,
    totalMatching,
    hebrewText: `find numbers bigger than ${threshold}`,
    type: 'StarCollector',
    handleTap: (btn) => {
      if (btn.classList.contains('collector-found')) return null;

      const matches = btn.dataset.matches === 'true';
      if (matches) {
        found++;
        btn.classList.add('collector-found');
        container.querySelector('#collector-found').textContent = found;
        return { correct: true, done: found >= totalMatching, found, wrongTaps };
      } else {
        wrongTaps++;
        btn.classList.add('collector-wrong');
        setTimeout(() => btn.classList.remove('collector-wrong'), 400);
        return { correct: false, done: false };
      }
    },
  };
}

// ========== COLUMN ADDITION ==========
export function setupColumnAdd(container, levelConfig) {
  const problem = generateColumnAdd(levelConfig.difficulty || 1);
  const { a, b, sum, numCols, steps } = problem;

  // Display order: left = most significant column
  const colOrder = [];
  for (let c = numCols - 1; c >= 0; c--) colOrder.push(c);

  const getDigit = (n, col) => Math.floor(n / Math.pow(10, col)) % 10;
  const hasDigit = (n, col) => col < n.toString().length;

  const carryHtml = colOrder.map(c =>
    `<div class="ca-cell ca-carry-cell" id="ca-carry-${c}" data-col="${c}"></div>`
  ).join('');

  const aHtml = colOrder.map(c =>
    `<div class="ca-cell ca-num-digit">${hasDigit(a, c) ? getDigit(a, c) : ''}</div>`
  ).join('');

  const bHtml = colOrder.map(c =>
    `<div class="ca-cell ca-num-digit">${hasDigit(b, c) ? getDigit(b, c) : ''}</div>`
  ).join('');

  const ansHtml = colOrder.map(c =>
    `<div class="ca-cell ca-ans-cell${c === 0 ? ' ca-active' : ''}" id="ca-ans-${c}" data-col="${c}">?</div>`
  ).join('');

  const keypadHtml = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    .map(d => `<button class="ca-key" data-d="${d}">${d}</button>`)
    .join('');

  container.innerHTML = `
    <div class="level-scene column-add-scene">
      <div class="ca-title">Column Addition</div>
      <div class="ca-problem">
        <div class="ca-row ca-carry-row">
          <div class="ca-op-spacer"></div>
          ${carryHtml}
        </div>
        <div class="ca-row">
          <div class="ca-op-spacer"></div>
          ${aHtml}
        </div>
        <div class="ca-row ca-row-b">
          <div class="ca-op-cell">+</div>
          ${bHtml}
        </div>
        <div class="ca-line-row"><div class="ca-line"></div></div>
        <div class="ca-row">
          <div class="ca-op-spacer"></div>
          ${ansHtml}
        </div>
      </div>
      <div class="ca-hint" id="ca-hint"></div>
      <div class="ca-keypad">${keypadHtml}</div>
    </div>
  `;

  return {
    type: 'ColumnAdd',
    problem,
    currentStep: 0,
    hadMistake: false,
    hebrewText: `${a} plus ${b} equals ${sum}`,
    correctAnswer: sum,
    question: { a, b, op: '+', answer: sum, displayText: `${a} + ${b} = ?` },
  };
}

// ========== HELPERS ==========
function renderVisualAid(a, b, op) {
  if (op === '+') {
    const dotsA = '● '.repeat(a).trim();
    const dotsB = '● '.repeat(b).trim();
    return `<div class="visual-aid"><span class="dots-group">${dotsA}</span> + <span class="dots-group">${dotsB}</span></div>`;
  }
  return '';
}
