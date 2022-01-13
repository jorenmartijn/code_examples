<?php
/*
 * Dit is een bestand met voorbeeldcode gebaseed op alle projecten die Nordique gebouwd heeft.
 * Deze code wordt aangepast en uitgebreid door middel van het uitvoeren van het setup script.
 *
 * Kijk altijd hier voordat je nieuwe code gaat schrijven.
 *
 */

/*
 * PHP / HTML Voorbeelden
 */

# BEGIN Google Maps Code
# The directives (lines) between `BEGIN Google Maps Code` and `END Google Maps Code` are 
# dynamically generated. Any changes to the directives between these markers will be overwritten.
?>
<div class="google-maps">
    <?php $location = get_field('location','option');
    if (!empty($location)) : ?>
        <div class="acf-map">
            <div class="marker" data-lat="<?= esc_attr($location['lat']); ?>" data-lng="<?= esc_attr($location['lng']); ?>"></div>
        </div>
    <?php endif; ?>
</div>


<?php
# END Google Maps Code

# BEGIN Contact Code
# The directives (lines) between `BEGIN Contact Code` and `END Contact Code` are 
# dynamically generated. Any changes to the directives between these markers will be overwritten.
/*
* contact information
*/

$company_name     = get_field('company_name', 'option');
$address          = get_field('company_address', 'option');
$zip_city         = get_field('company_zip_city', 'option');
$email            = get_field('company_email', 'option');
$phone            = get_field('company_phone', 'option');
$fax              = get_field('company_fax', 'option');
$company_kvk      = get_field('company_kvk', 'option');
$company_btw      = get_field('company_btw', 'option');
?>

<?php if($company_name) : ?>
    <div class="row">
        <div class="column">
            <strong><?= $company_name; ?>
        </div>
    </div>
<?php endif; ?>


<?php if($address || $zip_city) : ?>
    <div class="row">
        <div class="column">
            <ul class="contact-list">
                <li class="address">
                    <address>
                        <span><?= $address; ?></span>
                        <span><?= $zip_city; ?></span>
                    </address>
                </li>
            </ul>
        </div>
    </div>
<?php endif; ?>

<?php if($phone || $email) : ?>
    <div class="row">
        <div class="column">
            <ul class="contact-list">
                <?php if($phone) : ?>
                    <li><strong><?= __('T: ', 'DEFINE_LANG');?></strong><a href="tel:"><?= $phone;?></a></li>
                <?php endif; ?>
                <li><strong><?= __('E: ', 'DEFINE_LANG');?></strong><a href="mailto:<?= $email; ?>"><?= $email; ?></a></li>
            </ul>
        </div>
    </div>
<?php endif; ?>

<?php if($company_btw) : ?>
    <div class="row">
        <div class="column">
            <strong><?= __('BTW: ', 'DEFINE_LANG');?></strong><?= $company_btw; ?>
        </div>
    </div>
<?php endif; ?>

<?php if($company_kvk) : ?>
    <div class="row">
        <div class="column">
            <strong><?= __('KVK: ', 'DEFINE_LANG');?></strong><?= $company_kvk; ?>
        </div>
    </div>
<?php endif; ?>
<?php

# END Contact Code

# BEGIN Socials Code
# The directives (lines) between `BEGIN Socials Code` and `END Socials Code` are 
# dynamically generated. Any changes to the directives between these markers will be overwritten.
?>
<ul class="social-list">
    <?php $socials = array(
        'facebook' 	    => 'facebook-f',
        'twitter' 	    => 'twitter',
        'linkedin' 	    => 'linkedin',
        'instagram'     => 'instagram',
        'youtube' 	    => 'youtube',
        'vimeo' 		=> 'vimeo-v',
        'pinterest'     => 'pinterest',
        'skype' 		=> 'skype',
    );
    ?>

    <?php foreach($socials as $social => $class) : ?>
        <?php if($field = get_field('sm_' . $social, 'option')) : ?>
            <li><a class="sm_<?=$class;?>" href="<?=$field;?>" title="<?=ucfirst($social);?>" target="_blank"><i class="fab fa-<?=$class;?>"></i></a></li>
        <?php endif; ?>
    <?php endforeach; ?>

</ul>
<?php
# END Socials Code

# BEGIN Images Code
# The directives (lines) between `BEGIN Images Code` and `END Images Code` are 
# dynamically generated. Any changes to the directives between these markers will be overwritten.
?>
<!--     Standaard afbeelding - geen interchange / geen lazyload-->
<figure>
    <img src="<?= nrdq_get_image_url($image_id, 'medium'); ?>" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>">
</figure>

<!--     Standaard achtergrond afbeelding - geen interchange / geen lazyload-->
<!--     Let op: het is nog wel nodig om dit element een hoogte en breedte te geven-->
<div class="background-image" style="background-image: url(<?= nrdq_get_image_url($image_id, 'medium'); ?>);"></div>


<!--     Interchange afbeelding - wel interchange / geen lazyload-->
<figure>
    <img src="<?=content_url();?>/build_ikwil/img/pixel.gif" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>" data-interchange="
            [<?=nrdq_get_image_url($image_id, 'thumbnail');?>, small],
            [<?=nrdq_get_image_url($image_id, 'medium');?>, xlarge],
            [<?=nrdq_get_image_url($image_id, 'full');?>, xlargeretina]">
</figure>

<!--     Interchange achtergrond afbeelding - wel interchange / geen lazyload-->
<!--     Let op: het is nog wel nodig om dit element een hoogte en breedte te geven-->
<div class="background-image" data-interchange="
            [<?=nrdq_get_image_url($image_id, 'thumbnail');?>, small],
            [<?=nrdq_get_image_url($image_id, 'medium');?>, xlarge],
            [<?=nrdq_get_image_url($image_id, 'full');?>, xlargeretina]"></div>


<!--     Lazy loaded afbeelding - geen interchange / wel lazyload-->
<figure>
    <img class="lazy" src="<?=content_url();?>/build_ikwil/img/pixel.gif" data-src="<?= nrdq_get_image_url($image_id, 'medium'); ?>" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>">
</figure>

<!--     Lazy loaded achtergrond afbeelding - geen interchange / wel lazyload-->
<!--     Let op: het is nog wel nodig om dit element een hoogte en breedte te geven-->
<!--     Is op dit moment niet mogelijk met Unveil-->


<!--     Lazy Interchange afbeelding - wel interchange / wel lazyload-->
<figure>
    <img class="lazy" src="<?=content_url();?>/build_ikwil/img/pixel.gif" data-src="<?=content_url();?>/build_ikwil/img/pixel.gif" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>" data-lazy="
            [<?=nrdq_get_image_url($image_id, 'thumbnail');?>, small],
            [<?=nrdq_get_image_url($image_id, 'medium');?>, xlarge],
            [<?=nrdq_get_image_url($image_id, 'full');?>, xlargeretina]">
</figure>

<!--     Lazy Interchange achtergrond afbeelding - wel interchange / wel lazyload-->
<!--     Let op: het is nog wel nodig om dit element een hoogte en breedte te geven-->
<div class="background-image bg-lazy" data-src="<?=content_url();?>/build_ikwil/img/pixel.gif" data-lazy="
            [<?=nrdq_get_image_url($image_id, 'thumbnail');?>, small],
            [<?=nrdq_get_image_url($image_id, 'medium');?>, xlarge],
            [<?=nrdq_get_image_url($image_id, 'full');?>, xlargeretina]"></div>

<?php
# END Images Code

/*
 * JS
 */


# BEGIN Slider Code
# The directives (lines) between `BEGIN Slider Code` and `END Slider Code` are 
# dynamically generated. Any changes to the directives between these markers will be overwritten.
?>
<script type="text/javascript">
    // Simple slider
    $('.slider').slick({
        dots: true,         // Show dot indicators
        infinite: true,     // Infinite loop sliding
        slidesToShow: 3,    // # of slides to show
        slidesToScroll: 3   // # of slides to scroll
        speed: 300,         // Slide/Fade animation speed
        autoplay: true,     // Enables Autoplay
    });
</script>

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
<?php
# END Slider Code

# BEGIN Popup Code
# The directives (lines) between `BEGIN Popup Code` and `END Popup Code` are 
# dynamically generated. Any changes to the directives between these markers will be overwritten.
?>
<div class="small reveal load-reveal" id="loadModal" data-reveal>
    <h1>Awesome. I Have It.</h1>
    <p class="lead">Your couch. It is mine.</p>
    <p>I'm a cool paragraph that lives inside of an even cooler modal. Wins!</p>
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</div>

<div class="tiny reveal leave-reveal" id="leaveModal" data-reveal>
    <h1>Awesome. I Have It.</h1>
    <p class="lead">Your couch. It is mine.</p>
    <p>I'm a cool paragraph that lives inside of an even cooler modal. Wins!</p>
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</div>

<div class="large reveal click-reveal" id="clickModal" data-reveal>
    <h1>Awesome. I Have It.</h1>
    <p class="lead">Your couch. It is mine.</p>
    <p>I'm a cool paragraph that lives inside of an even cooler modal. Wins!</p>
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</div>

<p><button class="button" data-open="clickModal">Click me for a modal</button></p>


<script type="text/javascript">

    // Fires immediately before the modal opens. Closes any other modals that are currently open
    $(document).on("open.zf.reveal", function(event){
        console.log(event);
    });

    // Fires when the modal has successfully opened.
    $(document).on("closeme.zf.reveal", function(event){
        console.log(event);
    });

    // Fires when the modal is done closing.
    $(document).on("closed.zf.reveal", function(event){
        console.log(event);
    });
</script>
<?php
# END Popup Code
