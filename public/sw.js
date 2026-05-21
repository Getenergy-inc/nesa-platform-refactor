self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => self.clients.matchAll())
      .then((clients) => {
        clients.forEach((client) => {
          if (client instanceof WindowClient) {
            client.navigate(client.url);
          }
        });
      })
      .then(() => self.caches.keys())
      .then((cacheNames) =>
        Promise.all(cacheNames.map((cacheName) => self.caches.delete(cacheName)))
      )
  );
});
