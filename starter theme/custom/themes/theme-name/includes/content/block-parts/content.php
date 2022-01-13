<?php if ( have_rows( 'content' ) ) : ?>
	<?php while ( have_rows( 'content' ) ) : the_row(); ?>
        <div class="content-wrapper">
		    <?php the_sub_field( 'content_inner' ); ?>
        </div>
		<?php if(file_exists(locate_template( 'includes/content/block-parts/buttons.php' ))):
            include(locate_template( 'includes/content/block-parts/buttons.php' ));
        endif; ?>
	<?php endwhile; ?>
<?php endif; ?>