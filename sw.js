const CACHE = 'tracerix-v3';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest', './icon.svg', './sw.js',
  './src/app.js', './src/core/constants.js', './src/core/utils.js', './src/data/db.js',
  './src/security/crypto.js', './src/state/model.js', './src/state/session.js', './src/state/persistence.js',
  './src/features/import-export.js', './src/ui/modal.js', './src/views/lock.js', './src/views/day.js',
  './src/views/history.js', './src/views/manage.js'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => caches.match('./index.html'))));
});
