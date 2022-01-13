<script type="text/javascript">
    // Complete slider

    // To use lazy loading, set a data-lazy attribute
    // on your img tags and leave off the src
    $('.slider').slick({
        accessibility: true         // Enables tabbing and arrow key navigation - default true
        adaptiveHeight: true,       // Enables adaptive height for single slide horizontal carousels - default false
        autoplay: true,             // Enables Autoplay - default false
        autoplaySpeed: 3000         // Autoplay Speed in milliseconds - default 3000
        arrows: false,              // Prev/Next Arrows - default true
        asNavFor: '.slider-for',    // Set the slider to be the navigation of other slider (Class or ID Name) - default null
        dots: true,                 // Show dot indicators
        infinite: true,             // Infinite loop sliding
        slidesToShow: 3,            // # of slides to show
        slidesToScroll: 3           // # of slides to scroll
        speed: 300,                 // Slide/Fade animation speed
        variableWidth: true,        // Variable width slides - default false
        lazyLoad: 'ondemand',       // Set lazy loading technique. Accepts 'ondemand' or 'progressive'
        fade: true,                 // Enable fade - default fade
        cssEase: 'linear',          // CSS3 Animation Easing - default 'ease'
        zIndex: true                // Set the zIndex values for slides, useful for IE9 and lower - default 1000
        nextArrow: '<i class="icon icon-chevron-up slick-next"></i>',
        prevArrow: '<i class="icon icon-chevron-up slick-prev"></i>',
        responsive: [
            {
                breakpoint: 1024, // Show 3 slides on screens smaller than 1024px
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600, // Show 2 slides on screens smaller than 600px
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480, // Show 1 slide on screens smaller than 480px
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
</script>