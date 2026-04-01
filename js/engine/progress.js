// progress.js — XP, stars, unlocks calculator

import { getState, addCoins, addCostume, addVehicle, updateLevel, saveGame } from './save-manager.js';
import { WORLD_ORDER } from '../levels/world-data.js';

export function calculateStars(totalProblems, firstTryCorrect) {
  if (totalProblems === 0) return 1;
  const accuracy = firstTryCorrect / totalProblems;
  if (accuracy >= 1.0) return 3; // All first-try
  if (accuracy >= 0.8) return 2; // Most first-try
  return 1; // Completed
}

export function calculateCoins(totalProblems, correctCount, stars) {
  let coins = 50; // Base completion coins
  coins += correctCount * 10; // Per correct answer
  if (stars === 3) coins += 30; // Bonus
  return coins;
}

export function completeLevelAndReward(worldId, levelIndex, totalProblems, firstTryCorrect, correctCount, reward) {
  const stars = calculateStars(totalProblems, firstTryCorrect);
  const coins = calculateCoins(totalProblems, correctCount, stars);
  const accuracy = totalProblems > 0 ? Math.round((correctCount / totalProblems) * 100) : 100;

  updateLevel(worldId, levelIndex, stars, accuracy);
  addCoins(coins);

  if (reward) {
    if (reward.startsWith('vehicle_')) {
      addVehicle(reward);
    } else {
      addCostume(reward);
    }
  }

  return { stars, coins, accuracy };
}

export function isLevelAvailable(worldId, levelIndex) {
  const state = getState();
  const world = state.worlds[worldId];
  if (!world || !world.unlocked) return false;
  if (levelIndex === 0) return true; // First level always available
  if (levelIndex === 6) return true;  // ColumnAdd (level 7) always available once world is unlocked
  // Previous level must be completed
  return world.levels[levelIndex - 1]?.completed === true;
}

export function getWorldProgress(worldId) {
  const state = getState();
  const world = state.worlds[worldId];
  if (!world) return { completed: 0, total: 0, stars: 0 };
  const completed = world.levels.filter(l => l.completed).length;
  const stars = world.levels.reduce((sum, l) => sum + l.stars, 0);
  return { completed, total: world.levels.length, stars };
}

// Check if world is fully completed and unlock next world if so
// Returns the newly unlocked world ID, or null
export function checkAndUnlockNextWorld(worldId) {
  const state = getState();
  const worldState = state.worlds[worldId];
  if (!worldState) return null;

  // Check if ALL levels in this world are completed
  const allDone = worldState.levels.every(l => l.completed);
  if (!allDone) return null;

  // Find next world in order
  const idx = WORLD_ORDER.indexOf(worldId);
  if (idx < 0 || idx >= WORLD_ORDER.length - 1) return null;
  const nextWorldId = WORLD_ORDER[idx + 1];
  const nextWorld = state.worlds[nextWorldId];

  // Already unlocked?
  if (nextWorld?.unlocked) return null;

  // Unlock it
  if (nextWorld) {
    nextWorld.unlocked = true;
  } else {
    // Initialize minimal world state
    state.worlds[nextWorldId] = { unlocked: true, levels: [] };
  }
  saveGame();
  return nextWorldId;
}

export function getHeroInfo() {
  const state = getState();
  const coins = state.hero.coins || 0;
  return {
    level: state.hero.level,
    coins,
    coinsToNext: 200 - (coins % 200),
    coinsProgress: (coins % 200) / 200,
    costumes: state.hero.costumes,
    vehicles: state.hero.vehicles,
  };
}
