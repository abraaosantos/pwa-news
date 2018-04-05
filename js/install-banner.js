(function () {
    'use strict';

    var eventInstall;
    var btInstall = $("#bt-install");

    // Evento disparado antes de exibir o banner de instalação (add to home screen)
    window.addEventListener('beforeinstallprompt',function (event){
        
        console.log("beforeinstallprompt");
        eventInstall = event;
        event.preventDefault();

        btInstall.click(function(){
            if(eventInstall){
                eventInstall.prompt();
               
                eventInstall.userChoice.then(function (choiceResult){
                    if(choiceResult.outcome == 'dismissed'){
                        alert("Que pena!");
                    }else{
                        alert("Valeu!");
                    }
                });

                eventInstall = null;
                btInstall.hide();
            }
        });
        btInstall.show();
    

    })


})();