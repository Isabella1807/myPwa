const staticCache = 'staticCache-v1'
const dynamicCache = 'dynamicCache-v1'


const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/css/main.css',
    '/js/nav.js',
    '/pages/test.html',
];

//Kører når en serviceWorker installeres i browseren, hvis nødvendigt.
self.addEventListener('install', event => {
    console.log('Service worker install', event)
    event.waitUntil(
        //hvis staticCache ikke eksistere så opret og fortsæt
        caches.open(staticCache).then(cache => {
            cache.addAll(assets)
        })
    );
})

//kør nyeste sw, slet den gamle og ryd op i cache
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                //Alt der skal slettes, bliver i listen, som så slettes.
                .filter(key => key !== staticCache && key !== dynamicCache)
                .map(key => caches.delete(key)))
        })
    )
})


//fetch intercepts requests til serveren
self.addEventListener('fetch', event => {
    console.log('Request', event.request.url);
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            //Hvis der ikke er noget i cachen (cacheRes), så returner det originale request
            return cacheRes || fetch(event.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    return fetchRes
                })
            });
        }).catch(() => caches.match('/pages/test.html'))
    )

/*    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            fetch(event.request).then(fetchRes => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    return fetchRes
                })
            });

            return cacheRes;
        }).catch(() => {
                if (event.request.url.indexOf('.html') > -1) {
                    caches.match('/pages/test.html')
                }
            }
        )
    )*/
});