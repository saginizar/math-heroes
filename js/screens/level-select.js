// level-select.js — Level nodes per world

import { WORLDS } from '../levels/world-data.js';
import { getState } from '../engine/save-manager.js';
import { isLevelAvailable } from '../engine/progress.js';
import { speak, isUsingHebrew } from '../audio/speech.js';
import { PHRASES } from '../audio/hebrew-phrases.js';
import { renderStars, renderCoinBar } from '../ui/progress-bar.js';
import { renderHero } from '../ui/hero-avatar.js';

export function renderLevelSelect(container, worldId) {
  const world = WORLDS[worldId];
  if (!world) return;
  const state = getState();
  const worldState = state.worlds[worldId];

  // Apply world theme
  document.documentElement.style.setProperty('--world-primary', world.colors.primary);
  document.documentElement.style.setProperty('--world-secondary', world.colors.secondary);
  document.documentElement.style.setProperty('--world-bg', world.colors.bg);

  const levelNodes = world.levels.map((lvl, i) => {
    const savedLvl = worldState?.levels[i];
    const completed = savedLvl?.completed || false;
    const stars = savedLvl?.stars || 0;
    const available = isLevelAvailable(worldId, i);
    const isNext = available && !completed;

    return `
      <div class="level-node-row">
        <button class="level-node ${completed ? 'level-completed' : ''} ${isNext ? 'level-next' : ''} ${!available ? 'level-locked' : ''}"
                data-action="select-level" data-world="${worldId}" data-level="${i}"
                ${!available ? 'disabled' : ''}>
          <span class="level-num">${lvl.id}</span>
          ${completed ? renderStars(stars) : isNext ? '<span class="level-icon">✨</span>' : '<span class="level-icon">🔒</span>'}
        </button>
        <span class="level-name">${lvl.nameHe}</span>
      </div>
    `;
  }).reverse().join('<div class="level-path-line"></div>'); // Reversed: level 1 at bottom

  container.innerHTML = `
    <div class="level-select-content" style="background: ${world.colors.bg}">
      <!-- Floating decor -->
      <div class="floating-decor" style="top:12%;right:3%;font-size:30px;animation-delay:-1s;">⚡</div>
      <div class="floating-decor" style="bottom:18%;left:4%;font-size:28px;animation-delay:-3s;">🌈</div>
      <div class="floating-decor" style="top:50%;right:5%;font-size:26px;animation-delay:-5s;">☁️</div>
      <div class="floating-decor" style="top:75%;right:8%;font-size:24px;animation-delay:-2s;">🎈</div>
      <!-- Wandering characters -->
      <div class="floating-decor wander-decor" style="top:25%;left:2%;font-size:36px;animation-delay:-2s;">🦹</div>
      <div class="floating-decor wander-decor" style="top:65%;right:2%;font-size:32px;animation-delay:-5s;">🧝</div>
      <!-- Flying -->
      <div class="fly-across" style="top:8%;font-size:26px;animation-duration:14s;">🚀</div>
      <!-- Sparkles -->
      <div class="sparkle" style="top:20%;left:15%;animation-delay:0.3s;">✨</div>
      <div class="sparkle" style="top:45%;right:12%;animation-delay:0.8s;">💫</div>
      <div class="sparkle" style="top:70%;left:20%;animation-delay:1.4s;">✨</div>
      <div class="sparkle" style="top:88%;right:18%;animation-delay:0.5s;">⭐</div>
      <div class="ls-header" dir="rtl">
        <button class="btn-back" data-action="back-to-map">${PHRASES.back}</button>
        <h2 class="ls-title">${world.nameHe}</h2>
        <div class="ls-hero">${renderHero(state.hero.costumes, 'small')}</div>
      </div>
      ${renderCoinBar()}
      <div class="level-path">
        ${levelNodes}
      </div>
    </div>
  `;

  setTimeout(() => speak(isUsingHebrew() ? world.nameHe : 'Speed City'), 300);
}
