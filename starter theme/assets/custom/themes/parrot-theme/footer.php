<div class="footer-overlay"></div>

<footer id="footer" class="primary-bg">
	<div class="footer-top">
		<div class="row">

			<?php if (get_field('company_footer_menu_choice', 'option')) : ?>

				<div class="column small-48 medium-24 large-18">

				<?php else : ?>

					<div class="column small-48 medium-22">

					<?php endif; ?>

					<div class="content-block">

						<?php if ($text = get_field('company_footer_text', 'option')) : ?>
							<?= $text; ?>
						<?php endif; ?>

						<?php if ($button = get_field('company_footer_button', 'option')) : ?>

							<a href="<?= $button['url']; ?>" target="<?= $button['target']; ?>" title="<?= $button['title']; ?>" class="btn-white has-arrow"><?= $button['title']; ?></a>
						<?php endif; ?>

					</div>
					</div>

					<?php if (get_field('company_footer_menu_choice', 'option')) : ?>

						<div class="column small-48 medium-24 large-offset-4 large-13">

						<?php else : ?>

							<div class="column small-48 medium-24 large-offset-4 large-22">

							<?php endif; ?>
							<?php
							$menu_name = 'footer';
							$locations = get_nav_menu_locations();
							if (isset($locations) && isset($locations[$menu_name])) {
								$menu_id = $locations[$menu_name];
								$menu_name = wp_get_nav_menu_object($menu_id)->name;
								$menu_name = '<h3 class="is-h4">' . $menu_name . '</h3>';
								wp_nav_menu(array(
									'theme_location' 	=> 'footer',
									'container_class' => 'link-block',
									'depth' 					=> 1,
									'items_wrap' 			=> $menu_name . '<ul class="arrow-list link-list">%3$s</ul>',
								));
							}
							?>
							</div>

							<?php if (get_field('company_footer_menu_choice', 'option')) : ?>

								<div class="column small-48 medium-24 large-13">

									<?php
									$menu_name = 'secondary_footer';
									$locations = get_nav_menu_locations();
									if (isset($locations) && isset($locations[$menu_name])) {
										$menu_id = $locations[$menu_name];
										$menu_name = wp_get_nav_menu_object($menu_id)->name;
										$menu_name = '<h3 class="is-h4">' . $menu_name . '</h3>';
										wp_nav_menu(array(
											'theme_location' 	=> 'secondary_footer',
											'container_class' => 'link-block',
											'depth' 					=> 1,
											'items_wrap' 			=> $menu_name . '<ul class="arrow-list link-list">%3$s</ul>',
										));
									}
									?>

								</div>

							<?php endif; ?>

						</div>
				</div>

				<div class="footer-bottom">
					<div class="row align-middle align-justify">
						<div class="column small-48 medium-shrink small-order-2 medium-order-1">
							<span>Copyright <i class="far fa-copyright"></i> <?= date('Y') . ' ' .  get_bloginfo('name'); ?></span>
							<?php if (get_field('company_privacy_declaration', 'option')) : ?>
								<a class="privacy" href="<?= the_field('company_privacy_declaration', 'option'); ?>" target="_blank" title="<?= __('Privacy statement', 'DEFINE_LANG'); ?>"><?= __('Privacy statement', 'DEFINE_LANG'); ?></a>
							<?php endif; ?>
						</div>
						<div class="column small-48 medium-shrink small-order-1 medium-order-2">
							<ul class="social-list">

								<?php $socials = array(
									'facebook' 	=> 'facebook-f',
									'twitter' 	=> 'twitter',
									'linkedin' 	=> 'linkedin',
									'instagram' => 'instagram',
									'youtube' 	=> 'youtube',
									'vimeo' 		=> 'vimeo-v',
									'pinterest' => 'pinterest',
									'skype' 		=> 'skype',
								);
								?>

								<?php foreach ($socials as $social => $class) : ?>

									<?php if ($field = get_field('sm_' . $social, 'option')) : ?>

										<li><a class="sm_<?= $class; ?>" href="<?= $field; ?>" title="<?= ucfirst($social); ?>" target="_blank"><i class="fab fa-<?= $class; ?>"></i></a></li>

									<?php endif; ?>
								<?php endforeach; ?>

							</ul>
						</div>
					</div>
				</div>

</footer>

<?php wp_footer(); ?>


<?php
/*
 * mobile menu wrapper
 */
?>
<div class="off-canvas position-right" id="offCanvas" data-off-canvas data-content-scroll="false">

	<?php get_template_part('includes/nav/mobile-nav'); ?>

</div>


<?php
/*
 * CDN loader for FontAwesome
 */
?>
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.0.10/css/regular.css" integrity="sha384-D4yOV+i5oKU6w8CiadBDVtSim/UXmlmQfrIdRsuKT3nYhiF/Tb6YLQtyF9l0vqQF" crossorigin="anonymous" defer>
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.0.10/css/brands.css" integrity="sha384-cyAsyPMdnj21FGg6BEGfZdZ99a/opKBeFa8z5VoHPsPj+tLRYSxkRlPWnGkCJGyA" crossorigin="anonymous" defer>
<link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.0.10/css/fontawesome.css" integrity="sha384-HE+OCjOJOPZavEcVffA6E24sIfY2RwV4JRieXa/3N5iCY8vgnTwZemElENQ8ak/K" crossorigin="anonymous" defer>

</body>

</html>