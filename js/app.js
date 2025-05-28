//Registrering af service worker, hvis der ikke er en eller den der er er outdated
// og start download
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service worker registered', reg))
        .catch(err => console.log('Service worker registration failed', err));
}