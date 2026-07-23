// swicons.js
const ICON_CACHE = "duckduckgo-icons-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin === "https://icons.duckduckgo.com") {
    event.respondWith(
      caches.open(ICON_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          // Fetch directly from network
          const response = await fetch(event.request);

          // If DuckDuckGo returns 200 (or status 0 for opaque success), store in cache
          if (response.ok || response.status === 0) {
            cache.put(event.request, response.clone());
          }
          
          return response;
        } catch (error) {
          return new Response("", { status: 404 });
        }
      })
    );
  }
});
