<!--     Lazy loaded afbeelding - geen interchange / wel lazyload-->
<figure>
    <img class="lazy" src="<?=content_url();?>/build/img/pixel.gif" data-src="<?= nrdq_get_image_url($image_id, 'medium'); ?>" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>">
</figure>

<!--     Lazy loaded achtergrond afbeelding - geen interchange / wel lazyload-->
<!--     Let op: het is nog wel nodig om dit element een hoogte en breedte te geven-->
<!--     Is op dit moment niet mogelijk met Unveil-->
