// Service Worker — אקדמיית AI
// אסטרטגיה: network-first לניווטים (תמיד מעודכן), cache-first לנכסים סטטיים (מהיר, עובד אופליין).
const CACHE_NAME = "ai-academy-v2";
const STATIC_CACHE_URLS = ["/", "/manifest.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) return; // לעולם לא לקאש API — תמיד רשת חיה

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    // stale-while-revalidate: מגישים מהמטמון מיד (מהיר), אך תמיד מרעננים ברקע —
    // כך נכס לא-hashed (icon/manifest) לא נשאר מיושן לנצח אחרי דיפלוי.
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
