// question-gen.js — Procedural math problem generator

import { randomInt, shuffleArray } from '../utils/helpers.js';
import { getDifficultyParams } from './difficulty.js';
import { getDifficultyPref } from './save-manager.js';
import { problemToHebrew, numberToHebrew, PHRASES } from '../audio/hebrew-phrases.js';

// Track recent questions across the session to avoid repetition
// Use a larger pool and also seed with timestamp for variety across reloads
const recentQuestions = [];
const sessionSeed = Date.now();

function seededVariety() {
  // Add variety based on session start time
  return ((sessionSeed % 7) + 1);
}

function makeAddition(params) {
  const offset = seededVariety();
  const isEasy = getDifficultyPref() === 'easy';
  let a, b, answer;
  let retries = 0;

  // Easy mode: ~35% of problems include a double-digit number for variety
  const forceDoubleDigit = isEasy && randomInt(1, 100) <= 35;

  do {
    if (forceDoubleDigit) {
      a = randomInt(10, 20);
      b = randomInt(1, 10);
    } else {
      a = randomInt(params.min, params.max);
      b = randomInt(params.min, Math.max(params.min, params.max - offset));
    }
    answer = a + b;
    retries++;

    // Easy mode: no carrying — ones digits must sum <= 10, total <= 110
    if (isEasy && (a >= 10 || b >= 10)) {
      const onesSum = (a % 10) + (b % 10);
      if (onesSum > 10 || answer > 110) continue;
    }
    break;
  } while (retries < 50);

  return { a, b, op: '+', answer, hebrewText: problemToHebrew(a, '+', b) };
}

function makeSubtraction(params) {
  // Ensure non-negative result
  let a = randomInt(params.min, params.max);
  let b = randomInt(params.min, Math.min(a, params.max));
  if (a < b) [a, b] = [b, a];
  const answer = a - b;
  return { a, b, op: '-', answer, hebrewText: problemToHebrew(a, '-', b) };
}

function makeMultiplication(params) {
  const maxFactor = Math.min(params.max, 10);
  const a = randomInt(1, Math.min(maxFactor, 5));
  const b = randomInt(1, Math.min(maxFactor, 5));
  const answer = a * b;
  return { a, b, op: '×', answer, hebrewText: problemToHebrew(a, '×', b) };
}

function generateDistractors(answer, count, params) {
  const distractors = new Set();
  const dist = params.distractorDistance;

  // Close distractors
  if (answer + 1 > 0) distractors.add(answer + 1);
  if (answer - 1 >= 0) distractors.add(answer - 1);
  if (answer + dist > 0) distractors.add(answer + dist);
  if (answer - dist >= 0) distractors.add(answer - dist);

  // Common error: off by 10
  if (answer + 10 <= 100) distractors.add(answer + 10);
  if (answer - 10 >= 0) distractors.add(answer - 10);

  // Random in range
  for (let i = 0; i < 10; i++) {
    const r = randomInt(Math.max(0, answer - 10), answer + 10);
    if (r >= 0) distractors.add(r);
  }

  // Remove correct answer
  distractors.delete(answer);

  // Pick required count
  const arr = shuffleArray([...distractors]);
  return arr.slice(0, count);
}

function isDuplicate(question) {
  const key = `${question.a}${question.op}${question.b}`;
  return recentQuestions.includes(key);
}

function trackQuestion(question) {
  const key = `${question.a}${question.op}${question.b}`;
  recentQuestions.push(key);
  if (recentQuestions.length > 40) recentQuestions.shift();
}

export function generateQuestion(operation, difficultyOverride = null) {
  const params = difficultyOverride || getDifficultyParams(operation);
  let question;
  let attempts = 0;

  do {
    switch (operation) {
      case 'addition':
        question = makeAddition(params);
        break;
      case 'subtraction':
        question = makeSubtraction(params);
        break;
      case 'multiplication':
        question = makeMultiplication(params);
        break;
      default:
        question = makeAddition(params);
    }
    attempts++;
  } while (isDuplicate(question) && attempts < 20);

  trackQuestion(question);

  const distractors = generateDistractors(question.answer, 2, params);
  const options = shuffleArray([question.answer, ...distractors]);

  return {
    ...question,
    options,
    displayText: `${question.a} ${question.op} ${question.b} = ?`,
    verticalHtml: renderVerticalProblem(question.a, question.op, question.b),
    showVisualAid: params.visualAids,
  };
}

// Generate a comparison question for Number Catcher
export function generateComparisonSet(threshold, count, params) {
  const numbers = [];
  const matching = Math.floor(count * 0.5); // ~half should match

  for (let i = 0; i < matching; i++) {
    numbers.push({ value: randomInt(threshold + 1, Math.max(threshold + 5, params.max)), matches: true });
  }
  for (let i = matching; i < count; i++) {
    numbers.push({ value: randomInt(params.min, threshold), matches: false });
  }
  return shuffleArray(numbers);
}

// Generate number bond pairs for Shield Match
export function generateNumberBonds(target, orbCount) {
  const orbs = [];
  const pairs = [];

  // Ensure at least 2 valid pairs
  for (let i = 0; i < Math.min(3, Math.floor(orbCount / 2)); i++) {
    const a = randomInt(1, target - 1);
    const b = target - a;
    if (!orbs.includes(a) && !orbs.includes(b) && a !== b) {
      orbs.push(a, b);
      pairs.push([a, b]);
    }
  }

  // Fill remaining orbs with non-pairing numbers
  while (orbs.length < orbCount) {
    const n = randomInt(1, target + 3);
    if (!orbs.includes(n)) {
      // Make sure it doesn't accidentally form a valid pair
      const complement = target - n;
      if (!orbs.includes(complement) || n === complement) {
        orbs.push(n);
      }
    }
  }

  return { orbs: shuffleArray(orbs.slice(0, orbCount)), target, pairs };
}

// Generate sequence for Bridge Builder — procedural to avoid repetition
export function generateSequence(difficulty) {
  // Procedurally generate arithmetic sequences
  function makeArithmeticSeq() {
    const start = randomInt(1, difficulty <= 2 ? 5 : 15);
    const step = randomInt(1, difficulty <= 2 ? 5 : 10);
    const len = randomInt(4, 6);
    const seq = [];
    for (let i = 0; i < len; i++) seq.push(start + step * i);
    const gapIndex = randomInt(1, len - 2); // Don't gap first or last
    return { seq, gap: gapIndex, answer: seq[gapIndex] };
  }

  // Repeating pattern sequences
  function makePatternSeq() {
    const patterns = [
      [1, 2], [2, 3], [3, 5], [1, 3], [2, 4], [5, 10],
      [1, 1, 2], [3, 3, 6], [2, 2, 4], [1, 2, 3], [4, 4, 8],
    ];
    const pat = patterns[randomInt(0, patterns.length - 1)];
    const reps = randomInt(2, 3);
    const seq = [];
    for (let r = 0; r < reps; r++) seq.push(...pat);
    const gapIndex = randomInt(pat.length, seq.length - 2);
    return { seq, gap: gapIndex, answer: seq[gapIndex] };
  }

  // Pick random type
  const usePattern = randomInt(0, 3) === 0; // 25% chance pattern, 75% arithmetic
  const picked = usePattern ? makePatternSeq() : makeArithmeticSeq();

  const display = [...picked.seq];
  const answer = display[picked.gap];
  display[picked.gap] = null;

  const distractors = generateDistractors(answer, 2, { distractorDistance: 2 });
  const options = shuffleArray([answer, ...distractors]);

  return { sequence: display, answer, options, gapIndex: picked.gap };
}

// Render a vertical math layout (traditional columnar format)
export function renderVerticalMath(a, op, b) {
  return renderVerticalProblem(a, op, b);
}

function renderVerticalProblem(a, op, b) {
  return `<div class="vertical-math">
    <div class="vmath-row vmath-top">${a}</div>
    <div class="vmath-row vmath-sign-row">${op}</div>
    <div class="vmath-row vmath-bottom">${b}</div>
    <div class="vmath-line"></div>
    <div class="vmath-row vmath-answer">?</div>
  </div>`;
}

// Generate a no-carry addition pair that sums to target
function makeNoCarryPair(target) {
  const isEasy = getDifficultyPref() === 'easy';
  for (let attempt = 0; attempt < 40; attempt++) {
    const a = randomInt(1, target - 1);
    const b = target - a;
    if (b < 1) continue;
    // Easy mode: ones digits must not carry
    if (isEasy && (a >= 10 || b >= 10)) {
      if ((a % 10) + (b % 10) > 10) continue;
    }
    return { a, b };
  }
  // Fallback: simple split
  const a = Math.floor(target / 2);
  return { a, b: target - a };
}

// Generate expression for Path Chooser
export function generatePathChooserProblem(targetAnswer, params) {
  // Correct path
  const { a: a1, b: b1 } = makeNoCarryPair(targetAnswer);
  const correctExpr = { display: `${a1} + ${b1}`, value: targetAnswer };

  // Wrong paths — nearby values but not equal
  const wrongExprs = [];
  const usedValues = new Set([targetAnswer]);
  for (let i = 0; i < 2; i++) {
    let val;
    do {
      val = randomInt(Math.max(3, targetAnswer - 8), targetAnswer + 8);
    } while (usedValues.has(val) || val < 2);
    usedValues.add(val);
    const { a: wa, b: wb } = makeNoCarryPair(val);
    wrongExprs.push({ display: `${wa} + ${wb}`, value: val });
  }

  const paths = shuffleArray([correctExpr, ...wrongExprs]);
  return { target: targetAnswer, paths, correctIndex: paths.indexOf(correctExpr) };
}
