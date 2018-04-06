(function () {
    'use strict';

    var category = null;
    var search = null;

    var API = 'https://newsapi.org/v2/';
    var ENDPOINT_HEADLINES = 'top-headlines?';
    var ENDPOINT_EVERYTHING = 'everything?';
    var PAGE_SIZE = 'pageSize=16';
    var API_KEY = 'apiKey=c5a59e6e745f45849e2e56af4efad07d';

    getNews();

    var permissionNotification = false;

    if ('Notification' in window) {
        permissionNotification = Notification.permission;

        // Se é possível enviar notificação
        // Solicita a permissão para o envio de notificações
        if (permissionNotification) {
            console.log('Request permission');
            Notification.requestPermission(function (perm) {
                permissionNotification = perm;
            });
        }
    }



    window.onblur = function onBlur() {
        console.log('saiu');
        if (permissionNotification) {
            setTimeout(function () {
                navigator.serviceWorker.getRegistration()
                .then(
                    function (reg){
                        var options = 
                        {
                            body: 'Lula foi...',
                            icon: 'icons/android-chrome-192x192.png',
                            badge: 'icons/android-chrome-192x192.png'
                        };
                        reg.showNotification('Ei tem novas notícias =)', options);
                    }
                )
            }, 3000);
        }
    }

    if ("ondevicelight" in window){
        window.addEventListener("deviceLight", onUpdateDeviceLight);
    }else{
        console.log("There is no ondevicelight")
    }

    function onUpdateDeviceLight(event){
        var colorPart = Math.min(255, event.value).toFixed(0);
        document.getElementById("body").style.backgroundColor = `rgb(${colorPart},${colorPart},${colorPart})`;
    }

    function getNews() {
        var url = API + ENDPOINT_HEADLINES + 'country=br&' + PAGE_SIZE + '&' + API_KEY + getCategory();
        $.get(url, success);
    }

    function getNewsWithSearch() {
        var url = API + ENDPOINT_EVERYTHING + API_KEY + getSearch();
        $.get(url, success);
    }

    function success(data) {
        var divNews = $('#news');
        divNews.empty();
        setTopNews(data.articles[0]);
        for (var i = 1; i < data.articles.length; ++i) {
            divNews.append(getNewsHtml(data.articles[i]));
        }
    }

    function setTopNews(article) {
        if (article) {
            $('#top-news-title').text(article.title);
            $('#top-news-description').text(article.description);
            $('#top-news-image').attr('src', article.urlToImage).attr('alt', article.title);
            $('#top-news-link').attr('href', article.url);
        }
    }

    $("#headline").click(function () {
        category = null;
        activeMenu($(this));
    });
    $("#health").click(function () {
        category = 'health';
        activeMenu($(this));
    });
    $("#sports").click(function () {
        category = 'sports';
        activeMenu($(this));
    });
    $("#entertainment").click(function () {
        category = 'entertainment';
        activeMenu($(this));
    });
    $("#technology").click(function () {
        category = 'technology';
        activeMenu($(this));
    });
    $("#search").keypress(function (ev) {
        if (ev.which == 13) {
            search = $(this).val();
            if (search) {
                getNewsWithSearch();
            } else {
                getNews();
            }
        }
    });

    function activeMenu(menu) {
        search = null;
        $("#search").val('');
        $('li.active').removeClass('active');
        menu.addClass('active');
        getNews();
    }

    function getCategory() {
        if (category) {
            return '&category=' + category
        }
        return '';
    }

    function getSearch() {
        if (search) {
            return '&q=' + search
        }
        return '';
    }

    function getNewsHtml(article) {

        var card = $('<div>').addClass('card m-2 p-2 col-12 col-sm-5 col-md-5 col-lg-3 col-xl-3');

        card = addImage(card);
        card = addBodyTitle(card);
        card = addBodyActions(card);

        return card;

        function addImage(card) {
            if (article.urlToImage) {
                return card.append(
                    $('<img>')
                        .attr('src', article.urlToImage)
                        .attr('alt', article.title)
                        .addClass('card-img-top rounded')
                );
            }
            return card;
        }

        function addBodyTitle(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<h5>').addClass('card-title').append(article.title))
                    .append($('<h6>').addClass('card-subtitle mb-2 text-muted')
                        .append(moment(article.publishedAt).fromNow()))
                    .append($('<p class="d-block d-sm-none d-md-none d-lg-block d-xl-block ">').addClass('card-text').append(article.description))
            );
        }

        function addBodyActions(card) {
            return card.append(
                $('<div>')
                    .addClass('card-body')
                    .append($('<button>').append('Read Article').addClass('btn btn-link').attr('type', 'button'))
                    .click(function () {
                        window.open(article.url, '_blank');
                    })
            );
        }
    }

})();