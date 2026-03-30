// sw.js — Service Worker for offline PWA support

const CACHE_NAME = 'mathheroes-v14';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/main.css',
  'css/animations.css',
  'css/themes.css',
  'css/screens.css',
  'js/app.js',
  'js/utils/helpers.js',
  'js/audio/hebrew-phrases.js',
  'js/audio/speech.js',
  'js/audio/sfx.js',
  'js/engine/save-manager.js',
  'js/engine/difficulty.js',
  'js/engine/question-gen.js',
  'js/engine/progress.js',
  'js/engine/game-engine.js',
  'js/levels/world-data.js',
  'js/levels/level-types.js',
  'js/ui/buttons.js',
  'js/ui/animations.js',
  'js/ui/hero-avatar.js',
  'js/ui/progress-bar.js',
  'js/screens/splash.js',
  'js/screens/world-map.js',
  'js/screens/level-select.js',
  'js/screens/gameplay.js',
  'js/screens/reward.js',
];

// Install: cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback (ensures fresh code when online)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Update cache with fresh response
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
