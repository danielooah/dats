/* DaTs Mobil – Offline-Zwischenspeicher. Es werden nur die App-Dateien gespeichert,
   niemals Kundendaten (die liegen ausschließlich in der Datenbank des Browsers). */
const VERSION = 'dats-mobil-4';
const DATEIEN = ['./', 'index.html', 'manifest.webmanifest',
                 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(namen => Promise.all(namen.filter(n => n !== VERSION).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

/* Erst aus dem Zwischenspeicher (startet auch ohne Netz), im Hintergrund erneuern. */
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(c => c.match(r, {ignoreSearch: true}).then(treffer => {
    const netz = fetch(r).then(antwort => {
      if (antwort && antwort.ok) c.put(r, antwort.clone());
      return antwort;
    }).catch(() => treffer);
    return treffer || netz;
  })));
});
