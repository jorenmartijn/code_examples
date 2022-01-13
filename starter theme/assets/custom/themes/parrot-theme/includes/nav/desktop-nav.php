<div class="row">
	<div class="small-48 columns text-right bottom-row">
		<?php
			wp_nav_menu( array(
		    'theme_location' 	=> 'primary',
		    'container' 		=> 'nav',
			'container_id'    	=> 'desktop-menu',
		    'depth' 			=> 3,
		    'items_wrap'		=> '<ul class="dropdown menu" data-dropdown-menu data-alignment="left">%3$s</ul>',
			) );
		?>
		<?php if($cta = get_field('company_header_button', 'option')) : ?>
		  <a href="<?=$cta['url'];?>" title="<?=$cta['title'];?>" target="<?=$cta['target'];?>" class="btn-secondary has-arrow nav-cta"><?=$cta['title'];?></a>
		<?php endif; ?>
		<div class="desktop__searchform">
			<?php get_template_part('includes/content/search-form'); ?>
		</div>
	</div>
</div>