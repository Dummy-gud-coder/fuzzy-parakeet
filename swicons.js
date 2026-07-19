const CACHE_NAME = 'favicon-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.hostname === 'icons.duckduckgo.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Force 'no-cors' mode. This instructs the browser to bypass the CORS block 
          // and fetches the asset as an "opaque" object that can be safely cached.
          const opaqueRequest = new Request(event.request, { mode: 'no-cors' });

          return fetch(opaqueRequest).then((networkResponse) => {
            // Note: Opaque responses return a status of 0 instead of 200.
            if (networkResponse.status === 200 || networkResponse.status === 0) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
});
