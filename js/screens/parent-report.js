// parent-report.js — Parent report screen (hidden, accessed via triple-tap mute)

import { getState, getParentData } from '../engine/save-manager.js';
import { WORLDS, WORLD_ORDER } from '../levels/world-data.js';

const OP_LABELS = {
  addition: 'Addition (+)',
  subtraction: 'Subtraction (-)',
  multiplication: 'Multiplication (x)',
  division: 'Division (÷)',
  comparison: 'Comparison (>)',
  patterns: 'Patterns / Sequences',
  mixed: 'Mixed Operations',
};

function israelNow() {
  return new Date().toLocaleString('en-GB', {
    timeZone: 'Asia/Jerusalem',
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function accuracyBar(pct) {
  const filled = Math.round(pct / 5);
  const empty = 20 - filled;
  const color = pct >= 80 ? '#22CC55' : pct >= 60 ? '#FFD700' : '#FF4466';
  return `<span style="color:${color}">${'█'.repeat(filled)}</span><span style="color:rgba(255,255,255,0.15)">${'░'.repeat(empty)}</span> ${pct}%`;
}

export function generateParentReport() {
  const state = getState();
  const pd = getParentData();
  const player = state.player;
  const stats = state.stats;
  const difficulty = state.difficulty;

  // === OVERVIEW ===
  const totalSessions = pd.sessions.length;
  const totalTimeSec = pd.sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalProblems = stats.totalProblems || 0;
  const totalCorrect = stats.totalCorrect || 0;
  const overallAccuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;

  // === TODAY ===
  const todayStr = new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Jerusalem' });
  const todaySessions = pd.sessions.filter(s => s.date && s.date.includes(todayStr));
  const todayTimeSec = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const todayProblems = stats.todayProblems || 0;
  const todayLevels = pd.levelHistory.filter(l => l.date && l.date.includes(todayStr));

  // === PER-OPERATION PERFORMANCE ===
  const opEntries = Object.entries(pd.opStats || {})
    .filter(([op]) => op !== 'comparison' && op !== 'patterns') // Focus on math ops
    .map(([op, data]) => ({
      op,
      label: OP_LABELS[op] || op,
      total: data.total,
      correct: data.correct,
      accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      diffLevel: difficulty[op]?.level || 1,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  // Strengths (accuracy >= 75%) and weaknesses (< 75%)
  const strengths = opEntries.filter(e => e.accuracy >= 75 && e.total >= 3);
  const weaknesses = opEntries.filter(e => e.accuracy < 75 && e.total >= 3);
  const tooFewData = opEntries.filter(e => e.total < 3);

  // === WORLD PROGRESS ===
  const worldProgress = WORLD_ORDER.map(wId => {
    const w = WORLDS[wId];
    const ws = state.worlds[wId];
    if (!ws) return null;
    const completed = ws.levels.filter(l => l.completed).length;
    const totalStars = ws.levels.reduce((s, l) => s + l.stars, 0);
    const maxStars = ws.levels.length * 3;
    const avgAccuracy = ws.levels.filter(l => l.completed).length > 0
      ? Math.round(ws.levels.filter(l => l.completed).reduce((s, l) => s + l.bestAccuracy, 0) / ws.levels.filter(l => l.completed).length)
      : 0;
    return {
      id: wId,
      name: w.nameEn,
      unlocked: ws.unlocked,
      completed,
      total: ws.levels.length,
      stars: totalStars,
      maxStars,
      avgAccuracy,
      operation: w.levels[0]?.operation || '?',
    };
  }).filter(Boolean);

  // === RECENT SESSIONS ===
  const recentSessions = pd.sessions.slice(-10).reverse();

  // === RECENT LEVEL ATTEMPTS ===
  const recentLevels = pd.levelHistory.slice(-15).reverse();

  // === LEVEL TYPES PERFORMANCE ===
  const typeStats = {};
  for (const l of pd.levelHistory) {
    if (!typeStats[l.type]) typeStats[l.type] = { total: 0, passed: 0, totalAcc: 0 };
    typeStats[l.type].total++;
    if (l.passed) typeStats[l.type].passed++;
    typeStats[l.type].totalAcc += l.accuracy;
  }

  // === BUILD HTML ===
  let html = `<div class="parent-report">`;

  // Header
  html += `
    <div class="pr-header">
      <h2>Parent Report: ${player.name || 'Player'}</h2>
      <div class="pr-time">${israelNow()}</div>
      <div class="pr-settings">Difficulty: <b>${player.difficultyPref || 'easy'}</b> | Questions: <b>${player.questionCount || 'medium'}</b></div>
    </div>`;

  // Overview cards
  html += `
    <div class="pr-section">
      <h3>Overview</h3>
      <div class="pr-cards">
        <div class="pr-card">
          <div class="pr-card-value">${totalSessions}</div>
          <div class="pr-card-label">Sessions</div>
        </div>
        <div class="pr-card">
          <div class="pr-card-value">${formatDuration(totalTimeSec)}</div>
          <div class="pr-card-label">Total Time</div>
        </div>
        <div class="pr-card">
          <div class="pr-card-value">${totalProblems}</div>
          <div class="pr-card-label">Problems</div>
        </div>
        <div class="pr-card">
          <div class="pr-card-value">${overallAccuracy}%</div>
          <div class="pr-card-label">Accuracy</div>
        </div>
      </div>
    </div>`;

  // Today
  html += `
    <div class="pr-section">
      <h3>Today (${todayStr})</h3>
      <div class="pr-cards">
        <div class="pr-card">
          <div class="pr-card-value">${todaySessions.length}</div>
          <div class="pr-card-label">Sessions</div>
        </div>
        <div class="pr-card">
          <div class="pr-card-value">${formatDuration(todayTimeSec)}</div>
          <div class="pr-card-label">Time</div>
        </div>
        <div class="pr-card">
          <div class="pr-card-value">${todayProblems}</div>
          <div class="pr-card-label">Problems</div>
        </div>
        <div class="pr-card">
          <div class="pr-card-value">${todayLevels.length}</div>
          <div class="pr-card-label">Levels</div>
        </div>
      </div>
      ${todaySessions.length > 0 ? `<div class="pr-detail">Active: ${todaySessions.map(s => `${s.startTime}–${s.endTime}`).join(', ')}</div>` : '<div class="pr-detail">No activity today yet.</div>'}
    </div>`;

  // Strengths
  html += `<div class="pr-section"><h3>Strengths</h3>`;
  if (strengths.length > 0) {
    html += strengths.map(e => `
      <div class="pr-op-row pr-strength">
        <span class="pr-op-name">${e.label}</span>
        <span class="pr-op-bar">${accuracyBar(e.accuracy)}</span>
        <span class="pr-op-detail">${e.correct}/${e.total} correct | Level ${e.diffLevel}</span>
      </div>`).join('');
  } else {
    html += `<div class="pr-detail">Not enough data yet. Keep playing!</div>`;
  }
  html += `</div>`;

  // Weaknesses
  html += `<div class="pr-section"><h3>Needs Practice</h3>`;
  if (weaknesses.length > 0) {
    html += weaknesses.map(e => `
      <div class="pr-op-row pr-weakness">
        <span class="pr-op-name">${e.label}</span>
        <span class="pr-op-bar">${accuracyBar(e.accuracy)}</span>
        <span class="pr-op-detail">${e.correct}/${e.total} correct | Level ${e.diffLevel}</span>
      </div>`).join('');
  } else {
    html += `<div class="pr-detail">No weak areas detected. Great job!</div>`;
  }
  if (tooFewData.length > 0) {
    html += `<div class="pr-detail" style="margin-top:8px;opacity:0.6;">Not enough data for: ${tooFewData.map(e => e.label).join(', ')}</div>`;
  }
  html += `</div>`;

  // World progress
  html += `<div class="pr-section"><h3>World Progress</h3>`;
  html += worldProgress.map(w => {
    const pct = Math.round((w.completed / w.total) * 100);
    const status = !w.unlocked ? 'Locked' : w.completed === w.total ? 'Complete!' : `${w.completed}/${w.total}`;
    return `
      <div class="pr-world-row ${!w.unlocked ? 'pr-locked' : ''}">
        <span class="pr-world-name">${w.name}</span>
        <span class="pr-world-op">${OP_LABELS[w.operation] || w.operation}</span>
        <span class="pr-world-progress">${status} | ${'★'.repeat(w.stars)}${'☆'.repeat(w.maxStars - w.stars)} | Avg ${w.avgAccuracy}%</span>
      </div>`;
  }).join('');
  html += `</div>`;

  // Level type performance
  if (Object.keys(typeStats).length > 0) {
    html += `<div class="pr-section"><h3>Game Type Performance</h3>`;
    const typeLabels = {
      PowerLaunch: 'Power Launch (solve & run)',
      PathChooser: 'Path Chooser (pick expression)',
      ShieldMatch: 'Shield Match (number bonds)',
      BridgeBuilder: 'Bridge Builder (sequences)',
      HeroRescue: 'Hero Rescue (boss battle)',
      StarCollector: 'Star Collector (comparison)',
      NumberCatcher: 'Number Catcher (catch numbers)',
    };
    html += Object.entries(typeStats).map(([type, data]) => {
      const passRate = Math.round((data.passed / data.total) * 100);
      const avgAcc = Math.round(data.totalAcc / data.total);
      return `
        <div class="pr-op-row">
          <span class="pr-op-name">${typeLabels[type] || type}</span>
          <span class="pr-op-bar">${accuracyBar(avgAcc)}</span>
          <span class="pr-op-detail">Passed ${data.passed}/${data.total} (${passRate}%)</span>
        </div>`;
    }).join('');
    html += `</div>`;
  }

  // Adaptive difficulty levels
  html += `<div class="pr-section"><h3>Current Difficulty Levels</h3>`;
  html += `<div class="pr-detail">The system adapts difficulty automatically based on performance (1=easiest, 6=hardest).</div>`;
  const diffOps = ['addition', 'subtraction', 'multiplication', 'division', 'comparison', 'patterns'];
  html += diffOps.map(op => {
    const d = difficulty[op] || { level: 1, history: [] };
    const recentAcc = d.history.length > 0 ? Math.round((d.history.reduce((a, b) => a + b, 0) / d.history.length) * 100) : 0;
    const bar = '▓'.repeat(d.level) + '░'.repeat(6 - d.level);
    return `<div class="pr-diff-row"><span>${OP_LABELS[op] || op}</span><span class="pr-diff-bar">${bar}</span><span>Lv ${d.level}</span><span style="opacity:0.6">(recent ${recentAcc}%)</span></div>`;
  }).join('');
  html += `</div>`;

  // Recent sessions
  if (recentSessions.length > 0) {
    html += `<div class="pr-section"><h3>Recent Sessions</h3>`;
    html += `<table class="pr-table"><tr><th>Date</th><th>Time</th><th>Duration</th><th>Problems</th><th>Correct</th></tr>`;
    html += recentSessions.map(s => {
      const acc = s.problems > 0 ? Math.round((s.correct / s.problems) * 100) : 0;
      return `<tr><td>${s.date?.split(',')[0] || '?'}</td><td>${s.startTime}–${s.endTime}</td><td>${formatDuration(s.duration)}</td><td>${s.problems}</td><td>${s.correct} (${acc}%)</td></tr>`;
    }).join('');
    html += `</table></div>`;
  }

  // Recent level attempts
  if (recentLevels.length > 0) {
    html += `<div class="pr-section"><h3>Recent Level Attempts</h3>`;
    html += `<table class="pr-table"><tr><th>When</th><th>World</th><th>Type</th><th>Op</th><th>Acc</th><th>Time</th><th>Pass</th></tr>`;
    html += recentLevels.map(l => {
      const worldName = WORLDS[l.world]?.nameEn || l.world;
      return `<tr>
        <td>${l.date?.split(',')[1]?.trim() || '?'}</td>
        <td>${worldName} L${l.level + 1}</td>
        <td>${l.type}</td>
        <td>${l.operation}</td>
        <td>${l.accuracy}%</td>
        <td>${formatDuration(l.duration || 0)}</td>
        <td>${l.passed ? 'Pass' : 'Retry'}</td>
      </tr>`;
    }).join('');
    html += `</table></div>`;
  }

  html += `</div>`;
  return html;
}
