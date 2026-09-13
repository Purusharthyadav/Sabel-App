const CACHE = 'sable-shell-v3';
const SHELL_FILES = ['./index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL_FILES)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Never touch cross-origin requests (Groq API, Google Fonts) — always go straight to network.
  if (url.origin !== self.location.origin) return;
  if (e.request.method !== 'GET') return;

  // Network-first: always try to get the freshest file when online, so updates
  // show up the moment you reopen the app — no more needing to force-close it.
  // Only falls back to whatever's cached if the network request fails (offline).
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
