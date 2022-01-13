<?php
// mobile menu (main-menu)
$mobile_main = array(
	'theme_location'  => 'primary',
	'menu'            => 'primary',
	'container'       => 'nav',
	'container_id'    => 'mobile-menu',
	'echo'            => true,
	'fallback_cb'     => 'wp_page_menu',
	'depth'           => 0,
	'items_wrap'      => '<ul class="vertical menu accordion-menu">%3$s</ul>',
	'after'			  => '<span class="submenu-toggle plus"></span>',
);

$mobile_top_nav = array(
	'theme_location'  => 'secondary',
	'menu'            => 'secondary',
	'container'       => 'nav',
	'container_id'    => 'mobile-topmenu',
	'echo'            => true,
	'fallback_cb'     => 'wp_page_menu',
	'depth'           => 0,
	'items_wrap'      => '<ul class="vertical menu accordion-menu">%3$s</ul>',
	'after'			  => '<span class="submenu-toggle plus"></span>',
);

?>
<!-- mobile menu -->
<?php wp_nav_menu( $mobile_main ); ?>

<?php if ( has_nav_menu( 'secondary' ) ) : ?>
	<?php wp_nav_menu( $mobile_top_nav  ); ?>
<?php endif; ?>

<div class="row ">
	<?php if($cta = get_field('company_header_button', 'option')) : ?>
	<div class="columns small-48">
		<a href="<?=$cta['url'];?>" title="<?=$cta['title'];?>" target="<?=$cta['target'];?>" class="btn-secondary has-arrow nav-cta"><?=$cta['title'];?></a>
	</div>
	<div class="columns small-48 mobile__searchform  text-center">
		<?php get_template_part('includes/content/search-form'); ?>
	</div>
	<?php endif; ?>
</div>