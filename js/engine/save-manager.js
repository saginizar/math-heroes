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
      web_tower: { unlocked: false, levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, stars: 0, completed: false, bestAccuracy: 0 })) },
      iron_lab: { unlocked: false, levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, stars: 0, completed: false, bestAccuracy: 0 })) },
      mushroom_quest: { unlocked: false, levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, stars: 0, completed: false, bestAccuracy: 0 })) },
      grand_circuit: { unlocked: false, levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, stars: 0, completed: false, bestAccuracy: 0 })) },
      dr_zero_lair: { unlocked: false, levels: Array.from({ length: 6 }, (_, i) => ({ id: i + 1, stars: 0, completed: false, bestAccuracy: 0 })) },
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
    // Parent report data
    parentData: {
      sessions: [],       // { date, startTime, endTime, duration, problems, correct }
      opStats: {},        // per operation: { total, correct, totalTime }
      levelHistory: [],   // { date, world, level, type, operation, accuracy, stars, passed, duration }
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
      // Migrate parentData
      if (!gameState.parentData) {
        gameState.parentData = { sessions: [], opStats: {}, levelHistory: [] };
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
    const base = pref === 'easy' ? 2 : pref === 'medium' ? 3 : 5;
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
  if (!world) return;
  // Grow the levels array if needed (e.g. for newly added level 7)
  while (world.levels.length <= levelIndex) {
    world.levels.push({ id: world.levels.length + 1, stars: 0, completed: false, bestAccuracy: 0 });
  }
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

export function ensureWorldLevels(worldId, levelCount) {
  if (!gameState) loadGame();
  if (!gameState.worlds[worldId]) {
    gameState.worlds[worldId] = { unlocked: false, levels: [] };
  }
  const world = gameState.worlds[worldId];
  while (world.levels.length < levelCount) {
    world.levels.push({
      id: world.levels.length + 1,
      stars: 0,
      completed: false,
      bestAccuracy: 0,
    });
  }
}

export function resetGame() {
  gameState = createDefaultState();
  saveGame();
}

// ========== PARENT REPORT TRACKING ==========
let _sessionStart = null;
let _sessionProblems = 0;
let _sessionCorrect = 0;

export function startParentSession() {
  _sessionStart = Date.now();
  _sessionProblems = 0;
  _sessionCorrect = 0;
  const state = getState();
  state.stats.sessionsPlayed = (state.stats.sessionsPlayed || 0) + 1;
  saveGame();
}

export function trackProblem(operation, correct) {
  _sessionProblems++;
  if (correct) _sessionCorrect++;
  const state = getState();
  if (!state.parentData) state.parentData = { sessions: [], opStats: {}, levelHistory: [] };
  if (!state.parentData.opStats[operation]) {
    state.parentData.opStats[operation] = { total: 0, correct: 0 };
  }
  state.parentData.opStats[operation].total++;
  if (correct) state.parentData.opStats[operation].correct++;
}

export function trackLevelComplete(world, level, type, operation, accuracy, stars, passed, duration) {
  const state = getState();
  if (!state.parentData) state.parentData = { sessions: [], opStats: {}, levelHistory: [] };
  const israelTime = new Date().toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' });
  state.parentData.levelHistory.push({
    date: israelTime,
    world, level, type, operation, accuracy, stars, passed, duration: Math.round(duration / 1000),
  });
  // Keep last 200 entries
  if (state.parentData.levelHistory.length > 200) {
    state.parentData.levelHistory = state.parentData.levelHistory.slice(-200);
  }
  saveGame();
}

export function endParentSession() {
  if (!_sessionStart) return;
  const state = getState();
  if (!state.parentData) state.parentData = { sessions: [], opStats: {}, levelHistory: [] };
  const now = Date.now();
  const israelTime = new Date().toLocaleString('en-IL', { timeZone: 'Asia/Jerusalem' });
  const duration = Math.round((now - _sessionStart) / 1000);
  // Only record sessions longer than 10 seconds
  if (duration > 10) {
    state.parentData.sessions.push({
      date: israelTime,
      startTime: new Date(_sessionStart).toLocaleTimeString('en-IL', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit' }),
      endTime: new Date(now).toLocaleTimeString('en-IL', { timeZone: 'Asia/Jerusalem', hour: '2-digit', minute: '2-digit' }),
      duration,
      problems: _sessionProblems,
      correct: _sessionCorrect,
    });
    // Keep last 50 sessions
    if (state.parentData.sessions.length > 50) {
      state.parentData.sessions = state.parentData.sessions.slice(-50);
    }
  }
  saveGame();
  _sessionStart = null;
}

export function getParentData() {
  const state = getState();
  return state.parentData || { sessions: [], opStats: {}, levelHistory: [] };
}
