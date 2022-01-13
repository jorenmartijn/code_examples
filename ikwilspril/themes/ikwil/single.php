<?php get_header(); ?>

  <?php get_template_part('includes/content/breadcrumbs');?>

    <?php if ( post_password_required() ) : ?>
      <?php echo get_the_password_form(); ?>
    <?php else : ?>
      <?php if ( have_posts() ) : ?>
        <?php while ( have_posts() ) : the_post(); ?>
        <article class="main-content">
          <header>
            <h1><?php the_title(); ?></h1>
          </header>
          <div class="entry-content">
            <?php the_content(); ?>
          </div>
          <footer>
            <?php get_template_part('includes/content/social-share');?>
          </footer>
        </article>
        <?php endwhile; ?>
      <?php endif; ?>
    <?php endif; ?>

  <?php get_sidebar(); ?>
  
<?php get_footer(); ?>