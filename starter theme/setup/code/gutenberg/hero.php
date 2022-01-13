<?php
/**
 * Block template file:
 *
 * Hero Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'hero-' . $block['id'];
if ( ! empty($block['anchor'] ) ) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'block-hero';
if( ! empty( $block['className'] ) ) {
    $classes .= ' ' . $block['className'];
}
if( ! empty( $block['align'] ) ) {
    $classes .= ' align' . $block['align'];
}
?>

<?php $hero_image = get_field( 'image' ); ?>

<section id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $classes ); ?> bg-lazy" data-src="<?= content_url(); ?>/build/img/nothing.gif"
    data-lazy="[<?=nrdq_get_image_url($hero_image, 'medium');?>, small],
    [<?=nrdq_get_image_url($hero_image, 'large');?>, medium],
    [<?=nrdq_get_image_url($hero_image, 'large');?>, large]">

    <div class="row">
        <div class="columns hero-content">
            <?php if(file_exists(locate_template( 'includes/content/block-parts/content.php' ))):
                include(locate_template( 'includes/content/block-parts/content.php' ));
            endif; ?>
        </div>
    </div>
</section>
