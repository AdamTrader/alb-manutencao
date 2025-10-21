const CACHE_NAME = 'manutencao-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'checklist.html',
    'database.js',
    'https://cdn.tailwindcss.com',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png'
];

// Evento de instalação: abre o cache e armazena os arquivos principais
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de fetch: intercepta as requisições e serve do cache se disponível
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se encontrar no cache, retorna a resposta do cache
                if (response) {
                    return response;
                }
                // Senão, faz a requisição à rede
                return fetch(event.request);
            })
    );
});

// Evento de ativação: limpa caches antigos
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
