<script type="text/javascript">
    // Slick events

    // Fires after slide change
    $('.slider').on('afterChange', function(slick, currentSlide){
        console.log(currentSlide);
    });

    // Fires Fires before slide change
    $('.slider').on('beforeChange', function(slick, currentSlide, nextSlide){
        console.log(nextSlide);
    });

    // Fires after a breakpoint is hit.
    $('.slider').on('breakpoint', function(event, slick, breakpoint){
        console.log(breakpoint);
    });

    // When slider is destroyed, or unslicked.
    $('.slider').on('destroy', function(event, slick){
        console.log('destroy');
    });

    // Fires when an edge is overscrolled in non-infinite mode.
    $('.slider').on('edge', function(slick, direction){
        console.log(direction);
    });

    // Fires after first initialization.
    $('.slider').on('init', function(slick){
        console.log('init');
    });

    // Fires after every re-initialization
    $('.slider').on('reInit', function(slick){
        console.log('reInit');
    });

    // Fires after position/size changes
    $('.slider').on('setPosition', function(slick){
        console.log('setPosition');
    });

    // Fires after swipe/drag
    $('.slider').on('swipe', function(slick, direction){
        console.log(direction);
    });

    // Fires after image loads lazily
    $('.slider').on('lazyLoaded', function(event, slick, image, imageSource){
        console.log(image);
    });

    // Fires after image fails to load
    $('.slider').on('lazyLoadError', function(event, slick, image, imageSource){
        console.log(image);
    });

</script>