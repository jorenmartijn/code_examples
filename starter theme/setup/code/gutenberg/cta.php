<?php
/**
 * Block template file:
 *
 * Cta Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'cta-' . $block['id'];
if ( ! empty($block['anchor'] ) ) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'block-cta';
if ( ! empty( $block['className'] ) ) {
    $classes .= ' ' . $block['className'];
}
if ( ! empty( $block['align'] ) ) {
    $classes .= ' align' . $block['align'];
}
?>

<style type="text/css">
    <?php echo '#' . $id; ?> {
    /* Add styles that use ACF values here */
    }
</style>

<section id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $classes ); ?>">
    <div class="row">
        <div class="columns">
            <h2 class="title"><?php the_field( 'cta_title' ); ?></h2>
            <?php the_field( 'cta_content' ); ?>
            <?php if ( have_rows( 'buttons' ) ) : ?>
                <?php while ( have_rows( 'buttons' ) ) : the_row(); ?>
                    <?php $button = get_sub_field( 'button' ); ?>
                    <?php if ( $button ) : ?>
                        <?php $button_color = get_sub_field( 'button_color' ); ?>
                        <a class="btn-<?= $button_color; ?>" href="<?php echo esc_url( $button['url'] ); ?>" target="<?php echo esc_attr( $button['target'] ); ?>"><?php echo esc_html( $button['title'] ); ?></a>
                    <?php endif; ?>
                <?php endwhile; ?>
            <?php endif; ?>
        </div>
    </div>

</section>
