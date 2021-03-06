(function () {
    'use strict'

    var CACHE_DATA = 'pwa-news-data-v1';
    var API = 'https://newsapi.org/v2';
    var CACHE_SHELL = 'pwa-news-shell-v5';
    var FILES_SHELL = [
        '/',
        '/css/main.css',
        '/js/api.js',
        '/library/jquery-3.3.1.min.js',
        '/library/moment.min.js'
        //imagem de placeholder quando não carrega
        // main.css com os estilos para responsividade

    ];

    self.addEventListener('activate', function (event){
        var cacheList = [CACHE_SHELL, CACHE_DATA];

        console.log("SW - Activate");

        // Procurar no cache do navegador por algo diferente dos caches da lista
        return event.waitUntil(
            self.caches.keys().then(function (cacheNames){
                //console.log(cacheNames); //nome dos caches recuperados do browser
                return Promise.all(cacheNames.map(function name(cacheName){
                    if(cacheList.indexOf(cacheName) === -1){
                        self.caches.delete(cacheName);
                    }
                }))
                
            })
        )
    });

    self.addEventListener('install', function (event) {
        console.log('Instalou!')
        event.waitUntil(
            self.caches.open(CACHE_SHELL)
                .then(function (cache) {
                    return cache.addAll(FILES_SHELL);
                }).catch(function (error) {

                })

        )
    });

    // Cache First
    // Verifica no cache, se já tem retorna. Se não, vai no servidor e retorna
    self.addEventListener('fetch', function (event) {
        if (event.request.url.indexOf(API) === -1) {
            event.respondWith(
                caches.match(event.request)
                    .then(function (response) {
                        if (response) {
                            return response
                        }
                        return fetch(event.request)
                    })
            )
        } else {
            // Network first
            event.respondWith(
                self.fetch(event.request)
                    .then(function (response) {
                        // Precisa do return pois está fazendo um fetch
                        return caches.open(CACHE_DATA)
                            .then(function (cache) {
                                cache.put(event.request.url, response.clone());
                                return response;
                            })
                    }).catch(function () {
                        //se der erro retorna o que tem no cache
                        return caches.match(event.request)
                    })

            )
        }
    })
}());