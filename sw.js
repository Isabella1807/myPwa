//Gemmer ting der ikke ændre sig særlig ofte.
const staticCache = 'staticCache-v11'
const dynamicCache = 'dynamicCache-v7'


const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/css/main.css',
    '/js/nav.js',
    '/img/icons/icon48.png',
    '/img/icons/icon72.png',
    '/img/icons/icon96.png',
    '/img/icons/icon144.png',
    '/img/icons/icon192.png',
    '/img/icons/icon512.png',
    '/img/icons/icon1024.png',
    '/pages/test.html',
];

//Kører når en serviceWorker installeres i browseren, hvis nødvendigt.
self.addEventListener('install', event => {
    //console.log('Service worker install', event)
    //Der er en chance for at vi ikke er færdige med at cache før install eventet slutter
    event.waitUntil(
        //åbner cachen, hvis staticCache ikke eksistere så opret og fortsæt
        caches.open(staticCache).then(cache => {
            //her tilføjer vi ting til cachen
            //console.log('cachiiing');
            cache.addAll(assets)
        })
    );
})

//kør nyeste sw, slet den gamle og ryd op i cache
self.addEventListener('activate', event => {
    //console.log('Service worker activate', event)
    event.waitUntil(
        //asynkron der returnere et promise, og går igennem cache og leder efter keys.
        //Keys returnere en liste af caches.
        caches.keys().then(keys => {
            //console.log(keys);
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
    //pauser fetch eventet og svarer med vores eget respons, som er fra cachen.
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
});