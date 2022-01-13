<?php get_header(); ?>

	<?php get_template_part('includes/content/breadcrumbs');?>
	
	 <div class="main-wrap" role="main">
	 	<div class="row">
	
	   	<?php if(post_has_sidebar() && get_field('post_has_sidebar') == 'sidebar_left') : ?>
	  		
	  		<div class="small-48 large-13 columns">
	
	  		 <?php get_sidebar(); ?>
	
	  	 	</div>
	  	 	
	    <?php endif; ?>
	
		 	<div class="small-48 <?php if(post_has_sidebar()): ?>large-31 xlarge-33<?php endif; ?><?php if(post_has_sidebar() && get_field('post_has_sidebar') == 'sidebar_left') : ?> large-offset-2<?php endif; ?> columns">
	
			 <?php while ( have_posts() ) : the_post(); ?>
				<article <?php post_class('main-content') ?> id="article">
	
	  			<?php
					/*
					 * Flexible content
					 */
					?>
	        <?php if( have_rows('fc_block') ): ?>
	          
	          <?php while ( have_rows('fc_block') ) : the_row(); ?>
	           
	            <?php get_template_part( 'includes/content/flexible-content/fc','block' ); ?>
	          
	          <?php endwhile; ?>
	        
	        <?php	endif; ?>
	
				</article>
				
			 <?php endwhile;?>
	
		 	</div>
	
			<?php if(post_has_sidebar() && get_field('post_has_sidebar') == 'sidebar_right') : ?>
	  		
	  		<div class="small-48 large-17 xlarge-14 large-offset-1 columns" data-sticky-container>
	
	  		 <?php get_sidebar(); ?>
	
	  	 	</div>
	  	 	
	  	 <?php endif; ?>
	  	 
	 	</div>
	</div>

<?php get_footer(); ?>