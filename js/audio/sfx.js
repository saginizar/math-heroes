// sfx.js — Procedural sound effects using Web Audio API (with variety)

let ctx = null;
let correctIndex = 0;
let wrongIndex = 0;
let globalMuted = false;

export function isMuted() { return globalMuted; }
export function setMuted(muted) {
  globalMuted = muted;
  if (muted) stopBgMusic();
}

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone(freq, endFreq, duration, type = 'sine', volume = 0.3) {
  if (globalMuted) return;
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    osc.frequency.linearRampToValueAtTime(endFreq, c.currentTime + duration);
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch (e) {}
}

function playChord(freqs, duration, type = 'sine', volume = 0.15) {
  freqs.forEach(f => playTone(f, f, duration, type, volume));
}

// ===== CORRECT SOUNDS (6 variations, rotated) — more exciting =====
const correctSounds = [
  () => { // Triumphant ascending fanfare
    playTone(523, 784, 0.15, 'sine', 0.35);
    setTimeout(() => playTone(784, 1047, 0.2, 'sine', 0.3), 100);
    setTimeout(() => playChord([1047, 1319, 1568], 0.3, 'sine', 0.2), 250);
  },
  () => { // Bright sparkle cascade
    [600, 800, 1000, 1200, 1500].forEach((f, i) => {
      setTimeout(() => playTone(f, f + 200, 0.12, 'sine', 0.3), i * 50);
    });
    setTimeout(() => playChord([1200, 1500, 1800], 0.25, 'sine', 0.18), 300);
  },
  () => { // Happy power chord
    playChord([523, 659, 784], 0.2, 'sine', 0.25);
    setTimeout(() => playChord([784, 988, 1175], 0.3, 'sine', 0.22), 150);
    setTimeout(() => playTone(1568, 1568, 0.15, 'sine', 0.3), 350);
  },
  () => { // Victory trumpet
    playTone(784, 784, 0.1, 'square', 0.15);
    setTimeout(() => playTone(988, 988, 0.1, 'square', 0.15), 100);
    setTimeout(() => playTone(1175, 1175, 0.15, 'square', 0.15), 200);
    setTimeout(() => playChord([1175, 1480, 1760], 0.3, 'sine', 0.2), 320);
  },
  () => { // Bubbly celebration
    [700, 900, 1100, 1300, 1500, 1700].forEach((f, i) => {
      setTimeout(() => playTone(f, f + 50, 0.08, 'sine', 0.25), i * 40);
    });
    setTimeout(() => playTone(1800, 2000, 0.2, 'sine', 0.2), 280);
  },
  () => { // Epic rising sweep + chord
    playTone(400, 1200, 0.25, 'sine', 0.3);
    setTimeout(() => playChord([1047, 1319, 1568], 0.35, 'sine', 0.22), 200);
  },
];

export function playCorrect() {
  correctSounds[correctIndex % correctSounds.length]();
  correctIndex++;
}

// ===== WRONG SOUNDS (3 variations, rotated) =====
const wrongSounds = [
  () => { // Gentle descending
    playTone(400, 250, 0.3, 'triangle', 0.15);
  },
  () => { // Soft double bump
    playTone(350, 280, 0.15, 'triangle', 0.12);
    setTimeout(() => playTone(300, 220, 0.2, 'triangle', 0.12), 150);
  },
  () => { // Low wobble
    playTone(300, 350, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(350, 200, 0.25, 'triangle', 0.12), 100);
  },
];

export function playWrong() {
  wrongSounds[wrongIndex % wrongSounds.length]();
  wrongIndex++;
}

// ===== OTHER SOUNDS =====
export function playWhoosh() {
  if (globalMuted) return;
  try {
    const c = getCtx();
    const bufferSize = c.sampleRate * 0.4;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = c.createBufferSource();
    source.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, c.currentTime);
    filter.frequency.linearRampToValueAtTime(2000, c.currentTime + 0.4);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.2, c.currentTime);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
    source.connect(filter).connect(gain).connect(c.destination);
    source.start();
  } catch (e) {}
}

export function playPop() {
  playTone(600, 400, 0.08, 'sine', 0.25);
}

export function playKeyPop() {
  // Slightly varied pop for keyboard typing
  const freq = 500 + Math.random() * 200;
  playTone(freq, freq - 100, 0.06, 'sine', 0.15);
}

export function playFanfare() {
  const notes = [523, 659, 784, 1047]; // C E G C
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, freq, 0.35, 'sine', 0.25), i * 200);
  });
  // Final chord
  setTimeout(() => playChord([1047, 1319, 1568], 0.5, 'sine', 0.2), 900);
}

export function playPowerUp() {
  playTone(400, 1600, 0.6, 'sine', 0.25);
}

export function playStreak() {
  // Exciting ascending cascade
  [800, 1000, 1200, 1400, 1600].forEach((f, i) => {
    setTimeout(() => playTone(f, f + 200, 0.12, 'sine', 0.25), i * 50);
  });
  setTimeout(() => playChord([1600, 2000, 2400], 0.2, 'sine', 0.15), 300);
}

export function playClapping() {
  if (globalMuted) return;
  // Realistic clapping: band-passed noise with sharp attack + fast exponential decay
  try {
    const c = getCtx();
    const numClaps = 7;
    for (let i = 0; i < numClaps; i++) {
      const t = c.currentTime + i * 0.24 + (Math.random() * 0.04);
      const dur = 0.07;
      const bufferSize = Math.floor(c.sampleRate * dur);
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        // Sharp attack, exponential decay — mimics percussive clap transient
        const envelope = Math.exp(-j / (c.sampleRate * 0.012));
        data[j] = (Math.random() * 2 - 1) * envelope;
      }
      const source = c.createBufferSource();
      source.buffer = buffer;
      // Band-pass centered ~2500-3500Hz (clap frequency range)
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 2500 + Math.random() * 1000;
      bp.Q.value = 0.8;
      // High-pass to remove rumble
      const hp = c.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1200;
      const gain = c.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      source.connect(bp).connect(hp).connect(gain).connect(c.destination);
      source.start(t);
      source.stop(t + dur);
    }
  } catch (e) {}
}

export function playRetry() {
  // Encouraging "try again" sound — not punishing
  playTone(500, 400, 0.2, 'sine', 0.15);
  setTimeout(() => playTone(400, 600, 0.3, 'sine', 0.18), 250);
}

export function resumeAudio() {
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

// ===== BACKGROUND MUSIC — Soft looping kid-friendly melody =====
let bgMusicPlaying = false;
let bgGain = null;
let bgIntervalId = null;

// Pentatonic scale notes (C major pentatonic — always sounds pleasant)
const PENTA_SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
const BASS_NOTES = [130.81, 146.83, 164.81, 196.00]; // C3, D3, E3, G3

function playBgNote(freq, duration, type = 'sine', vol = 0.04, startTime = 0) {
  try {
    const c = getCtx();
    const t = c.currentTime + startTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    // Gentle vibrato for warmth
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.08);
    gain.gain.setValueAtTime(vol, t + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, t + duration);
    osc.connect(gain);
    if (bgGain) {
      gain.connect(bgGain);
    } else {
      gain.connect(c.destination);
    }
    osc.start(t);
    osc.stop(t + duration);
  } catch (e) {}
}

function playMelodyBar() {
  // Pick 4 random melody notes from pentatonic scale
  const notes = [];
  for (let i = 0; i < 4; i++) {
    notes.push(PENTA_SCALE[Math.floor(Math.random() * PENTA_SCALE.length)]);
  }
  // Bass note
  const bass = BASS_NOTES[Math.floor(Math.random() * BASS_NOTES.length)];

  // Play soft bass pad
  playBgNote(bass, 3.5, 'sine', 0.025, 0);

  // Play melody notes with gentle timing
  notes.forEach((note, i) => {
    playBgNote(note, 0.8, 'sine', 0.03, i * 0.9);
  });

  // Soft pad chord (two harmonious notes)
  const padNote = PENTA_SCALE[Math.floor(Math.random() * 4)];
  playBgNote(padNote, 3.0, 'triangle', 0.015, 0.2);
  playBgNote(padNote * 1.5, 3.0, 'triangle', 0.01, 0.2); // Perfect fifth
}

export function startBgMusic() {
  if (bgMusicPlaying || globalMuted) return;
  bgMusicPlaying = true;

  try {
    const c = getCtx();
    bgGain = c.createGain();
    bgGain.gain.setValueAtTime(0.6, c.currentTime); // Master volume for bg music
    bgGain.connect(c.destination);
  } catch (e) {
    return;
  }

  // Play first bar immediately
  playMelodyBar();

  // Loop every 3.6 seconds
  bgIntervalId = setInterval(() => {
    if (bgMusicPlaying) {
      playMelodyBar();
    }
  }, 3600);
}

export function stopBgMusic() {
  bgMusicPlaying = false;
  if (bgIntervalId) {
    clearInterval(bgIntervalId);
    bgIntervalId = null;
  }
  if (bgGain) {
    try { bgGain.gain.linearRampToValueAtTime(0, getCtx().currentTime + 0.5); } catch (e) {}
    bgGain = null;
  }
}

export function isBgMusicPlaying() {
  return bgMusicPlaying;
}

export function toggleBgMusic() {
  if (bgMusicPlaying) {
    stopBgMusic();
  } else {
    startBgMusic();
  }
  return bgMusicPlaying;
}
