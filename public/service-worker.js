// public/service-worker.js

const CACHE_NAME = "offline-cache";
const urlsToCache = [
  "/",
  "/index.html",
  "/marker_green_icon.png",
  "/marker_red_icon.png",
  "/_next/static/*", // Cache Next.js static files
  // Add any other paths (CSS, JS, map tiles) that you need to cache
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Serve the cached response if available
        return response || fetch(event.request);
      })
      .catch(() => {
        // If both the network and cache fail, return an offline page or resource
        return caches.match("/offline.html");
      })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
