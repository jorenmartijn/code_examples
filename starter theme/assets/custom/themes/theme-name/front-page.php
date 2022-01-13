<?php get_header(); ?>

  <?php // default loop
  $args = array(
    'post_type'       => 'post',
    'post_status'     => 'publish',
    'posts_per_page'  => -1,
  );
  $the_query = new WP_Query( $args ); ?>
  <?php if ( $the_query->have_posts() ) : ?>
    <?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>


    <?php endwhile;?>
  <?php endif; wp_reset_query();?>

  <?php the_content(); ?>

<?php get_footer(); ?>