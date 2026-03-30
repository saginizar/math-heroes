// world-map.js — World selection map

import { WORLDS, WORLD_ORDER } from '../levels/world-data.js';
import { getState } from '../engine/save-manager.js';
import { speak, isUsingHebrew } from '../audio/speech.js';
import { PHRASES } from '../audio/hebrew-phrases.js';
import { renderHero } from '../ui/hero-avatar.js';
import { renderCoinBar } from '../ui/progress-bar.js';

export function renderWorldMap(container) {
  const state = getState();

  const worldNodes = WORLD_ORDER.map(wId => {
    const w = WORLDS[wId];
    const unlocked = state.worlds[wId]?.unlocked ?? w.unlocked;
    const completed = state.worlds[wId]?.levels?.filter(l => l.completed).length || 0;
    const total = w.levels.length;

    return `
      <button class="world-node ${unlocked ? 'world-unlocked' : 'world-locked'}"
              data-action="select-world" data-world="${wId}"
              style="${unlocked ? `--wp: ${w.colors.primary}; --ws: ${w.colors.secondary}; border-color: ${w.colors.primary};` : ''}"
              ${!unlocked ? 'disabled' : ''}>
        <div class="world-icon">${unlocked ? getWorldEmoji(wId) : '🔒'}</div>
        <div class="world-name">${w.nameHe}</div>
        ${unlocked && total > 0 ? `<div class="world-progress">${completed}/${total}</div>` : ''}
      </button>
    `;
  }).join('');

  container.innerHTML = `
    <div class="world-map-content color-shift-bg">
      <!-- Wandering heroes -->
      <div class="floating-decor wander-decor" style="top:70%;left:50%;font-size:42px;">🦸‍♂️</div>
      <div class="floating-decor wander-decor" style="top:40%;left:15%;font-size:38px;animation-delay:-4s;">🧙</div>
      <div class="floating-decor wander-decor" style="top:85%;left:30%;font-size:34px;animation-delay:-7s;">🤖</div>
      <!-- Flying characters -->
      <div class="fly-across" style="top:12%;font-size:34px;">🚀</div>
      <div class="fly-across" style="top:50%;font-size:28px;animation-delay:-5s;animation-duration:16s;">🦅</div>
      <!-- Floating decorations -->
      <div class="floating-decor" style="top:8%;left:2%;font-size:36px;animation-delay:-1s;">🎈</div>
      <div class="floating-decor" style="top:25%;right:3%;font-size:30px;animation-delay:-3s;">☁️</div>
      <div class="floating-decor" style="bottom:12%;left:5%;font-size:28px;animation-delay:-5s;">🌈</div>
      <div class="floating-decor" style="bottom:25%;right:2%;font-size:32px;animation-delay:-2s;">🎪</div>
      <!-- Sparkles -->
      <div class="sparkle" style="top:15%;left:25%;animation-delay:0s;">✨</div>
      <div class="sparkle" style="top:35%;right:10%;animation-delay:0.6s;">💫</div>
      <div class="sparkle" style="top:60%;left:12%;animation-delay:1.2s;">✨</div>
      <div class="sparkle" style="top:80%;right:30%;animation-delay:0.3s;">⭐</div>
      <div class="sparkle" style="top:48%;left:45%;animation-delay:0.9s;">✨</div>
      <!-- Spinning items -->
      <div class="spin-decor" style="top:3%;right:4%;font-size:36px;">🌟</div>
      <div class="spin-decor" style="bottom:3%;left:3%;font-size:30px;animation-delay:-4s;">⚡</div>
      <!-- Zoom-bounce -->
      <div class="floating-decor zoom-bounce" style="top:55%;right:8%;font-size:28px;">🎯</div>
      <div class="map-header" dir="rtl">
        <button class="btn-back map-back map-home-btn" data-action="back-to-splash">🏠 חזרה</button>
        <div class="map-hero">${renderHero(state.hero.costumes, 'small')}</div>
        <h2 class="map-title">${PHRASES.worldMapTitle}</h2>
        ${renderCoinBar()}
      </div>
      <div class="world-grid">
        ${worldNodes}
      </div>
    </div>
  `;

  setTimeout(() => speak(isUsingHebrew() ? PHRASES.worldMapTitle : 'World Map'), 300);
}

function getWorldEmoji(worldId) {
  const emojis = {
    speed_city: '⚡',
    web_tower: '🕸️',
    iron_lab: '⚙️',
    mushroom_quest: '🍄',
    grand_circuit: '🏎️',
    dr_zero_lair: '💀',
  };
  return emojis[worldId] || '🌟';
}
