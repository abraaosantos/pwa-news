(
    function(){
        'use strict';

        var swPush;
        // Chave do site http://web-push-codelab.glitch.me/
        var publicKey = '';

        if('serviceWorker' in navigator && 'PushManager' in window){
            window.addEventListener('load', function(){
                navigator.serviceWorker.register('pwa-news-sw-push.js')
                .then(function (swRegister){
                    swPush = swRegister;

                    console.log('Service worker push: Register');

                    getSubscription();
                });
            });
        }

        function getSubscription(){
            if(swPush){
                swPush.pushManager.getSubscription()
                .then(function (subscription){
                    if(subscription){
                        console.log('User is subscribed.');
                    }else{
                        console.log('User is NOT subscribed.');
                        registerUser();
                    }
                });
            }
        }

        function registerUser(){
            // Comentado pois estava ocorrendo erro na chamada do server.
            // swPush.pushManager.subscribe({
            //     userVisibleOnly: true,
            //     applicationServerKey: urlB64ToUint8Array(publicKey)
            // }).then(function (subscription){
            //     console.log(JSON.stringify(subscription))
            // });
        }

        
        //urlB64ToUint8Array

        function urlB64ToUint8Array(base64String) {
            const padding = '='.repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
              .replace(/\-/g, '+')
              .replace(/_/g, '/');
      
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);
      
            for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
          }
    }
)();