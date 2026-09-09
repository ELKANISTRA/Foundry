const CACHE_NAME = 'fortification-dashboard-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './schemes/dugout_main.png',
  './schemes/dugout_1.png',
  './schemes/dugout_2.png',
  './schemes/Tortuga.png',
  './schemes/Cargo.png',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// Встановлення Service Worker та кешування ресурсів
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кешування інженерних схем та ресурсів...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Активація та очищення старого кешу
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
    })
  );
});

// Перехоплення запитів (Offline First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
