<?php get_header(); ?>

<?php get_template_part('includes/content/breadcrumbs');?>

	<div class="search-results-container">
		<div class="row">
			<div class="small-48 medium-48 large-32 columns" id="content" role="main">

				<h2><?php _e( 'Gevonden zoekresultaten voor ', 'nordique' ); ?>"<?= get_search_query(); ?>"</h2>

				<?php if ( have_posts() ) : ?>

					<ul class="small-block-grid-1 medium-block-grid-3 search-results">

						<?php while ( have_posts() ) : the_post(); ?>
							<?php get_template_part( 'includes/content/search-results', get_post_format() ); ?>						
						<?php endwhile; ?>

					</ul>

						<?php if (function_exists("pagination")) { ?>
							<div class="search-pagination">
								<?php pagination($wp_query->max_num_pages); } ?> 
							</div>

					<?php else : ?>
					
						<?php echo "Geen resultaten om weer te geven"; ?>

				<?php endif; ?>

			</div>
		</div>
	</div>

<?php get_footer(); ?>