// game-engine.js — Core game state machine

import { recordAnswer } from './difficulty.js';
import { incrementStats, trackProblem } from './save-manager.js';

export const GameState = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  CHECKING: 'CHECKING',
  ANIMATING: 'ANIMATING',
  COMPLETE: 'COMPLETE',
};

export function createGameSession(levelConfig) {
  return {
    state: GameState.IDLE,
    levelConfig,
    currentProblemIndex: 0,
    totalProblems: levelConfig.problemCount || 6,
    correctCount: 0,
    firstTryCorrect: 0,
    attemptsOnCurrent: 0,
    hintLevel: 0,
    streak: 0,
    bestStreak: 0,
    problems: [],
    results: [],
  };
}

export function startSession(session) {
  session.state = GameState.PLAYING;
  session.currentProblemIndex = 0;
  return session;
}

export function checkAnswer(session, answer, correctAnswer, operation) {
  session.state = GameState.CHECKING;
  const correct = answer === correctAnswer;

  if (correct) {
    if (session.attemptsOnCurrent === 0) {
      session.firstTryCorrect++;
    }
    session.correctCount++;
    session.streak++;
    if (session.streak > session.bestStreak) {
      session.bestStreak = session.streak;
    }
    session.results.push({ correct: true, attempts: session.attemptsOnCurrent + 1 });
    session.attemptsOnCurrent = 0;
    session.hintLevel = 0;

    recordAnswer(operation, true);
    incrementStats(true);
    trackProblem(operation, true);
  } else {
    session.attemptsOnCurrent++;
    session.streak = 0;

    // Update hint level
    if (session.attemptsOnCurrent >= 4) {
      session.hintLevel = 3;
    } else if (session.attemptsOnCurrent >= 3) {
      session.hintLevel = 2;
    } else if (session.attemptsOnCurrent >= 2) {
      session.hintLevel = 1;
    }

    recordAnswer(operation, false);
    incrementStats(false);
    trackProblem(operation, false);

    // CRITICAL: Reset state back to PLAYING so user can interact again
    session.state = GameState.PLAYING;
  }

  return correct;
}

export function advanceProblem(session) {
  session.currentProblemIndex++;
  session.attemptsOnCurrent = 0;
  session.hintLevel = 0;

  if (session.currentProblemIndex >= session.totalProblems) {
    session.state = GameState.COMPLETE;
    return false;
  }

  session.state = GameState.PLAYING;
  return true;
}

export function setAnimating(session) {
  session.state = GameState.ANIMATING;
}

export function setPlaying(session) {
  session.state = GameState.PLAYING;
}

export function isComplete(session) {
  return session.state === GameState.COMPLETE;
}

// Check if the level passes the 75% threshold (based on first-try correct)
export function checkPassThreshold(session) {
  if (session.totalProblems === 0) return true;
  const accuracy = session.firstTryCorrect / session.totalProblems;
  return accuracy >= 0.75;
}

export function getAccuracyPercent(session) {
  if (session.totalProblems === 0) return 100;
  return Math.round((session.firstTryCorrect / session.totalProblems) * 100);
}
