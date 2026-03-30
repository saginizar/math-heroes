// animations.js — Animation trigger helpers

import { delay } from '../utils/helpers.js';

export function shakeElement(el) {
  el.classList.add('shake-wrong');
  el.addEventListener('animationend', () => el.classList.remove('shake-wrong'), { once: true });
}

export function glowElement(el) {
  el.classList.add('glow-correct');
  el.addEventListener('animationend', () => el.classList.remove('glow-correct'), { once: true });
}

export function pulseElement(el) {
  el.classList.add('pulse-hint');
}

export function stopPulse(el) {
  el.classList.remove('pulse-hint');
}

export async function fadeOut(el) {
  el.classList.add('fading-out');
  await delay(300);
  el.classList.remove('fading-out');
}

export async function fadeIn(el) {
  el.classList.add('fading-in');
  await delay(400);
  el.classList.remove('fading-in');
}

export function confettiBurst(container) {
  const colors = ['#FFE100', '#00D4FF', '#FF6B2B', '#22AA44', '#FF44AA', '#FF6B6B', '#6BCB77', '#4D96FF'];
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * 400}px`);
    particle.style.setProperty('--y', `${-Math.random() * 500 - 100}px`);
    particle.style.setProperty('--r', `${Math.random() * 720}deg`);
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = '50%';
    particle.style.top = '50%';
    container.appendChild(particle);
    setTimeout(() => particle.remove(), 2000);
  }
}

// Full-screen celebration overlay for correct answers
export function showCorrectCelebration() {
  const overlay = document.createElement('div');
  overlay.className = 'correct-celebration';

  // Big emoji burst
  const emojis = ['⭐', '🎉', '✨', '💪', '🏆', '👏', '🌟', '🎊'];
  const picked = [];
  for (let i = 0; i < 6; i++) {
    picked.push(emojis[Math.floor(Math.random() * emojis.length)]);
  }

  overlay.innerHTML = `
    <div class="celeb-flash"></div>
    <div class="celeb-emojis">
      ${picked.map((e, i) => `<span class="celeb-emoji" style="--i:${i}">${e}</span>`).join('')}
    </div>
    <div class="celeb-text">✓</div>
  `;

  document.getElementById('app').appendChild(overlay);

  // Confetti inside the overlay
  confettiBurst(overlay);

  // Remove after animation
  setTimeout(() => overlay.remove(), 1200);
}
