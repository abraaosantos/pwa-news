(function () {
    'use strict';

    self.addEventListener('push', function (event) {
        var options =
            {
                body: 'Push Notification',
                icon: 'icons/android-chrome-192x192.png',
                badge: 'icons/android-chrome-192x192.png'
            };

        event.waitUltil(
            self.registration.showNotification('Ei tem novo push =)', options));
    });
})();