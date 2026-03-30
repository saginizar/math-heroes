// world-data.js — World and level configurations

export const WORLDS = {
  speed_city: {
    id: 'speed_city',
    nameHe: 'עיר המהירות',
    nameEn: 'Speed City',
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
    nameEn: 'Web Tower',
    theme: 'web',
    unlocked: false,
    colors: { primary: '#E23636', secondary: '#C0C0C0', bg: '#1B2838', accent: '#4488FF' },
    levels: [
      { id: 1, nameHe: 'טיפוס ראשון', type: 'PowerLaunch', difficulty: 2, operation: 'addition', problemCount: 3, reward: 'web_boots', missionKey: '2-1' },
      { id: 2, nameHe: 'מגן הקורים', type: 'ShieldMatch', difficulty: 2, operation: 'addition', problemCount: 3, reward: 'web_gloves', missionKey: '2-2' },
      { id: 3, nameHe: 'שלושה מסלולים', type: 'PathChooser', difficulty: 2, operation: 'addition', problemCount: 3, reward: 'web_belt', missionKey: '2-3' },
      { id: 4, nameHe: 'ציד ברשת', type: 'StarCollector', difficulty: 2, operation: 'comparison', problemCount: 8, threshold: 7, reward: 'web_mask', missionKey: '2-4' },
      { id: 5, nameHe: 'גשר העכביש', type: 'BridgeBuilder', difficulty: 2, operation: 'patterns', problemCount: 4, reward: 'web_cape', missionKey: '2-5' },
      { id: 6, nameHe: 'מלך הקורים', type: 'HeroRescue', difficulty: 3, operation: 'addition', problemCount: 3, reward: 'web_crown', bonusReward: 'vehicle_web_swing', missionKey: '2-6', isWorldBoss: true },
    ],
  },
  iron_lab: {
    id: 'iron_lab',
    nameHe: 'מעבדת הברזל',
    nameEn: 'Iron Lab',
    theme: 'tech',
    unlocked: false,
    colors: { primary: '#FFD700', secondary: '#B22222', bg: '#2A1A1A', accent: '#708090' },
    levels: [
      { id: 1, nameHe: 'ניסוי ראשון', type: 'PowerLaunch', difficulty: 2, operation: 'subtraction', problemCount: 3, reward: 'iron_boots', missionKey: '3-1' },
      { id: 2, nameHe: 'שלושת הנתיבים', type: 'PathChooser', difficulty: 3, operation: 'addition', problemCount: 3, reward: 'iron_gloves', missionKey: '3-2' },
      { id: 3, nameHe: 'הגנת ברזל', type: 'ShieldMatch', difficulty: 3, operation: 'addition', problemCount: 3, reward: 'iron_belt', missionKey: '3-3' },
      { id: 4, nameHe: 'מציאת החלקים', type: 'StarCollector', difficulty: 2, operation: 'comparison', problemCount: 8, threshold: 10, reward: 'iron_mask', missionKey: '3-4' },
      { id: 5, nameHe: 'גשר המתכת', type: 'BridgeBuilder', difficulty: 2, operation: 'patterns', problemCount: 4, reward: 'iron_cape', missionKey: '3-5' },
      { id: 6, nameHe: 'רובוט הברזל', type: 'HeroRescue', difficulty: 4, operation: 'addition', problemCount: 3, reward: 'iron_crown', bonusReward: 'vehicle_jet', missionKey: '3-6', isWorldBoss: true },
    ],
  },
  mushroom_quest: {
    id: 'mushroom_quest',
    nameHe: 'משימת הפטריות',
    nameEn: 'Mushroom Quest',
    theme: 'platformer',
    unlocked: false,
    colors: { primary: '#E52521', secondary: '#43B047', bg: '#6DB6FF', accent: '#FFD700' },
    levels: [
      { id: 1, nameHe: 'מסע הפטריות', type: 'PowerLaunch', difficulty: 3, operation: 'addition', problemCount: 3, reward: 'mushroom_boots', missionKey: '4-1' },
      { id: 2, nameHe: 'מגן הפטריה', type: 'ShieldMatch', difficulty: 3, operation: 'addition', problemCount: 3, reward: 'mushroom_gloves', missionKey: '4-2' },
      { id: 3, nameHe: 'דרך ביער', type: 'PathChooser', difficulty: 3, operation: 'addition', problemCount: 3, reward: 'mushroom_belt', missionKey: '4-3' },
      { id: 4, nameHe: 'גשר הטבע', type: 'BridgeBuilder', difficulty: 3, operation: 'patterns', problemCount: 4, reward: 'mushroom_hat', missionKey: '4-4' },
      { id: 5, nameHe: 'ציד הפטריות', type: 'StarCollector', difficulty: 3, operation: 'comparison', problemCount: 8, threshold: 15, reward: 'mushroom_cape', missionKey: '4-5' },
      { id: 6, nameHe: 'מלך הפטריות', type: 'HeroRescue', difficulty: 4, operation: 'addition', problemCount: 3, reward: 'mushroom_crown', bonusReward: 'vehicle_mushroom_car', missionKey: '4-6', isWorldBoss: true },
    ],
  },
  grand_circuit: {
    id: 'grand_circuit',
    nameHe: 'המסלול הגדול',
    nameEn: 'Grand Circuit',
    theme: 'racing',
    unlocked: false,
    colors: { primary: '#FF0000', secondary: '#FFFFFF', bg: '#1A3A1A', accent: '#228B22' },
    levels: [
      { id: 1, nameHe: 'זינוק במסלול', type: 'PowerLaunch', difficulty: 4, operation: 'addition', problemCount: 3, reward: 'race_boots', missionKey: '5-1' },
      { id: 2, nameHe: 'מסלול הבחירה', type: 'PathChooser', difficulty: 3, operation: 'addition', problemCount: 3, reward: 'race_gloves', missionKey: '5-2' },
      { id: 3, nameHe: 'מגן המרוץ', type: 'ShieldMatch', difficulty: 4, operation: 'addition', problemCount: 3, reward: 'race_belt', missionKey: '5-3' },
      { id: 4, nameHe: 'ציד במסלול', type: 'StarCollector', difficulty: 3, operation: 'comparison', problemCount: 8, threshold: 20, reward: 'race_helmet', missionKey: '5-4' },
      { id: 5, nameHe: 'גשר המרוץ', type: 'BridgeBuilder', difficulty: 3, operation: 'patterns', problemCount: 4, reward: 'race_suit', missionKey: '5-5' },
      { id: 6, nameHe: 'אלוף המסלול', type: 'HeroRescue', difficulty: 5, operation: 'addition', problemCount: 3, reward: 'race_crown', bonusReward: 'vehicle_race_car', missionKey: '5-6', isWorldBoss: true },
    ],
  },
  dr_zero_lair: {
    id: 'dr_zero_lair',
    nameHe: 'המאורה של ד"ר אפס',
    nameEn: 'Dr. Zero\'s Lair',
    theme: 'boss',
    unlocked: false,
    colors: { primary: '#39FF14', secondary: '#2D1B69', bg: '#0A0A0A', accent: '#FF00FF' },
    levels: [
      { id: 1, nameHe: 'כניסה למאורה', type: 'PowerLaunch', difficulty: 5, operation: 'addition', problemCount: 3, reward: 'zero_boots', missionKey: '6-1' },
      { id: 2, nameHe: 'מגן האפס', type: 'ShieldMatch', difficulty: 5, operation: 'addition', problemCount: 3, reward: 'zero_gloves', missionKey: '6-2' },
      { id: 3, nameHe: 'שלושה מבחנים', type: 'PathChooser', difficulty: 4, operation: 'addition', problemCount: 3, reward: 'zero_belt', missionKey: '6-3' },
      { id: 4, nameHe: 'גשר הסוף', type: 'BridgeBuilder', difficulty: 3, operation: 'patterns', problemCount: 4, reward: 'zero_mask', missionKey: '6-4' },
      { id: 5, nameHe: 'ציד החושך', type: 'StarCollector', difficulty: 4, operation: 'comparison', problemCount: 8, threshold: 25, reward: 'zero_cape', missionKey: '6-5' },
      { id: 6, nameHe: 'ד"ר אפס', type: 'HeroRescue', difficulty: 6, operation: 'addition', problemCount: 3, reward: 'zero_crown', bonusReward: 'vehicle_zero_ship', missionKey: '6-6', isWorldBoss: true },
    ],
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
