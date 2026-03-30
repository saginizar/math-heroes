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

function makeDivision(params) {
  // Generate as c × b = a, then show a ÷ b = c
  const maxFactor = Math.min(Math.floor(params.max / 2), 10);
  const c = randomInt(1, Math.min(maxFactor, 8)); // answer (quotient)
  const b = randomInt(1, Math.min(maxFactor, 5)); // divisor
  const a = b * c; // dividend
  return { a, b, op: '÷', answer: c, hebrewText: problemToHebrew(a, '÷', b) };
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
  const result = arr.slice(0, count);

  // Guarantee we return exactly `count` distractors
  while (result.length < count) {
    const fallback = answer + result.length + 1;
    if (fallback !== answer && !result.includes(fallback)) {
      result.push(fallback);
    }
  }
  return result;
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
      case 'division':
        question = makeDivision(params);
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

// Generate a comparison question for StarCollector — unique values
export function generateComparisonSet(threshold, count, params) {
  const used = new Set();
  const numbers = [];
  const matching = Math.floor(count * 0.5); // half should match

  // Matching numbers: strictly greater than threshold
  const matchMax = Math.max(threshold + 1, params.max, threshold + 8);
  let attempts = 0;
  while (numbers.filter(n => n.matches).length < matching && attempts < 200) {
    const v = randomInt(threshold + 1, matchMax);
    if (!used.has(v)) { used.add(v); numbers.push({ value: v, matches: true }); }
    attempts++;
  }

  // Non-matching numbers: 1 to threshold (exclusive of already used)
  attempts = 0;
  while (numbers.filter(n => !n.matches).length < (count - matching) && attempts < 200) {
    const v = randomInt(Math.max(1, params.min), threshold);
    if (!used.has(v)) { used.add(v); numbers.push({ value: v, matches: false }); }
    attempts++;
  }

  return shuffleArray(numbers);
}

// Generate number bond pairs for Shield Match
export function generateNumberBonds(target, orbCount) {
  const orbs = [];
  const pairs = [];

  // Try to generate up to 3 valid pairs
  let attempts = 0;
  while (pairs.length < Math.min(3, Math.floor(orbCount / 2)) && attempts < 30) {
    const a = randomInt(1, target - 1);
    const b = target - a;
    attempts++;
    if (a === b) {
      // Allow duplicate-value pair (e.g., 4+4=8) — need two separate orbs
      if (orbs.filter(v => v === a).length < 2) {
        orbs.push(a, b);
        pairs.push([a, b]);
      }
    } else if (!orbs.includes(a) && !orbs.includes(b)) {
      orbs.push(a, b);
      pairs.push([a, b]);
    }
  }

  // GUARANTEE at least one valid pair
  if (pairs.length === 0) {
    const a = Math.max(1, Math.floor(target / 2) - 1);
    const b = target - a;
    orbs.push(a, b);
    pairs.push([a, b]);
  }

  // Fill remaining orbs with non-pairing numbers
  let fillAttempts = 0;
  while (orbs.length < orbCount && fillAttempts < 100) {
    const n = randomInt(1, target + 3);
    fillAttempts++;
    const complement = target - n;
    // Allow if its complement isn't already present (prevents accidental extra pairs)
    if (!orbs.includes(complement)) {
      orbs.push(n);
    }
  }
  // Fallback: fill with numbers well above target (can't form pairs)
  while (orbs.length < orbCount) {
    orbs.push(target + orbs.length + 1);
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

// Generate expression for Path Chooser (supports all 4 operations)
export function generatePathChooserProblem(targetAnswer, params, operation = 'addition') {
  let correctExpr, wrongExprs = [];
  const usedValues = new Set([targetAnswer]);

  if (operation === 'subtraction') {
    // a - b = target
    const makeSubExpr = (val) => {
      const b = randomInt(1, Math.min(val, params.max || 10));
      return { display: `${val + b} - ${b}`, value: val };
    };
    correctExpr = makeSubExpr(targetAnswer);
    for (let i = 0; i < 2; i++) {
      let val;
      let tries = 0;
      do { val = randomInt(Math.max(1, targetAnswer - 5), targetAnswer + 5); tries++; }
      while (usedValues.has(val) && tries < 20);
      if (usedValues.has(val)) val = targetAnswer + i + 2; // Guaranteed unique fallback
      usedValues.add(val);
      wrongExprs.push(makeSubExpr(val));
    }

  } else if (operation === 'multiplication') {
    // Pick target as a product: a × b
    const makeMultExpr = (val) => {
      const factors = [];
      for (let i = 2; i <= Math.min(val, 10); i++) {
        if (val % i === 0 && val / i >= 2 && val / i <= 10) factors.push(i);
      }
      const b = factors.length ? factors[randomInt(0, factors.length - 1)] : 1;
      return { display: `${val / b} × ${b}`, value: val };
    };
    // Build a proper product target
    const a = randomInt(2, 5), b = randomInt(2, 5);
    const multTarget = a * b;
    usedValues.add(multTarget); // Track the actual correct product
    correctExpr = makeMultExpr(multTarget);
    for (let i = 0; i < 2; i++) {
      let fa, fb, val;
      let tries = 0;
      do { fa = randomInt(2, 5); fb = randomInt(2, 5); val = fa * fb; tries++; }
      while (usedValues.has(val) && tries < 20);
      if (usedValues.has(val)) continue; // Skip if couldn't find unique value
      usedValues.add(val);
      wrongExprs.push(makeMultExpr(val));
    }
    // Ensure we have exactly 2 wrong expressions
    while (wrongExprs.length < 2) {
      let fb = multTarget + wrongExprs.length + 1;
      while (usedValues.has(fb)) fb++;
      usedValues.add(fb);
      wrongExprs.push({ display: `${fb} × 1`, value: fb });
    }
    const paths = shuffleArray([correctExpr, ...wrongExprs]);
    return { target: multTarget, paths, correctIndex: paths.indexOf(correctExpr) };

  } else if (operation === 'division') {
    // a ÷ b = target (quotient)
    const makeDivExpr = (val) => {
      const b = randomInt(2, 5);
      return { display: `${val * b} ÷ ${b}`, value: val };
    };
    correctExpr = makeDivExpr(targetAnswer);
    for (let i = 0; i < 2; i++) {
      let val;
      let tries = 0;
      do { val = randomInt(1, 10); tries++; }
      while (usedValues.has(val) && tries < 20);
      if (usedValues.has(val)) val = targetAnswer + i + 2; // Guaranteed unique fallback
      usedValues.add(val);
      wrongExprs.push(makeDivExpr(val));
    }

  } else {
    // Addition (default)
    const { a: a1, b: b1 } = makeNoCarryPair(targetAnswer);
    correctExpr = { display: `${a1} + ${b1}`, value: targetAnswer };
    for (let i = 0; i < 2; i++) {
      let val;
      let tries = 0;
      do { val = randomInt(Math.max(3, targetAnswer - 8), targetAnswer + 8); tries++; }
      while ((usedValues.has(val) || val < 2) && tries < 20);
      if (usedValues.has(val)) val = targetAnswer + i + 2; // Guaranteed unique fallback
      usedValues.add(val);
      const { a: wa, b: wb } = makeNoCarryPair(val);
      wrongExprs.push({ display: `${wa} + ${wb}`, value: val });
    }
  }

  const paths = shuffleArray([correctExpr, ...wrongExprs]);
  return { target: targetAnswer, paths, correctIndex: paths.indexOf(correctExpr) };
}
