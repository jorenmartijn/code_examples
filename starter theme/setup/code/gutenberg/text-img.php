<?php
/**
 * Block template file: 
 *
 * Text Img Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'text-img-' . $block['id'];
if ( ! empty($block['anchor'] ) ) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'block-text-img';
if( ! empty( $block['className'] ) ) {
    $classes .= ' ' . $block['className'];
}
if( ! empty( $block['align'] ) ) {
    $classes .= ' align' . $block['align'];
}
?>

<section id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $classes ); ?>">
    <div class="row">
        <?php $choise = get_field( 'volgorde' ); ?>
        <?php if ($choise === 'content-img') : ?>
            <div class="columns small-48 medium-24">
                <?php if ( have_rows( 'content_half' ) ) : ?>
                    <?php while ( have_rows( 'content_half' ) ) : the_row(); ?>
                        <?php the_sub_field( 'content' ); ?>
                        <?php if(file_exists(locate_template( 'includes/content/block-parts/buttons.php' ))):
                            include(locate_template( 'includes/content/block-parts/buttons.php' ));
                        endif; ?>
                    <?php endwhile; ?>
                <?php endif; ?>
            </div>
            <div class="columns small-48 medium-24">
                <?php $image_half = get_field( 'image_half' ); ?>
                <?php if ( $image_half ) { ?>
                    <figure class="image-wrapper">
                        <img class="lazy" data-src="<?= content_url(); ?>/build/img/nothing.gif" alt="<?= get_post_meta($image_half, '_wp_attachment_image_alt', true); ?>" data-lazy="
                        [<?=nrdq_get_image_url($image_half, 'medium');?>, small],
                        [<?= nrdq_get_image_url($image_half, 'large'); ?>, medium]">
                    </figure>
                <?php } ?>
            </div>
        <?php else : ?>
            <div class="columns small-48 medium-24">
                <?php $image_half = get_field( 'image_half' ); ?>
                <?php if ( $image_half ) { ?>
                    <figure class="image-wrapper">
                        <img class="lazy" data-src="<?= content_url(); ?>/build/img/nothing.gif" alt="<?= get_post_meta($image_half, '_wp_attachment_image_alt', true); ?>" data-lazy="
                        [<?=nrdq_get_image_url($image_half, 'medium');?>, small],
                        [<?= nrdq_get_image_url($image_half, 'large'); ?>, medium]">
                    </figure>
                <?php } ?>
            </div>
            <div class="columns small-48 medium-24">
                <?php if ( have_rows( 'content_half' ) ) : ?>
                    <?php while ( have_rows( 'content_half' ) ) : the_row(); ?>
                        <?php the_sub_field( 'content' ); ?>
                        <?php if(file_exists(locate_template( 'includes/content/block-parts/buttons.php' ))):
                            include(locate_template( 'includes/content/block-parts/buttons.php' ));
                        endif; ?>
                    <?php endwhile; ?>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>
</section>