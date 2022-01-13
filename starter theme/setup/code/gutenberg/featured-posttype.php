<?php
/**
 * Block template file:
 *
 * Featured Posttype Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'featured-posttype-' . $block['id'];
if ( ! empty($block['anchor'] ) ) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'block-featured-posttype';
if( ! empty( $block['className'] ) ) {
    $classes .= ' ' . $block['className'];
}
if( ! empty( $block['align'] ) ) {
    $classes .= ' align' . $block['align'];
}
?>

<div id="<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $classes ); ?>">
    <div class="row">
        <div class="columns small-48">
            <?php $featured_posttype = get_field( 'featured_posttype' ); ?>
            <?php if ( $featured_posttype ): ?>
                <?php foreach ( $featured_posttype as $featured_post ):
                    $id = $featured_post;
                    $post_type = get_post_type($id);

                    if(file_exists(locate_template( 'includes/content/cards/card-' . $post_type . '.php' ))):
                        include(locate_template( 'includes/content/cards/card-' . $post_type . '.php' ));
                    endif;
                    ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
</div>
