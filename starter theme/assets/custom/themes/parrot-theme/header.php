<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<title><?php wp_title(); ?></title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="apple-touch-icon" sizes="180x180" href="<?=content_url();?>/build/favicon/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="<?=content_url();?>/build/favicon/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="<?=content_url();?>/build/favicon/favicon-16x16.png">
	<link rel="manifest" href="<?=content_url();?>/build/favicon/site.webmanifest">
	<link rel="mask-icon" href="<?=content_url();?>/build/favicon/safari-pinned-tab.svg" color="#f5d76f">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="theme-color" content="#ffffff">
	<link href='https://fonts.gstatic.com' rel='preconnect' crossorigin>
	<link href="https://fonts.googleapis.com/css?family=Karla:400,400i,700,700i" rel="stylesheet">
	<link rel="dns-prefetch" href="https://fonts.gstatic.com">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="theme-color" content="#ffffff">

	<?php wp_head(); ?>

  <?php if(!function_exists('nrdq_check_cookie_level')){
    echo get_field('ga_tracking_code', 'option');
  } else {
    if(nrdq_check_cookie_level('analytics')){
      echo get_field('ga_tracking_code', 'option');
    } else {
      echo get_field('ga_tracking_code_anonimized', 'option');
    }
  } ?>

</head>

<body <?php body_class(); ?>>


<?php
/*
 * Header
 */
?>
<header id="header">


	<?php
	/*
	 * Header main
	 */
	?>
	<div class="header-main">

		<div class="header-wrap<?php if ( has_nav_menu( 'secondary' ) ) : ?> has-top-nav<?php endif; ?>">
			<div class="row align-justify align-middle">
				<div class="columns small-48 text-right">
					
					<?php
					/*
					 * Get desktop navigation
					 */
					?>		
					<?php get_template_part('includes/nav/desktop-top-nav'); ?>
					
				</div>
				
				
				<div class="shrink small-24 large-10 xlarge-13 columns">
					<div class="brand">
						<a href="<?=home_url('/');?>" title="<?= get_bloginfo('name'); echo ' - '.get_bloginfo('description'); ?>">
							
							<?php if( get_field('company_logo', 'option') ): ?>
							
							<figure>
								<img src="<?php the_field('company_logo', 'option'); ?>" alt="<?= get_bloginfo('name'); ?>" title="<?= get_bloginfo('name'); ?>" />
							</figure>
							
							<?php else : ?>
							
							<span class="logo-placeholder"><?= get_bloginfo('name'); ?></span>
							
							<?php endif; ?>
						</a>
					</div>
				</div>
				

				<div class="shrink small-24 large-38 xlarge-35 column">
					<div class="mobile-navigation">
					
					<?php
					
						// var
						$companyPhone = get_field('company_phone', 'option');
						$phoneCaller = preg_replace('/\s+/', '', $companyPhone);

						if ($companyPhone) : ?>
						
							<a href="tel:<?= $phoneCaller; ?>" class="phone-number" title="<?php _e('Bel:', 'nordique'); ?> <?= $companyPhone; ?>"><i class="far fa-phone"></i></a>
						
						<?php endif; ?>

						<button id="navicon" class="hamburger hamburger--squeeze" type="button" data-toggle="offCanvas">
					    <span class="hamburger-box">
					      <span class="hamburger-inner"></span>
					    </span>
					  </button>
					</div>

					<div class="desktop-navigation">
						
						<?php
						/*
						 * Get desktop navigation
						 */
						?>
						<?php get_template_part('includes/nav/desktop-nav'); ?>
					</div>

				</div>
			</div>
		</div>
	</div>
</header>