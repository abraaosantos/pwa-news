(function () {
    'use strict';

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();

        // Abrir algum site
        event.waitUntil(
            // Pode colocar /rota/
            // Pode colocar url completa
            clients.openWindow('https://google.com')
        );
    });

    self.addEventListener('push', function (event) {
        var options =
            {
                body: 'Push Notification',
                icon: 'icons/android-chrome-192x192.png',
                badge: 'icons/android-chrome-192x192.png'
            };

        event.waitUltil(
            self.registration.showNotification('Ei tem novo push =)', options));

        setTimeou(function () {
            self.notification.close();
        }, 2000);
    });


})();