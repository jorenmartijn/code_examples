<?php if ( has_nav_menu( 'secondary' ) ) : ?>

	<div class="columns shrink show-for-large">
		<?php
			wp_nav_menu( array(
			'theme_location' 		=> 'secondary',
			'container' 			=> 'nav',
			'container_id'    		=> 'desktop-topmenu',
			'depth' 				=> 3,
			'items_wrap' 			=> '<ul class="topmenu">%3$s</ul>',
			) );
		?>	
	</div>

<?php else : ?>

	<?php
	// var
	$companyEmail = get_field('company_email','option');
	$companyPhone = get_field('company_phone', 'option');
	$phoneCaller = preg_replace('/\s+/', '', $companyPhone);
	if($companyEmail || $phoneCaller) : ?>
	
	<ul class="contact-list">
		<?php if($companyEmail) : ?><li><i class="far fa-envelope"></i><a href="mailto:<?=antispambot($companyEmail, 1); ?>" class="email" title="<?php _e('E-mail', 'nordique'); ?> <?= get_bloginfo('name'); ?>"><?=antispambot($companyEmail); ?></a></li><?php endif; ?>
		<?php if($phoneCaller) : ?><li><i class="far fa-phone"></i><a href="tel:<?=antispambot($phoneCaller, 1); ?>" class="phone-number" title="<?php _e('Bel', 'nordique'); ?> <?= get_bloginfo('name'); ?>"><?=$companyPhone; ?></a></li><?php endif; ?>
	</ul>
	<?php endif; ?>
	
<?php endif; ?>	