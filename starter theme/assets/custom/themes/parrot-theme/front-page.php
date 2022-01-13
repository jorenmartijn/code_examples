<?php get_header(); ?>


	<?php
	/*
	 * section hero 
	 */
	?>
	<?php get_template_part('includes/sections/section-hero'); ?> 


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
	
	
<?php get_footer(); ?>