jQuery(function($) {
    /*多说*/
    var  duoshuoTrans= window.location.pathname;
    $('.ds-thread').attr('data-url','http://lifesign.me'+duoshuoTrans);

    /*模拟键盘上下滚动*/
    document.onkeydown = checkKey;

    function checkKey(e) {
        e = e || window.event;
        if (e.keyCode == '74') {
            $('html,body').stop();
            $('html,body').animate({
                scrollTop: $(window).stop().scrollTop() + 200
            },'fast')
        }
        else if (e.keyCode == '75') {
            $('html,body').stop();
            $('html,body').animate({
                scrollTop: $(window).stop().scrollTop() - 200
            },'fast')
        }

    }
    /* ============================================================ */
    /* Responsive Videos */
    /* ============================================================ */

    $(".post-content").fitVids();

    /* ============================================================ */
    /* Scroll To Top */
    /* ============================================================ */
    $("#back-top").hide();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#back-top').fadeIn();
        } else {
            $('#back-top').fadeOut();
        }
    });

    $('.js-jump-top').on('click', function(e) {
        e.preventDefault();

        $('html, body').animate({'scrollTop': 0});
    });

    /* ============================================================ */
    /* Ajax Loading */
    /* ============================================================ */

    var History = window.History;
    var loading = false;
    var showIndex = false;
    var $ajaxContainer = $('#ajax-container');
    var $latestPost = $('#latest-post');
    var $postIndex = $('#post-index');

    // Initially hide the index and show the latest post
    $latestPost.show();
    $postIndex.hide();

    // Show the index if the url has "page" in it (a simple
    // way of checking if we're on a paginated page.)
    if (window.location.pathname.indexOf('page') === 1 || window.location.pathname.indexOf('tag') === 1) {
        $latestPost.hide();
        $postIndex.show();
    }

    // Check if history is enabled for the browser
    if ( ! History.enabled) {
        return false;
    }

    History.Adapter.bind(window, 'statechange', function() {
        var State = History.getState();

        // Get the requested url and replace the current content
        // with the loaded content
        $.get(State.url, function(result) {
            var $html = $(result);
            var $newContent = $('#ajax-container', $html).contents();

            // Set the title to the requested urls document title
            document.title = $html.filter('title').text();

            $('html, body').animate({'scrollTop': 0});

            $ajaxContainer.fadeOut(500, function() {
                $latestPost = $newContent.filter('#latest-post');
                $postIndex = $newContent.filter('#post-index');

                if (showIndex === true) {
                    $latestPost.hide();
                } else {
                    $latestPost.show();
                    $postIndex.hide();
                }

                // Re run fitvid.js
                $newContent.fitVids();

                $ajaxContainer.html($newContent);
                $ajaxContainer.fadeIn(500);

                NProgress.done();

                //rerender highlight syntax
                Prism.highlightAll();

                loading = false;
                showIndex = false;
            });
        });
    });

    $('body').on('click', '.js-ajax-link, .pagination a, .post-tags a', function(e) {
        e.preventDefault();

        if (loading === false) {
            var currentState = History.getState();
            var url = $(this).attr('href');
            var title = $(this).attr('title') || null;

            // If the requested url is not the current states url push
            // the new state and make the ajax call.
            if (url !== currentState.url.replace(/\/$/, "")) {
                loading = true;

                // Check if we need to show the post index after we've
                // loaded the new content
                if ($(this).hasClass('js-show-index') || $(this).parent('.pagination').length > 0) {
                    showIndex = true;
                }

                NProgress.start();

                History.pushState({}, title, url);
            } else {
                // Swap in the latest post or post index as needed
                if ($(this).hasClass('js-show-index')) {
                    $('html, body').animate({'scrollTop': 0});

                    NProgress.start();

                    $latestPost.fadeOut(300, function() {
                        $postIndex.fadeIn(300);
                        NProgress.done();
                    });
                } else {
                    $('html, body').animate({'scrollTop': 0});

                    NProgress.start();

                    $postIndex.fadeOut(300, function() {
                        $latestPost.fadeIn(300);
                        NProgress.done();
                    });
                }
            }
        }
    });

    //console trick
    (function(a) {
        if (!a) return;
        var msg = "\u6b22\u8fce\u6765\u5230\u6211\u7684\u535a\u5ba2~(@\u4e91\u88ad)";
        if (window.chrome) {
            a.log('\u9a9a\u5e74 \u9001\u4f60\u4e2a\u59b9\u5b50\u770b\u770b\u5427~');
            var picNo = getRandomInt(1, 16);
            a.log("Print out the " + picNo + "th image.");
            a.log("%c", "padding:165px 150px;line-height:350px;background:url('http://wayouliu.duapp.com/img/tagsImg/" + picNo + ".jpg') no-repeat;");
            a.log("%c \u8bd5\u8bd5F5\u5237\u65b0", "color:green;");
        } else {
            a.log(msg);
        }
    })(top.console);

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


});
