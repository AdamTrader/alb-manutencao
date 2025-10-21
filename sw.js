// Version: 3.0 - Adicionado suporte a PDF e forçando atualização do cache

const CACHE_NAME = 'plataforma-manutencao-cache-v3'; // Mudei o nome do cache para v3
const urlsToCache = [
  '/',
  '/index.html',
  '/checklist.html',
  '/checklist-logic.js',
  '/database.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instala o Service Worker e armazena os arquivos em cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: limpando cache antigo', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta as requisições e serve os arquivos do cache (estratégia cache-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrar, senão busca na rede
        return response || fetch(event.request);
      })
  );
});

