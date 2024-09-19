// service-worker.js (for basic setup)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("offline-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/marker_green_icon.png",
        "/marker_red_icon.png",
        "/path/to/other/resources",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
