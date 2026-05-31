self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.open("dynamic-cache").then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => caches.match(event.request));
      })
    );
  });