<!--     Standaard afbeelding - geen interchange / geen lazyload-->
<figure>
    <img src="<?= nrdq_get_image_url($image_id, 'medium'); ?>" alt="<?= esc_attr(get_post_meta($image_id, '_wp_attachment_image_alt', true)); ?>">
</figure>

<!--     Standaard achtergrond afbeelding - geen interchange / geen lazyload-->
<!--     Let op: het is nog wel nodig om dit element een hoogte en breedte te geven-->
<div class="background-image" style="background-image: url(<?= nrdq_get_image_url($image_id, 'medium'); ?>);"></div>
