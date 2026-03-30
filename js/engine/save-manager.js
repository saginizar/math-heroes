// save-manager.js — LocalStorage persistence

const SAVE_KEY = 'mathheroes_save';

function createDefaultState() {
  return {
    version: 2,
    player: {
      name: '',
      heroCharacter: null, // 'flash_hero', 'spider_hero', etc.
      questionCount: 'medium', // 'short' (3), 'medium' (6), 'long' (10)
      difficultyPref: 'easy', // 'easy', 'medium', 'hard'
      setupComplete: false,
    },
    hero: {
      level: 1,
      coins: 0,
      costumes: [],
      vehicles: ['scooter'],
      activeCostume: null,
      activeVehicle: 'scooter',
    },
    worlds: {
      speed_city: {
        unlocked: true,
        levels: Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          stars: 0,
          completed: false,
          bestAccuracy: 0,
        })),
      },
      web_tower: { unlocked: false, levels: [] },
      iron_lab: { unlocked: false, levels: [] },
      mushroom_quest: { unlocked: false, levels: [] },
      grand_circuit: { unlocked: false, levels: [] },
      dr_zero_lair: { unlocked: false, levels: [] },
    },
    difficulty: {
      addition: { level: 1, history: [] },
      subtraction: { level: 1, history: [] },
      multiplication: { level: 1, history: [] },
      patterns: { level: 1, history: [] },
      comparison: { level: 1, history: [] },
    },
    stats: {
      totalProblems: 0,
      totalCorrect: 0,
      sessionsPlayed: 0,
      lastPlayed: null,
      todayProblems: 0,
      todayDate: null,
    },
  };
}

let gameState = null;

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      gameState = JSON.parse(raw);
      // Version migration
      if (!gameState.version || gameState.version < 2) {
        if (!gameState.player) {
          gameState.player = { name: '', heroCharacter: null, questionCount: 'medium', difficultyPref: 'easy', setupComplete: false };
        }
        if (!gameState.stats.todayProblems) {
          gameState.stats.todayProblems = 0;
          gameState.stats.todayDate = null;
        }
        gameState.version = 2;
      }
      // Migrate XP to coins
      if (gameState.hero.xp !== undefined && gameState.hero.coins === undefined) {
        gameState.hero.coins = gameState.hero.xp;
        delete gameState.hero.xp;
      }
      // Migrate difficulty preference
      if (!gameState.player.difficultyPref) {
        gameState.player.difficultyPref = 'easy';
      }
    } else {
      gameState = createDefaultState();
    }
  } catch (e) {
    console.warn('Failed to load save, using defaults:', e);
    gameState = createDefaultState();
  }
  // Reset daily counter if new day
  const today = new Date().toISOString().slice(0, 10);
  if (gameState.stats.todayDate !== today) {
    gameState.stats.todayProblems = 0;
    gameState.stats.todayDate = today;
  }
  return gameState;
}

export function saveGame() {
  try {
    gameState.stats.lastPlayed = new Date().toISOString();
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
  } catch (e) {
    console.warn('Failed to save:', e);
  }
}

export function getState() {
  if (!gameState) loadGame();
  return gameState;
}

export function isSetupComplete() {
  const state = getState();
  return state.player.setupComplete;
}

export function setPlayerName(name) {
  gameState.player.name = name;
  saveGame();
}

export function setHeroCharacter(characterId) {
  gameState.player.heroCharacter = characterId;
  saveGame();
}

export function setQuestionCount(mode) {
  gameState.player.questionCount = mode;
  saveGame();
}

export function setDifficultyPref(pref) {
  gameState.player.difficultyPref = pref;
  // Reset adaptive difficulty levels when preference changes
  for (const op of Object.keys(gameState.difficulty)) {
    const base = pref === 'easy' ? 2 : pref === 'hard' ? 3 : 2;
    gameState.difficulty[op].level = base;
    gameState.difficulty[op].history = [];
  }
  saveGame();
}

export function getDifficultyPref() {
  return getState().player.difficultyPref || 'easy';
}

export function completeSetup() {
  gameState.player.setupComplete = true;
  saveGame();
}

export function getQuestionCountNumber() {
  const mode = getState().player.questionCount || 'medium';
  return mode === 'short' ? 3 : mode === 'long' ? 10 : 6;
}

export function updateLevel(worldId, levelIndex, stars, accuracy) {
  const world = gameState.worlds[worldId];
  if (!world || !world.levels[levelIndex]) return;
  const lvl = world.levels[levelIndex];
  lvl.completed = true;
  lvl.stars = Math.max(lvl.stars, stars);
  lvl.bestAccuracy = Math.max(lvl.bestAccuracy, accuracy);
  saveGame();
}

export function addCoins(amount) {
  gameState.hero.coins += amount;
  gameState.hero.level = Math.floor(gameState.hero.coins / 200) + 1;
  saveGame();
}

export function addCostume(costumeId) {
  if (!gameState.hero.costumes.includes(costumeId)) {
    gameState.hero.costumes.push(costumeId);
    saveGame();
  }
}

export function addVehicle(vehicleId) {
  if (!gameState.hero.vehicles.includes(vehicleId)) {
    gameState.hero.vehicles.push(vehicleId);
    saveGame();
  }
}

export function incrementStats(correct) {
  gameState.stats.totalProblems++;
  gameState.stats.todayProblems++;
  if (correct) gameState.stats.totalCorrect++;
}

export function getTodayProblems() {
  return getState().stats.todayProblems;
}

export function exportSave() {
  return JSON.stringify(gameState, null, 2);
}

export function importSave(json) {
  try {
    gameState = JSON.parse(json);
    saveGame();
    return true;
  } catch (e) {
    return false;
  }
}

export function resetGame() {
  gameState = createDefaultState();
  saveGame();
}
