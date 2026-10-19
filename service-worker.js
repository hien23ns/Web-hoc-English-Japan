// Service Worker for AutoPilot Study Hub (Network-First with Offline Cache Fallback)
const CACHE_NAME = 'autopilot-hub-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/audio.js',
  './js/telemetry.js',
  './js/dictionary.js',
  './js/cloud-sync.js',
  './js/srs.js',
  './js/mistakes.js',
  './js/adaptive-ai.js',
  './js/mock-exam.js',
  './js/autopilot.js',
  './js/app.js',
  './js/data/toeic-data.js',
  './js/data/jlpt-data.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Never cache external AI generative API calls
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // Network-First Strategy: Always fetch fresh code when online, fallback to cache if offline
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return null;
        });
      })
  );
});
