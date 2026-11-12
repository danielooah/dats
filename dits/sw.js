// Alter Speicherort von DiTs – entfernt sich selbst
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('dits-')).map(n => caches.delete(n)))).then(() => self.registration.unregister())));
