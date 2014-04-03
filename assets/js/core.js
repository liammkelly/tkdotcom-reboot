$().ready( function() {

    $('#art-area').hover(
        function() {
            $('.control').fadeIn();
        },
        function() {
            $('.control').fadeOut();
        }
    );

    $.ajax({
        url:        '/tk-reboot/assets/data/slides.json',
        success:    function(response) {
            var slidesJson = eval( "(" + response + ")" );
            for( var i = 0; i < slidesJson.length; i++ ) {
                var slide = $('<div/>').addClass('slide');
                var image = $('<img/>').attr('src','/tk-reboot/assets/images/' + slidesJson[i]['img']);
                slide.append( image );
                $('#slides-area').append( slide );
            }
            $('#slides-area').cycle({
                fx:         'scrollHorz',
                next:       '#next',
                prev:       '#prev',
                speed:      500,
                timeout:    0
            });
        }
    })

})
