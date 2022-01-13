<?php
	
	// vars
	$hero_title = get_field('home_header_title');
	$hero_content = get_field('home_header_intro');
	?>
	
	<?php
	/*
	 * This background-image is only visible for medium+
	 */
	?>
	<section class="section-hero is-cover" data-interchange="	[<?=content_url();?>/build/img/pixel.gif, small],[<?=the_post_thumbnail_url('hero-medium'); ?>, medium], [<?=the_post_thumbnail_url('hero-large'); ?>, large], [<?=the_post_thumbnail_url('hero-xxlarge'); ?>, xlarge], [<?=the_post_thumbnail_url('hero-xxlarge'); ?>, xxlarge]">
		<div class="row small-collapse medium-uncollapse align-middle align-justify full-height">
			<div class="small-48 large-26 columns">
	
				<?php // This section is only visible for small sizes. Medium and higher you get a placeholder pixel. ?>
				<div class="mobile-hero-image is-cover" data-interchange="
					[<?=the_post_thumbnail_url('hero-small'); ?>, small],
					[<?=the_post_thumbnail_url('hero-small-retina'); ?>, retina],
					[<?=content_url();?>/build/img/pixel.gif, medium],">
				</div>
	
				<?php if($hero_title || $hero_content) : ?>
			
				<div class="hero-content">
					<h1 class="is-h2"><?=$hero_title;?></h1>
					<p><?=$hero_content;?></p>
					
					<?php if( get_field('home_header_buttons') ): ?>
				
					<div class="button-group">
						<?=get_variable_button('home_header_buttons'); ?>
					</div>
					
					<?php endif; ?>
	
				</div>
				
				<?php endif; ?>
	
			</div>
		</div>
	</section>