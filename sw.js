const CACHE_NAME = 'survey-v6';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/db.js',
  './js/sync.js',
  './js/survey.js',
  './js/satisfaction.js',
  './js/admin.js',
  './js/app.js',
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

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
