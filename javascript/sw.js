const CACHE_NAME = 'exam-prep-v1';
const ASSETS = [
  '../',
  '../index.html',
  '../cascading style sheet/app.css',
  './app.js',
  './data.js',
  '../libraries/css/google-fonts.css',
  '../libraries/css/material-symbols.css'
];

// Add all font files dynamically or manually. 
// Since we have many fonts, a "cache as you go" strategy might be better for icons/fonts, 
// but for the core UI, we pre-cache.

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache new font files or other assets on the fly
        if (event.request.url.includes('/libraries/fonts/')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        }
        return response;
      });
    })
  );
});
