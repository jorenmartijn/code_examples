<script type="text/javascript">
    // Responsive slider
    $('.slider').slick({
        dots: true,         // Show dot indicators
        infinite: true,     // Infinite loop sliding
        slidesToShow: 3,    // # of slides to show
        slidesToScroll: 3   // # of slides to scroll
        speed: 300          // Slide/Fade animation speed
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