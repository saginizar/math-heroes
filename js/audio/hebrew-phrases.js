// hebrew-phrases.js — all Hebrew text constants

export const PHRASES = {
  // Splash
  splashTitle: 'גיבורי המספרים',
  splashStart: 'התחל!',
  splashSubtitle: 'הרפתקת מתמטיקה!',

  // Name Input
  enterName: 'מה השם שלך, גיבור?',
  namePrompt: 'הקלד את השם שלך',
  nameConfirm: 'אישור',
  greeting: 'היי {name}! בוא נציל את העולם!',

  // Character Selection
  chooseHero: 'בחר את הגיבור שלך!',

  // Settings
  settings: 'הגדרות',
  continue_setup: 'המשך',

  // Question Count
  questionCountLabel: 'כמה שאלות?',
  questionShort: 'קצר',
  questionMedium: 'בינוני',
  questionLong: 'ארוך',

  // Difficulty Selection
  difficultyLabel: 'רמת קושי',
  difficultyEasy: 'קל',
  difficultyMedium: 'בינוני',
  difficultyHard: 'קשה',

  // Coins (replaces XP)
  coins: 'מטבעות',
  coinGain: '+{amount} 🪙',

  // World Map
  worldMapTitle: 'מפת העולמות',
  worldLocked: 'נעול',

  // Level Select
  back: 'חזרה',
  level: 'שלב',

  // Missions (all worlds)
  missions: {
    '1-1': 'גיבור! הגיע הזמן לרוץ!',
    '1-2': 'שלושה שבילים. רק אחד נכון!',
    '1-3': 'תפוס רק מספרים גדולים מארבע!',
    '1-4': 'מצא שני מספרים שביחד עושים את המספר!',
    '1-5': 'מה המספר החסר? בנה את הגשר!',
    '1-6': 'ד"ר אפס כאן! שלוש משימות לשחרר את העיר!',
    '2-1': 'טפס על מגדל הקורים!',
    '2-2': 'התאם מספרים להפעיל את מגן הקורים!',
    '2-3': 'בחר את הדרך הנכונה דרך הרשתות!',
    '2-4': 'מצא את כל המספרים הגדולים משבע!',
    '2-5': 'בנה את גשר העכביש! מה המספר החסר?',
    '2-6': 'מלך הקורים מחכה! שלוש משימות לשחרר את המגדל!',
    '3-1': 'הניסוי הראשון במעבדה!',
    '3-2': 'בחר את הדרך הנכונה דרך המעבדה!',
    '3-3': 'הפעל את מגן הברזל!',
    '3-4': 'מצא את כל המספרים הגדולים מעשר!',
    '3-5': 'בנה את גשר המתכת! מצא את המספר החסר!',
    '3-6': 'הרובוט הופעל! שלוש משימות לכבות אותו!',
    '4-1': 'מסע הפטריות מתחיל!',
    '4-2': 'התאם מספרים להפעיל את מגן הפטריה!',
    '4-3': 'מצא את הדרך דרך היער!',
    '4-4': 'בנה את גשר הטבע! מה המספר החסר?',
    '4-5': 'מצא את כל המספרים הגדולים מחמש עשרה!',
    '4-6': 'מלך הפטריות קם! שלוש משימות להציל את היער!',
    '5-1': 'זינוק למסלול הגדול!',
    '5-2': 'בחר את המסלול הנכון!',
    '5-3': 'הטען את מגן המרוץ!',
    '5-4': 'מצא את כל המספרים הגדולים מעשרים!',
    '5-5': 'בנה את גשר המרוץ! מצא את המספר החסר!',
    '5-6': 'המרוץ האחרון! שלוש משימות להפוך לאלוף!',
    '6-1': 'כניסה למאורה של ד"ר אפס!',
    '6-2': 'פרוץ דרך המגן של ד"ר אפס!',
    '6-3': 'שלושה מסלולים. בחר בחוכמה!',
    '6-4': 'בנה את הגשר האחרון!',
    '6-5': 'מצא את המספרים המוסתרים בחושך!',
    '6-6': 'ד"ר אפס בעצמו! שלוש משימות אחרונות להציל את העולם!',
  },

  // Correct feedback — varied for rotation
  correct: [
    'נכון מאוד!',
    'כל הכבוד!',
    'מדהים!',
    'אתה גיבור אמיתי!',
    'נהדר!',
    'מושלם!',
    'יופי!',
    'בול!',
  ],

  // Wrong feedback — explanation template
  wrong: 'כמעט! נסה שוב',
  wrongExplanation: 'כמעט! זו לא התשובה הנכונה. התשובה הנכונה היא {answer}, כי {a} {op} {b} שווה {answer}.',
  wrongGeneric: 'כמעט! התשובה הנכונה היא {answer}.',

  // Hints
  hint: 'נסה לספור ביחד',
  hintReveal: 'הנה רמז!',
  hintAnswer: 'זה התשובה!',

  // Level complete
  levelComplete: 'המשימה הושלמה!',
  worldComplete: 'עולם שוחרר!',
  newItem: 'פריט חדש',

  // Retry (below 75%)
  retryMessage: 'בוא ננסה שוב!',
  retryNarration: 'כמעט הצלחנו! בוא ננסה עוד פעם, אני בטוח שתצליח!',
  almostThere: 'כמעט הצלחת! עוד קצת ותגיע!',

  // Streak
  streak2: 'שתיים ברצף!',
  streak3: 'שלוש ברצף! מדהים!',
  streak5: 'וואו! חמש ברצף! אתה גיבור על!',
  streak10: 'עשר ברצף! בלתי ניתן לעצירה!',

  // Session summary
  sessionSummary: 'היום פתרת {count} תרגילים!',
  sessionGreat: 'כל הכבוד!',

  // UI
  continue_: 'המשך',
  playAgain: 'עוד פעם',
  stars: 'כוכבים',
  heroLevel: 'רמה',
  correctCount: '{correct} מתוך {total}',
  speed: 'מהירות',
  slow: 'איטי',
  fast: 'מהיר',

  // Number Catcher
  caught: 'נתפסו',
  missed: 'פספוסים',
  catchRule: 'תפוס רק מספרים גדולים מ',

  // Shield Match
  findTwo: 'מצא שני מספרים שביחד עושים',

  // Path Chooser
  targetNumber: 'מספר מטרה',
  threePaths: 'שלושה שבילים. רק אחד נכון!',

  // Bridge Builder
  missingNumber: 'מה המספר החסר?',

  // Hero Rescue
  threeMissions: 'שלוש משימות!',
  phase: 'שלב',

  // Operations
  plus: 'ועוד',
  minus: 'פחות',
  times: 'כפול',
  equals: 'שווה',
  howMuch: 'כמה זה',
  biggerThan: 'גדול מ',

  // World names
  worldNames: {
    speed_city: 'עיר המהירות',
    web_tower: 'מגדל הקורים',
    iron_lab: 'מעבדת הברזל',
    mushroom_quest: 'משימת הפטריות',
    grand_circuit: 'המסלול הגדול',
    dr_zero_lair: 'המאורה של ד"ר אפס',
  },

  // Costume names
  costumeNames: {
    speed_boots: 'נעלי מהירות',
    speed_gloves: 'כפפות מהירות',
    speed_belt: 'חגורת מהירות',
    speed_mask: 'מסכת מהירות',
    speed_cape: 'גלימת מהירות',
    speed_crown: 'כתר מהירות',
    web_boots: 'נעלי רשת',
    web_gloves: 'כפפות רשת',
    web_belt: 'חגורת רשת',
    web_mask: 'מסכת רשת',
    web_cape: 'גלימת רשת',
    web_crown: 'כתר הקורים',
    iron_boots: 'נעלי ברזל',
    iron_gloves: 'כפפות ברזל',
    iron_belt: 'חגורת ברזל',
    iron_mask: 'מסכת ברזל',
    iron_cape: 'גלימת ברזל',
    iron_crown: 'כתר הברזל',
    mushroom_boots: 'נעלי פטריות',
    mushroom_gloves: 'כפפות פטריות',
    mushroom_belt: 'חגורת פטריות',
    mushroom_hat: 'כובע פטריה',
    mushroom_cape: 'גלימת פטריות',
    mushroom_crown: 'כתר הפטריות',
    race_boots: 'נעלי מרוץ',
    race_gloves: 'כפפות מרוץ',
    race_belt: 'חגורת מרוץ',
    race_helmet: 'קסדת מרוץ',
    race_suit: 'חליפת מרוץ',
    race_crown: 'כתר המרוץ',
    zero_boots: 'נעלי אפס',
    zero_gloves: 'כפפות אפס',
    zero_belt: 'חגורת אפס',
    zero_mask: 'מסכת אפס',
    zero_cape: 'גלימת אפס',
    zero_crown: 'כתר ד"ר אפס',
  },

  // Hero character names
  heroNames: {
    flash_hero: 'גיבור הברק',
    spider_hero: 'גיבור הרשת',
    iron_hero: 'גיבור הברזל',
    mario_hero: 'גיבור הפטריות',
    bat_hero: 'גיבור הלילה',
    racer_hero: 'גיבור המרוץ',
  },

  // Numbers (Hebrew words for TTS)
  numbers: {
    0: 'אפס', 1: 'אחת', 2: 'שתיים', 3: 'שלוש', 4: 'ארבע', 5: 'חמש',
    6: 'שש', 7: 'שבע', 8: 'שמונה', 9: 'תשע', 10: 'עשר',
    11: 'אחת עשרה', 12: 'שתים עשרה', 13: 'שלוש עשרה', 14: 'ארבע עשרה',
    15: 'חמש עשרה', 16: 'שש עשרה', 17: 'שבע עשרה', 18: 'שמונה עשרה',
    19: 'תשע עשרה', 20: 'עשרים',
    30: 'שלושים', 40: 'ארבעים', 50: 'חמישים',
    60: 'שישים', 70: 'שבעים', 80: 'שמונים', 90: 'תשעים', 100: 'מאה',
  },
};

// Build a spoken number string for any number 0-100
export function numberToHebrew(n) {
  if (n <= 20 || n === 30 || n === 40 || n === 50 || n === 60 || n === 70 || n === 80 || n === 90 || n === 100) {
    return PHRASES.numbers[n] || String(n);
  }
  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;
  if (ones === 0) return PHRASES.numbers[tens] || String(n);
  return `${PHRASES.numbers[tens] || tens} ו${PHRASES.numbers[ones] || ones}`;
}

// Build a spoken math problem
export function problemToHebrew(a, op, b) {
  const aH = numberToHebrew(a);
  const bH = numberToHebrew(b);
  const opH = op === '+' ? PHRASES.plus : op === '-' ? PHRASES.minus : PHRASES.times;
  return `כמה זה ${aH} ${opH} ${bH}?`;
}

// Build wrong answer explanation
export function wrongExplanationHebrew(a, op, b, answer) {
  const aH = numberToHebrew(a);
  const bH = numberToHebrew(b);
  const ansH = numberToHebrew(answer);
  const opH = op === '+' ? PHRASES.plus : op === '-' ? PHRASES.minus : PHRASES.times;
  return `כמעט! זו לא התשובה הנכונה. התשובה הנכונה היא ${ansH}, כי ${aH} ${opH} ${bH} שווה ${ansH}.`;
}

// Template replacer
export function fillTemplate(template, vars) {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(`{${key}}`, val);
  }
  return result;
}
