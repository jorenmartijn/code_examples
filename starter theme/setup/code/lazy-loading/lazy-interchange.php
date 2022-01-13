<!--     Lazy Interchange afbeelding - wel interchange / wel lazyload-->
<figure>
    <img class="lazy" src="<?=content_url();?>/build/img/pixel.gif" data-src="<?=content_url();?>/build/img/pixel.gif" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>" data-lazy="
            [<?=nrdq_get_image_url($image_id, 'thumbnail');?>, small],
            [<?=nrdq_get_image_url($image_id, 'medium');?>, xlarge],
            [<?=nrdq_get_image_url($image_id, 'full');?>, xlargeretina]">
</figure>

<!--     Lazy Interchange achtergrond afbeelding - wel interchange / wel lazyload-->
<!--     Let op: het is nog wel nodig om dit element een hoogte en breedte te geven-->
<div class="background-image bg-lazy" data-src="<?=content_url();?>/build/img/pixel.gif" data-lazy="
            [<?=nrdq_get_image_url($image_id, 'thumbnail');?>, small],
            [<?=nrdq_get_image_url($image_id, 'medium');?>, xlarge],
            [<?=nrdq_get_image_url($image_id, 'full');?>, xlargeretina]"></div>
