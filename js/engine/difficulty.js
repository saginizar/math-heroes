// difficulty.js — Adaptive difficulty tracker

import { clamp } from '../utils/helpers.js';
import { getState, saveGame } from './save-manager.js';

const DIFFICULTY_PARAMS = {
  1: { min: 1, max: 5,   visualAids: true,  distractorDistance: 3 },
  2: { min: 1, max: 10,  visualAids: true,  distractorDistance: 2 },
  3: { min: 2, max: 15,  visualAids: true,  distractorDistance: 2 },
  4: { min: 5, max: 25,  visualAids: false, distractorDistance: 1 },
  5: { min: 5, max: 50,  visualAids: false, distractorDistance: 1 },
  6: { min: 10, max: 100, visualAids: false, distractorDistance: 1 },
};

export function getDifficultyParams(operation) {
  const state = getState();
  const diff = state.difficulty[operation] || { level: 1 };
  const pref = state.player?.difficultyPref || 'easy';
  const prefFloor = pref === 'hard' ? 4 : pref === 'medium' ? 3 : 1;
  const level = clamp(Math.max(diff.level, prefFloor), 1, 6);
  return { level, ...DIFFICULTY_PARAMS[level] };
}

export function recordAnswer(operation, correct) {
  const state = getState();
  if (!state.difficulty[operation]) {
    state.difficulty[operation] = { level: 1, history: [] };
  }
  const diff = state.difficulty[operation];
  diff.history.push(correct ? 1 : 0);

  // Keep only last 10
  if (diff.history.length > 10) {
    diff.history = diff.history.slice(-10);
  }

  // Check escalation/de-escalation
  const recent5 = diff.history.slice(-5);
  const recent3 = diff.history.slice(-3);

  const acc5 = recent5.length >= 5 ? recent5.reduce((a, b) => a + b, 0) / 5 : null;
  const acc3 = recent3.length >= 3 ? recent3.reduce((a, b) => a + b, 0) / 3 : null;

  if (acc3 !== null && acc3 >= 0.95) {
    // Fast track: +2 levels
    diff.level = clamp(diff.level + 2, 1, 6);
  } else if (acc5 !== null && acc5 >= 0.9) {
    // Normal escalation: +1 level
    diff.level = clamp(diff.level + 1, 1, 6);
  } else if (acc3 !== null && acc3 < 0.5) {
    // De-escalation: -1 level
    diff.level = clamp(diff.level - 1, 1, 6);
  }

  saveGame();
}

export function getDifficultyLevel(operation) {
  const state = getState();
  return (state.difficulty[operation] || { level: 1 }).level;
}
