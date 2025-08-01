// sw.js
const CACHE_NAME = 'isa4-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  const title = data.title || 'Nuova notifica';
  const options = {
    body: data.body || 'Hai un nuovo messaggio',
    icon: data.icon || '/icons/icon-72x72.png',
    badge: '/icons/icon-72x72.png'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // Qui implementeresti la tua logica di sincronizzazione
      console.log('Sincronizzazione in background avviata')
    );
  }
});
