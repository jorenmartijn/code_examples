<!--     Interchange afbeelding - wel interchange / geen lazyload-->
<figure>
    <img src="<?=content_url();?>/build/img/pixel.gif" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>" data-interchange="
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
