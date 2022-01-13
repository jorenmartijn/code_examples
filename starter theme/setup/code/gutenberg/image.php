<?php
/**
 * Block template file: 
 *
 * Image Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'image-' . $block['id'];
if ( ! empty($block['anchor'] ) ) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'block-image';
if( ! empty( $block['className'] ) ) {
    $classes .= ' ' . $block['className'];
}
if( ! empty( $block['align'] ) ) {
    $classes .= ' align' . $block['align'];
}
?>

<section id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $classes ); ?>">
    <div class="row">
        <div class="columns small-48">
            <?php $image = get_field( 'image' ); ?>
            <?php if ( $image ) { ?>
                <figure class="image-wrapper">
                    <img class="lazy" data-src="<?= content_url(); ?>/build/img/nothing.gif" alt="<?= get_post_meta($image, '_wp_attachment_image_alt', true); ?>" data-lazy="
                    [<?=nrdq_get_image_url($image, 'medium');?>, small],
                    [<?= nrdq_get_image_url($image, 'large'); ?>, medium]">
                </figure>
            <?php } ?>
        </div>
    </div>
</section>

