// reward.js — Level complete celebration screen (or retry screen)

import { completeLevelAndReward } from '../engine/progress.js';
import { speak, isUsingHebrew } from '../audio/speech.js';
import { playPowerUp, playFanfare, playRetry, playClapping } from '../audio/sfx.js';
import { PHRASES, fillTemplate } from '../audio/hebrew-phrases.js';
import { renderStarsAnimated, animateCoinGain } from '../ui/progress-bar.js';
import { renderHero } from '../ui/hero-avatar.js';
import { confettiBurst } from '../ui/animations.js';
import { getState } from '../engine/save-manager.js';
import { delay } from '../utils/helpers.js';

export async function renderReward(container, resultData) {
  const { totalProblems, firstTryCorrect, passed, accuracyPercent, config } = resultData;

  // If failed (below 75%), show retry screen
  if (!passed) {
    renderRetry(container, resultData);
    return;
  }

  // Capture old coin state BEFORE updating
  const oldState = getState();
  const oldCoins = oldState.hero.coins || 0;
  const oldCoinProgress = Math.round(((oldCoins % 200) / 200) * 100);

  const { stars, coins, accuracy } = completeLevelAndReward(
    config.worldId,
    config.levelIndex,
    totalProblems,
    firstTryCorrect,
    firstTryCorrect,
    config.reward
  );

  // If world boss, also add bonus reward
  if (config.bonusReward) {
    const { addVehicle } = await import('../engine/save-manager.js');
    addVehicle(config.bonusReward);
  }

  const state = getState();
  const costumeName = PHRASES.costumeNames[config.reward] || config.reward;
  const isWorldBoss = config.isWorldBoss;

  container.innerHTML = `
    <div class="reward-content">
      <h2 class="reward-title">${isWorldBoss ? PHRASES.worldComplete : PHRASES.levelComplete}</h2>
      ${renderStarsAnimated(stars)}
      <div class="reward-score">${firstTryCorrect} מתוך ${totalProblems} (${accuracyPercent}%)</div>
      <div class="reward-hero">${renderHero(state.hero.costumes, 'large')}</div>
      <div class="reward-item" dir="rtl">
        <span class="reward-label">${PHRASES.newItem}:</span>
        <span class="reward-name">${costumeName}!</span>
      </div>
      <div class="coin-bar-container" dir="rtl">
        <span class="coin-icon">🪙</span>
        <div class="coin-bar">
          <div class="coin-fill" style="width: ${oldCoinProgress}%"></div>
        </div>
        <span class="coin-label">${oldCoins} 🪙</span>
      </div>
      <div class="reward-coin-gain">+${coins} 🪙</div>
      <div class="reward-buttons">
        <button class="btn-primary btn-continue btn-success" data-action="continue-after-level"
                data-world="${config.worldId}" data-level="${config.levelIndex}">${PHRASES.continue_}</button>
        <button class="btn-secondary btn-replay" data-action="replay-level"
                data-world="${config.worldId}" data-level="${config.levelIndex}">${PHRASES.playAgain}</button>
      </div>
    </div>
  `;

  // Confetti + clapping
  confettiBurst(container);
  playClapping();

  const playerName = state.player.name || '';
  await delay(500);
  if (isUsingHebrew()) {
    speak(`${playerName}! ${isWorldBoss ? PHRASES.worldComplete : PHRASES.levelComplete}`);
    await delay(1500);
    speak(`${PHRASES.correct[0]} ${playerName}!`);
  } else {
    speak(isWorldBoss ? `World complete! Amazing, ${playerName}!` : `Mission complete! Great job, ${playerName}!`);
    await delay(1500);
    speak(`${playerName}, you are a real hero!`);
  }

  // Power up SFX for costume
  await delay(500);
  playPowerUp();

  // Animate coins
  animateCoinGain(container, coins);
}

async function renderRetry(container, resultData) {
  const { totalProblems, firstTryCorrect, accuracyPercent, config } = resultData;

  // Check if "almost there" (60-74%)
  const almostThere = accuracyPercent >= 60 && accuracyPercent < 75;

  container.innerHTML = `
    <div class="reward-content retry-content">
      <h2 class="reward-title retry-title">${PHRASES.retryMessage}</h2>
      <div class="reward-score retry-score">${firstTryCorrect} מתוך ${totalProblems} (${accuracyPercent}%)</div>
      ${almostThere ? `<div class="almost-there">${PHRASES.almostThere}</div>` : ''}
      <div class="retry-hero">${renderHero([], 'large')}</div>
      <div class="retry-encouragement" dir="rtl">
        ${almostThere ? PHRASES.almostThere : PHRASES.retryNarration}
      </div>
      <div class="reward-buttons">
        <button class="btn-primary" data-action="replay-level"
                data-world="${config.worldId}" data-level="${config.levelIndex}">${PHRASES.retryMessage}</button>
        <button class="btn-secondary" data-action="back-to-level-select"
                data-world="${config.worldId}">${PHRASES.back}</button>
      </div>
    </div>
  `;

  playRetry();
  await delay(500);

  const pn = getState().player.name || '';
  if (isUsingHebrew()) {
    speak(`${pn}! ${almostThere ? PHRASES.almostThere : PHRASES.retryNarration}`);
  } else {
    speak(almostThere ? `Almost there, ${pn}! Just a little more!` : `Let's try again, ${pn}! I know you can do it!`);
  }
}
