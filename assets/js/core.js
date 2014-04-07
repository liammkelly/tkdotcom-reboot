$().ready( function() {

    var stack = [],
        slidesJson = {},
        count,
        loadcount = 3,
        isAllSlidesLoaded = false,
        isOrdered = false,
        slideId;

    // make console logging safe
    if (typeof console === "undefined"){
        console={};
        console.log = function(){
            return;
        }
    };

    $('#art-area').hover(
        function() {
            $('.control').fadeIn();
        },
        function() {
            $('.control').fadeOut();
        }
    );

    $.ajax({
        url:        '/tk-reboot/assets/data/content.json',
        success:    function(response) {
            // get the slides data object
            slidesJson = eval( "(" + response + ")" );
            count = slidesJson.length

            for( var i = 2; i < (slidesJson.length)-1; i++ ) {
                // init a new image object
                var img = new Image(1025,585);

                // load the image
                img.id = 'slide_' + slidesJson[i]['id'];
                img.src = '/tk-reboot/assets/images/SwappingPhotos/' + slidesJson[i]['img'];

                // when image has loaded, push it into the queue to be added to the slideshow
                $(img).bind('load', function() {
                    stack.push(this);
                    loadcount += 1;
                    if( loadcount === count ) {
                        isAllSlidesLoaded = true;
                    }
                });
            };

            // init the slideshow
            $('#slides-area').cycle({
                fx:             'scrollHorz',
                next:           '#next',
                prev:           '#prev',
                startingSlide:  1,
                before:         onBefore,
                after:          onAfter,
                timeout:        0,
                speed:          700
            });

            $("#slides-area").touchwipe({
                  wipeLeft: function() {
                        $("#slides-area").cycle("next");
                  },
                  wipeRight: function() {
                        $("#slides-area").cycle("prev");
                  }
            });

            $(document.documentElement).keyup(function (e) {
                if (e.keyCode == 39)
                {
                   $('#slides-area').cycle('next');
                }

                if (e.keyCode == 37)
                {
                    $('#slides-area').cycle('prev');
                }

            });
        }
    });

    function onAfter(currSlideElement, nextSlideElement, options, forwardFlag) {
        var curr = $(nextSlideElement)[0];
        slideId = parseInt( curr.id.split('_')[1] );

        // show description
        $('#description').html( getDescription(slideId) );

        // if everything is loaded and we haven't reordered yet, do so now
        if( isAllSlidesLoaded && !isOrdered ) {
            reorderSlideshow(slideId);
        }
    };

    function onBefore(curr, next, opts) {
         if (opts.addSlide) // <-- important!
            while(stack.length) {
                // if anything is waiting to get into the slideshow, go ahead and add it
                opts.addSlide(stack.pop());
            }
    };

    function reorderSlideshow(slideId) {
        // the slideshow is now ordered
        isOrdered = true;

        // nuke the slideshow
        $('#slides-area').cycle('destroy');
        console.log( 'cycle:destroy');

        // re-order the slides
        for( var j = 0; j < slidesJson.length; j++ ) {
            $('#slide_'+j).appendTo( $('#slides-area') )
        };
        console.log( 'cycle:reorg');

        // start the slideshow
        $('#slides-area').cycle({
            fx:             'scrollHorz',
            next:           '#next',
            prev:           '#prev',
            startingSlide:  slideId,
            before:         onBefore,
            after:          onAfter,
            timeout:        0,
            speed:          700
        });
        console.log( 'cycle:restart');

    }

    function getDescription(slideId) {
        for( var i = 0; i < slidesJson.length; i++ ) {
            if( slidesJson[i]['id'] === slideId ) {
                return slidesJson[i]['description'];
            }
        }
    };

})
