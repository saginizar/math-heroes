// splash.js — Splash screen

import { speak, getTTSStatus, getTTSLog, isUsingHebrew } from '../audio/speech.js';
import { isBgMusicPlaying } from '../audio/sfx.js';
import { PHRASES, fillTemplate } from '../audio/hebrew-phrases.js';
import { getState } from '../engine/save-manager.js';
import { delay } from '../utils/helpers.js';

export async function renderSplash(container) {
  const state = getState();
  const playerName = state.player.name || '';

  const heroes = [
    { emoji: '⚡', color: '#DC143C' },
    { emoji: '🕸️', color: '#E23636' },
    { emoji: '⚙️', color: '#FFD700' },
    { emoji: '🍄', color: '#E52521' },
    { emoji: '🦇', color: '#4169E1' },
    { emoji: '🏎️', color: '#FF0000' },
  ];

  container.innerHTML = `
    <div class="splash-content color-shift-bg">
      <div class="splash-decor splash-decor-1">🌈</div>
      <div class="splash-decor splash-decor-2">☁️</div>
      <div class="splash-decor splash-decor-3">⭐</div>
      <div class="splash-decor splash-decor-4">🎈</div>
      <!-- Wandering characters -->
      <div class="floating-decor wander-decor" style="top:25%;left:5%;font-size:44px;">🦸‍♂️</div>
      <div class="floating-decor wander-decor" style="top:55%;right:3%;font-size:40px;animation-delay:-3s;">🧙‍♂️</div>
      <div class="floating-decor wander-decor" style="top:72%;left:12%;font-size:36px;animation-delay:-6s;">🦹‍♀️</div>
      <!-- Flying characters -->
      <div class="fly-across" style="top:15%;font-size:36px;">🚀</div>
      <div class="fly-across" style="top:40%;font-size:30px;animation-delay:-4s;animation-duration:15s;">🛸</div>
      <div class="fly-across" style="top:68%;font-size:28px;animation-delay:-8s;animation-duration:18s;">🦅</div>
      <!-- Sparkles -->
      <div class="sparkle" style="top:10%;left:20%;animation-delay:0s;">✨</div>
      <div class="sparkle" style="top:30%;right:15%;animation-delay:0.5s;">✨</div>
      <div class="sparkle" style="top:50%;left:8%;animation-delay:1s;">💫</div>
      <div class="sparkle" style="top:80%;right:25%;animation-delay:1.5s;">✨</div>
      <div class="sparkle" style="top:65%;left:35%;animation-delay:0.8s;">⭐</div>
      <div class="sparkle" style="top:15%;right:8%;animation-delay:1.2s;">💫</div>
      <!-- Spinning decorations -->
      <div class="spin-decor" style="top:5%;right:5%;font-size:40px;">🌟</div>
      <div class="spin-decor" style="bottom:5%;left:5%;font-size:35px;animation-delay:-3s;animation-duration:12s;">⚡</div>
      <!-- Zoom-bounce items -->
      <div class="floating-decor zoom-bounce" style="top:85%;left:40%;font-size:32px;">🏅</div>
      <div class="floating-decor zoom-bounce" style="top:8%;left:45%;font-size:28px;animation-delay:-1.5s;">🎯</div>
      <div class="splash-heroes">
        ${heroes.map(h => `
          <div class="splash-hero-icon" style="color: ${h.color}; text-shadow: 0 0 20px ${h.color};">
            ${h.emoji}
          </div>
        `).join('')}
      </div>
      <h1 class="splash-title">${PHRASES.splashTitle}</h1>
      <p class="splash-subtitle">${PHRASES.splashSubtitle}</p>
      ${playerName ? `<div class="splash-greeting" dir="rtl">היי, ${playerName}! 👋</div>` : ''}
      <button class="btn-primary btn-start" data-action="start-game">${PHRASES.splashStart}</button>
      <div class="splash-bottom-row">
        <button class="btn-secondary btn-settings" data-action="open-settings">⚙️ ${PHRASES.settings}</button>
        <button class="btn-icon btn-music" data-action="toggle-music"><span class="music-icon">${isBgMusicPlaying() ? '🎵' : '🔇'}</span></button>
      </div>
      <div class="tts-status" id="tts-status"></div>
    </div>
  `;

  // TTS diagnostic
  setTimeout(() => {
    const status = getTTSStatus();
    const el = container.querySelector('#tts-status');
    if (!el) return;

    if (status.voiceFound) {
      const lang = isUsingHebrew() ? 'עברית' : 'English';
      el.innerHTML = `<span style="color:#4CAF50">🔊 ${status.voiceName} (${lang})</span>`;
    } else {
      el.innerHTML = `<span style="color:#F44336">❌ No voice found (${status.totalVoices} available)</span>`;
    }
    el.style.cssText = 'font-size:11px;margin-top:6px;opacity:0.6;text-align:center;';

    // Test button
    const testBtn = document.createElement('button');
    testBtn.textContent = '🔊 Test';
    testBtn.style.cssText = 'font-size:11px;padding:3px 8px;border-radius:8px;border:1px solid #999;margin-right:8px;background:#fff;cursor:pointer;';
    testBtn.onclick = () => {
      speak(isUsingHebrew() ? 'שלום! אני עובד!' : 'Hello! I am working!');
    };
    el.prepend(testBtn);
  }, 3000);

  // Greet
  await delay(800);
  if (playerName) {
    const greeting = isUsingHebrew()
      ? fillTemplate(PHRASES.greeting, { name: playerName })
      : `Hi ${playerName}! Let's save the world!`;
    await speak(greeting);
    await delay(300);
  }
  speak(isUsingHebrew() ? PHRASES.splashTitle : 'Math Heroes!');
}
