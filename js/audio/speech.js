// speech.js — TTS wrapper
// v5: Try English first (user reports Hebrew never worked), then fix Hebrew later

let selectedVoice = null;
let speechAvailable = false;
let voicesReady = false;
let useLang = 'en-US'; // Start with English; switch to Hebrew if voice found

// CRITICAL: Chrome GC fix — keep reference at module scope
let _activeUtterance = null;
let ttsMuted = false;

export function setTTSMuted(muted) { ttsMuted = muted; }

const ttsLog = [];
function log(msg) {
  const entry = `[TTS ${Date.now() % 100000}] ${msg}`;
  ttsLog.push(entry);
  console.log(entry);
  if (ttsLog.length > 50) ttsLog.shift();
}

export function getTTSLog() {
  return ttsLog.join('\n');
}

export function initSpeech() {
  if (!('speechSynthesis' in window)) {
    log('Web Speech API NOT available');
    return;
  }
  speechAvailable = true;
  log('speechSynthesis found, loading voices...');

  loadVoices();

  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      log('onvoiceschanged fired');
      loadVoices();
    };
  }

  setTimeout(() => {
    if (!voicesReady) {
      log('Fallback: forcing voicesReady after 3s');
      loadVoices();
      voicesReady = true;
    }
  }, 3000);
}

function loadVoices() {
  const voices = speechSynthesis.getVoices();
  log(`getVoices: ${voices.length} voices`);
  if (voices.length === 0) return;
  voicesReady = true;

  // FORCE English — Hebrew TTS detected but never produces audible sound on this device
  const englishVoices = voices.filter(v => v.lang === 'en-US' || v.lang.startsWith('en'));
  const femaleKeywords = ['female', 'zira', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'susan', 'hazel', 'jenny', 'aria', 'sara', 'woman'];
  const femaleVoice = englishVoices.find(v => femaleKeywords.some(k => v.name.toLowerCase().includes(k)));
  const englishVoice = femaleVoice || englishVoices[0];
  if (englishVoice) {
    selectedVoice = englishVoice;
    useLang = 'en-US';
    log(`Using English${femaleVoice ? ' (female)' : ''}: "${englishVoice.name}"`);
  } else {
    selectedVoice = voices[0];
    useLang = voices[0]?.lang || 'en-US';
    log(`No English — using: "${voices[0]?.name}" (${voices[0]?.lang})`);
  }
  const voiceList = voices.slice(0, 15).map(v => `${v.name}(${v.lang})`).join(', ');
  log(`Available voices: ${voiceList}`);
}

export function speak(text, rate = 0.9) {
  if (!speechAvailable || !text || ttsMuted) {
    return Promise.resolve();
  }

  return new Promise(resolve => {
    try { speechSynthesis.cancel(); } catch (e) {}

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = useLang;
    if (selectedVoice) {
      utter.voice = selectedVoice;
    }
    utter.rate = rate * 1.05; // Slightly faster for energy
    utter.pitch = 1.35; // Higher pitch = happier, more child-friendly
    utter.volume = 1.0;

    // CRITICAL: Store reference to prevent Chrome GC
    _activeUtterance = utter;

    let resolved = false;
    const done = (reason) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(safety);
      _activeUtterance = null;
      resolve();
    };

    utter.onend = () => done('end');
    utter.onerror = (e) => {
      log(`error: ${e.error || 'unknown'} for "${text.slice(0, 20)}"`);
      done('error');
    };

    // Safety timeout
    const safety = setTimeout(() => done('timeout'), 8000);

    // Speak after tiny delay (Chrome cancel→speak race)
    setTimeout(() => {
      try {
        speechSynthesis.speak(utter);
        log(`speaking(${useLang}): "${text.slice(0, 30)}..."`);

        // Chrome unstick
        setTimeout(() => {
          if (speechSynthesis.paused) {
            speechSynthesis.resume();
          }
        }, 500);
      } catch (e) {
        log(`exception: ${e.message}`);
        done('exception');
      }
    }, 80);
  });
}

export function speakQueued(text, rate = 0.9) {
  if (!speechAvailable || !text || ttsMuted) return Promise.resolve();

  return new Promise(resolve => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = useLang;
    if (selectedVoice) utter.voice = selectedVoice;
    utter.rate = rate * 1.05;
    utter.pitch = 1.35;
    _activeUtterance = utter;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    setTimeout(() => resolve(), 8000);
    try { speechSynthesis.speak(utter); } catch (e) { resolve(); }
  });
}

export function stopSpeech() {
  if (speechAvailable) {
    try { speechSynthesis.cancel(); } catch (e) {}
    _activeUtterance = null;
  }
}

export function isTTSAvailable() {
  return speechAvailable && voicesReady;
}

export function markInteraction() {}

export function warmUpSpeech() {
  if (!speechAvailable) return;
  try {
    const dummy = new SpeechSynthesisUtterance(' ');
    dummy.lang = useLang;
    dummy.volume = 0.01;
    dummy.rate = 2;
    if (selectedVoice) dummy.voice = selectedVoice;
    _activeUtterance = dummy;
    dummy.onend = () => { _activeUtterance = null; };
    dummy.onerror = () => { _activeUtterance = null; };
    speechSynthesis.speak(dummy);
  } catch (e) {}
}

export function getTTSStatus() {
  const voices = speechAvailable ? speechSynthesis.getVoices() : [];
  return {
    available: speechAvailable,
    voicesReady,
    voiceFound: !!selectedVoice,
    voiceName: selectedVoice?.name || 'none',
    voiceLang: useLang,
    totalVoices: voices.length,
    recentLog: ttsLog.slice(-5),
  };
}

export function isUsingHebrew() {
  return false; // Hebrew TTS never produces sound on this device — always use English
}
