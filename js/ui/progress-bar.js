// progress-bar.js — Coin bar and star display

import { getHeroInfo } from '../engine/progress.js';

export function renderCoinBar() {
  const hero = getHeroInfo();
  const pct = Math.round(hero.coinsProgress * 100);
  return `
    <div class="coin-bar-container" dir="rtl">
      <span class="coin-icon">🪙</span>
      <div class="coin-bar">
        <div class="coin-fill" style="width: ${pct}%"></div>
      </div>
      <span class="coin-label">${hero.coins} 🪙</span>
    </div>
  `;
}

export function renderStars(count, total = 3) {
  let html = '<div class="stars-display">';
  for (let i = 0; i < total; i++) {
    html += `<span class="star ${i < count ? 'star-filled' : 'star-empty'}">★</span>`;
  }
  html += '</div>';
  return html;
}

export function renderStarsAnimated(count, total = 3) {
  let html = '<div class="stars-display stars-animated">';
  for (let i = 0; i < total; i++) {
    const filled = i < count;
    html += `<span class="star ${filled ? 'star-filled star-reveal' : 'star-empty'}" style="animation-delay: ${i * 0.5}s">★</span>`;
  }
  html += '</div>';
  return html;
}

export function animateCoinGain(container, coinsGained) {
  const fill = container.querySelector('.coin-fill');
  if (fill) {
    const hero = getHeroInfo();
    const pct = Math.round(hero.coinsProgress * 100);
    fill.style.transition = 'width 1s ease-out';
    fill.style.width = `${pct}%`;
  }
  const label = container.querySelector('.coin-label');
  if (label) {
    const hero = getHeroInfo();
    label.textContent = `${hero.coins} 🪙`;
  }
}
