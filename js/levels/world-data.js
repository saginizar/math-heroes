// world-data.js — World and level configurations

export const WORLDS = {
  speed_city: {
    id: 'speed_city',
    nameHe: 'עיר המהירות',
    theme: 'speed',
    unlocked: true,
    colors: { primary: '#00D4FF', secondary: '#FFE100', bg: '#1A0A2E', accent: '#FF6B2B' },
    levels: [
      {
        id: 1,
        nameHe: 'הריצה הראשונה',
        type: 'PowerLaunch',
        difficulty: 1,
        operation: 'addition',
        problemCount: 3,
        reward: 'speed_boots',
        missionKey: '1-1',
      },
      {
        id: 2,
        nameHe: 'מלכודת מהירות',
        type: 'PathChooser',
        difficulty: 1,
        operation: 'addition',
        problemCount: 3,
        reward: 'speed_gloves',
        missionKey: '1-2',
      },
      {
        id: 3,
        nameHe: 'אוסף הכוכבים',
        type: 'StarCollector',
        difficulty: 1,
        operation: 'comparison',
        problemCount: 8,
        threshold: 4,
        reward: 'speed_belt',
        missionKey: '1-3',
      },
      {
        id: 4,
        nameHe: 'ריצה כפולה',
        type: 'ShieldMatch',
        difficulty: 2,
        operation: 'addition',
        problemCount: 3,
        reward: 'speed_mask',
        missionKey: '1-4',
      },
      {
        id: 5,
        nameHe: 'גשר הברקים',
        type: 'BridgeBuilder',
        difficulty: 1,
        operation: 'patterns',
        problemCount: 4,
        reward: 'speed_cape',
        missionKey: '1-5',
      },
      {
        id: 6,
        nameHe: 'העימות',
        type: 'HeroRescue',
        difficulty: 3,
        operation: 'addition',
        problemCount: 3,
        reward: 'speed_crown',
        bonusReward: 'vehicle_motorcycle',
        missionKey: '1-6',
        isWorldBoss: true,
      },
    ],
  },
  web_tower: {
    id: 'web_tower',
    nameHe: 'מגדל הקורים',
    theme: 'web',
    unlocked: false,
    colors: { primary: '#E23636', secondary: '#C0C0C0', bg: '#1B2838', accent: '#4488FF' },
    levels: [],
  },
  iron_lab: {
    id: 'iron_lab',
    nameHe: 'מעבדת הברזל',
    theme: 'tech',
    unlocked: false,
    colors: { primary: '#FFD700', secondary: '#B22222', bg: '#2A1A1A', accent: '#708090' },
    levels: [],
  },
  mushroom_quest: {
    id: 'mushroom_quest',
    nameHe: 'משימת הפטריות',
    theme: 'platformer',
    unlocked: false,
    colors: { primary: '#E52521', secondary: '#43B047', bg: '#6DB6FF', accent: '#FFD700' },
    levels: [],
  },
  grand_circuit: {
    id: 'grand_circuit',
    nameHe: 'המסלול הגדול',
    theme: 'racing',
    unlocked: false,
    colors: { primary: '#FF0000', secondary: '#FFFFFF', bg: '#1A3A1A', accent: '#228B22' },
    levels: [],
  },
  dr_zero_lair: {
    id: 'dr_zero_lair',
    nameHe: 'המאורה של ד"ר אפס',
    theme: 'boss',
    unlocked: false,
    colors: { primary: '#39FF14', secondary: '#2D1B69', bg: '#0A0A0A', accent: '#FF00FF' },
    levels: [],
  },
};

export const WORLD_ORDER = ['speed_city', 'web_tower', 'iron_lab', 'mushroom_quest', 'grand_circuit', 'dr_zero_lair'];

export function getWorld(worldId) {
  return WORLDS[worldId];
}

export function getLevelConfig(worldId, levelIndex) {
  const world = WORLDS[worldId];
  if (!world || !world.levels[levelIndex]) return null;
  return { ...world.levels[levelIndex], worldId, levelIndex, worldColors: world.colors };
}
