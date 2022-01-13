<?php
/**
 * Block template file:
 *
 * Slider Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

global $sliders;
if (!isset($sliders)) {
    $sliders = 1;
}

// Create id attribute allowing for custom "anchor" value.
$id = 'slider-' . $block['id'];
if ( ! empty($block['anchor'] ) ) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'block-slider';
if( ! empty( $block['className'] ) ) {
    $classes .= ' ' . $block['className'];
}
if( ! empty( $block['align'] ) ) {
    $classes .= ' align' . $block['align'];
}
?>

<?php
$slider_popup = get_field('slider_popup');
?>

<section id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $classes ); ?>">
    <div class="row">
        <div class="columns small-48">
            <?php if ( have_rows( 'slider_slides' ) ) : ?>
                <div class="nrdq-slider<?php echo '-'. $sliders++; ?> <?= ($slider_popup ? 'slider-lightbox' : ''); ?>">
                    <?php while ( have_rows( 'slider_slides' ) ) : the_row(); ?>
                        <?php $slide_image = get_sub_field( 'slide_image' ); ?>
                        <?php if ( $slide_image ) { ?>
                            <img src="<?php echo $slide_image['sizes']['large']; ?>" data-lazy="<?php echo $slide_image['sizes']['large']; ?>" alt="<?php echo $slide_image['alt']; ?>" />
                        <?php } ?>
                    <?php endwhile; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>
