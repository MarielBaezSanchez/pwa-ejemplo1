// Nombre del caché
const CACHE_NAME = "mi-pwa-v13";

// Archivos a cachear
const urlsToCache = [
    "index.html",
    "manifest.json",
    "offline.html",
    "icons/icon-96x96.png",
    "icons/icon-180x180.png",
    "icons/icon-192x192.png",
    "icons/icon-512x512.png"
];

// 1️⃣ INSTALACIÓN - Cachea los recursos
self.addEventListener("install", event => {
    console.log("Service Worker instalado");
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
});

// 2️⃣ ACTIVACIÓN - Limpia versiones anteriores del caché
self.addEventListener("activate", event => {
    console.log("Service Worker activado");
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
});

// 3️⃣ FETCH - Sirve los recursos desde caché o red
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                // Si el recurso está cacheado, lo devuelve
                return response;
            }

            // Si no, intenta obtenerlo de la red
            return fetch(event.request).catch(() => {
                // Si falla (sin internet) y es navegación, muestra offline.html
                if (event.request.mode === "navigate") {
                    return caches.match("offline.html");
                }
            });
        })
    );
});
