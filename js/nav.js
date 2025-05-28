
document.addEventListener('DOMContentLoaded', () => {
    buildNavComponents();
    setupNavListeners();
});

const buildNavComponents = () => {
    // Global header navigation
    const navHeader = document.createElement('nav');

    navHeader.innerHTML = `
    <div class="nav-wrapper container">
        <a href="/" class="brand-logo">My Contacts</a>
        <ul id="nav-mobile" class="right hide-on-med-and-down">
            <li><a href="/pages/favorites.html">Favorites</a></li>
            <li><a href="/pages/about.html">About</a></li>
        </ul>
        <a href="#" class="burger">|||</a>
    </div>
    `;

    // Slide-in navigation for small devices
    const navDrawer = document.createElement('ul');
    navDrawer.classList.add('sidenav');

    navDrawer.innerHTML = `
    <li><a href="/">Home</a></li>
    <li><a href="/pages/favorites.html">Favorites</a></li>
    <li><a href="/pages/about.html">About</a></li>
    `;

    // Add both to body
    const body = document.querySelector('body');
    body.insertBefore(navHeader, body.firstChild);
    body.insertBefore(navDrawer, body.firstChild);
}

const setupNavListeners = () => {
    const sidenav = document.querySelectorAll('.sidenav')[0];
    const burger = document.querySelectorAll('.burger')[0];

    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        sidenav.classList.toggle('open');
    });

    document.body.addEventListener('click', () => {
        if (sidenav.classList.contains('open')) {
            sidenav.classList.remove('open');
        }
    });

    sidenav.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}
