<?php get_header(); ?>

	<?php get_template_part('includes/content/breadcrumbs');?>

	<div class="search-results-container">
		<div class="row">
			<div class="small-24 medium-24 columns" id="content" role="main">

				<h2><?php _e( 'Gevonden zoekresultaten voor ', 'DEFINE_LANG' ); ?>"<?php echo get_search_query(); ?>"</h2>

				<?php if ( have_posts() ) : ?>

					<ul class="small-block-grid-1 medium-block-grid-3 search-results">

						<?php while ( have_posts() ) : the_post(); ?>
							<?php get_template_part( 'includes/content', get_post_format() ); ?>
						<?php endwhile; ?>

					</ul>

					<?php else : ?>
						<?php get_template_part( 'includes/content', 'none' ); ?>

				<?php endif; ?>

                <div class="pagination-container text-center">
                    <?php nrdq_default_pagination(); ?>
                </div>
			</div>
		</div>
	</div>

<?php get_footer(); ?>