const CACHE_NAME = 'survey-v9';
const ASSETS = [
  './',
  './index.html',
  './css/style.css?v=8',
  './js/data.js?v=8',
  './js/db.js?v=8',
  './js/sync.js?v=8',
  './js/survey.js?v=8',
  './js/satisfaction.js?v=8',
  './js/admin.js?v=8',
  './js/app.js?v=8',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first strategy: try network, fall back to cache (offline support)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Cache the fresh response for offline use
        if (response.ok && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
