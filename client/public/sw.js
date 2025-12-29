// REPAYZ Service Worker v2.0
const CACHE_NAME = 'repayz-v2';
const STATIC_CACHE = 'repayz-static-v2';

// Static assets to cache on install (updated paths)
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo-optimized.webp',
  '/favicon-96.png',
  '/favicon-192.png',
  '/repayz-app-icon-192.png',
  '/repayz-app-icon-512.png',
  '/repayz-recycling-icon-optimized.webp',
  '/repayz-geld-verdienen-icon-optimized.webp',
  '/repayz-duurzaam-leaf-icon-optimized.webp',
  '/repayz-wally-statiegeld-ai-logo.webp',
  '/sociaal-huis-logo-small.webp',
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v2...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('[SW] Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker v2...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategy: Stale-while-revalidate for static assets, Network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls - always fetch fresh
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // For static assets: Cache-first with background update
  if (url.pathname.match(/\.(webp|png|jpg|jpeg|svg|ico|woff2?|ttf|css|js)$/)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // For HTML pages: Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          
          // If not in cache and network failed, return offline page
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
